import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get("locationId");
    const days = parseInt(searchParams.get("days") ?? "30");

    const since = new Date();
    since.setDate(since.getDate() - days);

    const citations = await prisma.citation.findMany({
      where: {
        measurement: {
          locationId: locationId ?? undefined,
          createdAt: { gte: since },
        },
      },
      include: {
        measurement: { select: { createdAt: true, visibility: true } },
      },
    });

    // ドメイン別集計
    const domainMap = new Map<
      string,
      {
        domain: string;
        count: number;
        type: string;
        isOfficial: boolean;
        isCompetitor: boolean;
      }
    >();

    for (const c of citations) {
      const existing = domainMap.get(c.domain);
      if (existing) {
        existing.count++;
      } else {
        domainMap.set(c.domain, {
          domain: c.domain,
          count: 1,
          type: c.type,
          isOfficial: c.isOfficial,
          isCompetitor: c.isCompetitor,
        });
      }
    }

    const totalCitations = citations.length;
    const domainRanking = Array.from(domainMap.values())
      .sort((a, b) => b.count - a.count)
      .map((d) => ({
        ...d,
        percentage:
          totalCitations > 0
            ? Math.round((d.count / totalCitations) * 100 * 10) / 10
            : 0,
      }));

    // Official Citation Rate
    const visibleMeasurements = await prisma.measurement.count({
      where: {
        locationId: locationId ?? undefined,
        createdAt: { gte: since },
        visibility: { not: "NOT_MENTIONED" },
      },
    });

    const officialCitationCount = citations.filter((c) => c.isOfficial).length;
    const officialCitationRate =
      visibleMeasurements > 0
        ? (officialCitationCount / visibleMeasurements) * 100
        : 0;

    return NextResponse.json({
      totalCitations,
      officialCitationRate: Math.round(officialCitationRate * 10) / 10,
      domainRanking,
    });
  } catch (error) {
    console.error("GET /api/citations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch citations" },
      { status: 500 }
    );
  }
}
