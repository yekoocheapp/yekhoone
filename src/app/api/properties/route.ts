import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dealType = searchParams.get("type"); // rent, sale, barter, partnership
    const propertyType = searchParams.get("propertyType"); // آپارتمان, ویلایی, زمین, باغ, کلنگی
    const district = searchParams.get("district");
    const search = searchParams.get("search");
    const onlyVirtualTour = searchParams.get("virtualTour") === "true";

    // Build where clause
    const where: any = {};

    if (dealType && dealType !== "all") {
      if (dealType === "barter") {
        where.OR = [{ type: "barter" }, { isBarter: true }];
      } else if (dealType === "partnership") {
        where.OR = [{ type: "partnership" }, { isPartnership: true }];
      } else {
        where.type = dealType;
      }
    }

    if (propertyType && propertyType !== "همه") {
      where.propertyType = { contains: propertyType };
    }

    if (district && district !== "همه") {
      where.district = district;
    }

    if (onlyVirtualTour) {
      where.hasVirtualTour = true;
    }

    if (search && search.trim() !== "") {
      const q = search.trim();
      where.OR = [
        ...(where.OR || []),
        { title: { contains: q } },
        { address: { contains: q } },
        { district: { contains: q } },
        { description: { contains: q } }
      ];
    }

    const properties = await prisma.property.findMany({
      where,
      include: {
        barterTerms: true,
        partnershipTerms: true,
        agency: {
          select: { id: true, name: true, phone: true, isVerified: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // Parse JSON fields (images, tags, virtualTourData)
    const formatted = properties.map((p) => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : [],
      tags: p.tags ? JSON.parse(p.tags) : [],
      virtualTour: p.virtualTourData ? JSON.parse(p.virtualTourData) : null,
      coordinates: { lat: p.lat, lng: p.lng }
    }));

    return NextResponse.json({
      success: true,
      count: formatted.length,
      properties: formatted
    });
  } catch (error: any) {
    console.error("GET Properties Error:", error);
    return NextResponse.json(
      { error: "خطایی هنگام واکشی فایل‌های ملکی رخ داد." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();

    const {
      title,
      district,
      address,
      type = "sale",
      propertyType = "آپارتمان",
      meters,
      bedrooms = 0,
      floor = 0,
      totalFloors = 1,
      totalPrice,
      deposit,
      rent,
      hasParking = false,
      hasElevator = false,
      hasStorage = false,
      description = "",
      images = [],
      lat = 35.79,
      lng = 51.37,
      barterTerms,
      partnershipTerms
    } = body;

    if (!title || !district || !meters) {
      return NextResponse.json(
        { error: "عنوان آگهی، محله و متراژ ملک الزامی است." },
        { status: 400 }
      );
    }

    const slug = `${title.trim().toLowerCase().replace(/[\s\W]+/g, "-")}-${Date.now().toString().slice(-4)}`;

    const isBarter = type === "barter" || !!barterTerms;
    const isPartnership = type === "partnership" || !!partnershipTerms;

    const property = await prisma.property.create({
      data: {
        title: title.trim(),
        slug,
        district,
        address: address || `تهران، ${district}`,
        type,
        propertyType,
        meters: Number(meters),
        bedrooms: Number(bedrooms),
        floor: Number(floor),
        totalFloors: Number(totalFloors),
        totalPrice: totalPrice ? totalPrice.toString() : null,
        deposit: deposit ? deposit.toString() : null,
        rent: rent ? rent.toString() : null,
        hasParking: Boolean(hasParking),
        hasElevator: Boolean(hasElevator),
        hasStorage: Boolean(hasStorage),
        description: description || `ملک ${propertyType} واقع در محله ${district}`,
        images: JSON.stringify(images.length ? images : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"]),
        tags: JSON.stringify([propertyType, district, type === "rent" ? "رهن و اجاره" : type === "barter" ? "تهاتر" : type === "partnership" ? "مشارکت" : "فروش"]),
        lat: Number(lat),
        lng: Number(lng),
        isBarter,
        isPartnership,
        userId: user ? user.id : null,
        agencyName: user?.role === "agent" || user?.role === "agency" ? "دپارتمان املاک رسمی" : "ثبت مستقیم مالک",
        agentName: user ? user.fullName : "مالک مستقیم",
        agentPhone: user?.phone || user?.contact || "۰۹۱۲۰۰۰۰۰۰۰",
        lastAlgorithmicBump: "لحظاتی پیش",
        nextAlgorithmicBump: "۶ ساعت دیگر"
      }
    });

    if (isBarter && barterTerms) {
      await prisma.barterTerms.create({
        data: {
          propertyId: property.id,
          targetAsset: barterTerms.targetAsset || "apartment",
          targetAssetLabel: barterTerms.targetAssetLabel || "تهاتر با ملک دیگر",
          cashDeltaTomans: barterTerms.cashDeltaTomans ? barterTerms.cashDeltaTomans.toString() : null,
          isDirectSwap: Boolean(barterTerms.isDirectSwap),
          notes: barterTerms.notes || null
        }
      });
    }

    if (isPartnership && partnershipTerms) {
      await prisma.partnershipTerms.create({
        data: {
          propertyId: property.id,
          ownerSharePercent: Number(partnershipTerms.ownerSharePercent || 60),
          builderSharePercent: Number(partnershipTerms.builderSharePercent || 40),
          belaAvazTomans: partnershipTerms.belaAvazTomans ? partnershipTerms.belaAvazTomans.toString() : null,
          projectDurationMonths: Number(partnershipTerms.projectDurationMonths || 24),
          permitStatus: partnershipTerms.permitStatus || null,
          builderReputationNotes: partnershipTerms.builderReputationNotes || null
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: "فایل ملکی با موفقیت در پایگاه‌داده سامانه یه خونه ثبت شد.",
      property
    });
  } catch (error: any) {
    console.error("POST Property Error:", error);
    return NextResponse.json(
      { error: "خطایی هنگام ثبت فایل ملکی رخ داد." },
      { status: 500 }
    );
  }
}
