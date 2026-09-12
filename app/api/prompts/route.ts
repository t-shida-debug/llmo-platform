import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const CreatePromptSchema = z.object({
  text: z.string().min(1),
  region: z.string().optional(),
  symptom: z.string().optional(),
  intent: z
    .enum([
      "STORE_SEARCH",
      "SYMPTOM_SEARCH",
      "COMPARISON_SEARCH",
      "BRAND_SEARCH",
      "GENERAL",
    ])
    .default("GENERAL"),
  funnel: z.enum(["AWARENESS", "CONSIDERATION", "DECISION"]).optional(),
  category: z.string().optional(),
  importance: z.number().int().min(1).max(5).default(3),
  frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY"]).default("WEEKLY"),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const intent = searchParams.get("intent");
    const frequency = searchParams.get("frequency");

    const prompts = await prisma.prompt.findMany({
      where: {
        isActive: true,
        intent: intent as never ?? undefined,
        frequency: frequency as never ?? undefined,
      },
      orderBy: [{ importance: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(prompts);
  } catch (error) {
    console.error("GET /api/prompts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch prompts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = CreatePromptSchema.parse(body);

    const prompt = await prisma.prompt.create({ data });
    return NextResponse.json(prompt, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("POST /api/prompts error:", error);
    return NextResponse.json(
      { error: "Failed to create prompt" },
      { status: 500 }
    );
  }
}
