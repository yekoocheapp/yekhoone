import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const propId = Number(id);

    if (isNaN(propId)) {
      return NextResponse.json({ error: "شناسه فایل نامعتبر است." }, { status: 400 });
    }

    const property = await prisma.property.findUnique({
      where: { id: propId },
      include: {
        barterTerms: true,
        partnershipTerms: true,
        agency: true
      }
    });

    if (!property) {
      return NextResponse.json({ error: "فایل ملکی مورد نظر یافت نشد." }, { status: 404 });
    }

    const formatted = {
      ...property,
      images: property.images ? JSON.parse(property.images) : [],
      tags: property.tags ? JSON.parse(property.tags) : [],
      virtualTour: property.virtualTourData ? JSON.parse(property.virtualTourData) : null,
      coordinates: { lat: property.lat, lng: property.lng }
    };

    return NextResponse.json({ success: true, property: formatted });
  } catch (error) {
    console.error("GET Property By ID Error:", error);
    return NextResponse.json({ error: "خطا در واکشی مشخصات فایل" }, { status: 500 });
  }
}
