import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.property.findMany({
      where: {
        OR: [{ type: "partnership" }, { isPartnership: true }]
      },
      include: {
        partnershipTerms: true,
        agency: true
      },
      orderBy: { createdAt: "desc" }
    });

    const formatted = projects.map((p) => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : [],
      tags: p.tags ? JSON.parse(p.tags) : [],
      coordinates: { lat: p.lat, lng: p.lng }
    }));

    return NextResponse.json({
      success: true,
      count: formatted.length,
      partnershipProjects: formatted
    });
  } catch (error) {
    return NextResponse.json({ error: "خطا در واکشی پروژه‌های مشارکت در ساخت" }, { status: 500 });
  }
}
