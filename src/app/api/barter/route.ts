import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetAsset = searchParams.get("targetAsset"); // villa, land, apartment, car

    const where: any = {
      OR: [{ type: "barter" }, { isBarter: true }]
    };

    if (targetAsset && targetAsset !== "all") {
      where.barterTerms = {
        targetAsset: { in: [targetAsset, "any"] }
      };
    }

    const items = await prisma.property.findMany({
      where,
      include: {
        barterTerms: true,
        agency: true
      },
      orderBy: { createdAt: "desc" }
    });

    const formatted = items.map((p) => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : [],
      tags: p.tags ? JSON.parse(p.tags) : [],
      coordinates: { lat: p.lat, lng: p.lng }
    }));

    return NextResponse.json({
      success: true,
      count: formatted.length,
      barterListings: formatted
    });
  } catch (error) {
    return NextResponse.json({ error: "خطا در واکشی آگهی‌های تهاتر" }, { status: 500 });
  }
}
