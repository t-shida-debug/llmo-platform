import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const CreateLocationSchema = z.object({
  brandId: z.string(),
  name: z.string().min(1),
  officialName: z.string().optional(),
  url: z.string().url().optional(),
  address: z.string().optional(),
  prefecture: z.string().optional(),
  city: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  googleBusinessUrl: z.string().url().optional(),
  googleMapUrl: z.string().url().optional(),
  phone: z.string().optional(),
  aliases: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brandId");

    const locations = await prisma.location.findMany({
      where: brandId ? { brandId } : undefined,
      include: {
        brand: { include: { organization: true } },
        aliases: true,
        scores: {
          orderBy: { date: "desc" },
          take: 1,
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(locations);
  } catch (error) {
    console.error("GET /api/locations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = CreateLocationSchema.parse(body);
    const { aliases, ...locationData } = data;

    const location = await prisma.location.create({
      data: {
        ...locationData,
        aliases: aliases?.length
          ? { create: aliases.map((alias) => ({ alias })) }
          : undefined,
      },
      include: { aliases: true },
    });

    return NextResponse.json(location, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("POST /api/locations error:", error);
    return NextResponse.json(
      { error: "Failed to create location" },
      { status: 500 }
    );
  }
}
