import { NextResponse } from "next/server";
import { getAvailableProviders } from "@/lib/providers";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const providers = getAvailableProviders();

    // APIコスト取得（今月分）
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const costs = await prisma.apiCost.findMany({
      where: { date: { gte: startOfMonth } },
    });

    const costByProvider = costs.reduce(
      (acc, c) => {
        const key = c.providerType;
        if (!acc[key]) acc[key] = { requests: 0, tokens: 0, costUsd: 0 };
        acc[key].requests += c.requestCount;
        acc[key].tokens += c.tokenCount;
        acc[key].costUsd += c.costUsd;
        return acc;
      },
      {} as Record<string, { requests: number; tokens: number; costUsd: number }>
    );

    const result = providers.map((p) => ({
      ...p,
      monthlyStats: costByProvider[p.type] ?? {
        requests: 0,
        tokens: 0,
        costUsd: 0,
      },
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/providers error:", error);
    return NextResponse.json(
      { error: "Failed to fetch providers" },
      { status: 500 }
    );
  }
}
