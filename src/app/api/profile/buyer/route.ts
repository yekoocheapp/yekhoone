import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "لطفاً ابتدا وارد حساب کاربری خود شوید." }, { status: 401 });
    }

    let buyerProfile = await prisma.buyerProfile.findUnique({
      where: { userId: user.id }
    });

    if (!buyerProfile) {
      buyerProfile = await prisma.buyerProfile.create({
        data: {
          userId: user.id,
          demandType: "buy",
          budgetLabel: "توافقی"
        }
      });
    }

    // Get user favorites
    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: {
        property: {
          include: {
            barterTerms: true,
            partnershipTerms: true
          }
        }
      }
    });

    // Get upcoming neshasst sessions for this buyer
    const neshasstSessions = await prisma.neshasstSession.findMany({
      where: {
        OR: [
          { buyerPhone: user.contact },
          { buyerName: user.fullName }
        ]
      },
      include: {
        property: true
      }
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        firstName: user.firstName,
        lastName: user.lastName,
        contact: user.contact,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      },
      buyerProfile,
      favorites: favorites.map(f => f.property),
      neshasstSessions
    });
  } catch (error: any) {
    console.error("GET /api/profile/buyer error:", error);
    return NextResponse.json({ error: "خطا در دریافت اطلاعات پروفایل متقاضی" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "لطفاً ابتدا وارد حساب کاربری خود شوید." }, { status: 401 });
    }

    const body = await request.json();
    const {
      demandType,
      budgetLabel,
      minBudgetTomans,
      maxBudgetTomans,
      desiredDistricts,
      minMeters,
      minBedrooms,
      propertyTypes,
      amenities,
      urgency,
      barterAssetsJson,
      firstName,
      lastName
    } = body;

    // Optional update to user's name
    if (firstName && lastName) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          fullName: `${firstName.trim()} ${lastName.trim()}`
        }
      });
    }

    // Upsert buyer profile
    const updated = await prisma.buyerProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        demandType: demandType || "buy",
        budgetLabel: budgetLabel || "توافقی",
        minBudgetTomans: minBudgetTomans ? String(minBudgetTomans) : null,
        maxBudgetTomans: maxBudgetTomans ? String(maxBudgetTomans) : null,
        desiredDistricts: Array.isArray(desiredDistricts) ? JSON.stringify(desiredDistricts) : (desiredDistricts || null),
        minMeters: minMeters ? parseFloat(minMeters) : null,
        minBedrooms: minBedrooms ? parseInt(minBedrooms) : null,
        propertyTypes: Array.isArray(propertyTypes) ? JSON.stringify(propertyTypes) : (propertyTypes || null),
        amenities: Array.isArray(amenities) ? JSON.stringify(amenities) : (amenities || null),
        urgency: urgency || "1month",
        barterAssetsJson: Array.isArray(barterAssetsJson) ? JSON.stringify(barterAssetsJson) : (barterAssetsJson || null)
      },
      update: {
        demandType: demandType !== undefined ? demandType : undefined,
        budgetLabel: budgetLabel !== undefined ? budgetLabel : undefined,
        minBudgetTomans: minBudgetTomans !== undefined ? (minBudgetTomans ? String(minBudgetTomans) : null) : undefined,
        maxBudgetTomans: maxBudgetTomans !== undefined ? (maxBudgetTomans ? String(maxBudgetTomans) : null) : undefined,
        desiredDistricts: desiredDistricts !== undefined ? (Array.isArray(desiredDistricts) ? JSON.stringify(desiredDistricts) : desiredDistricts) : undefined,
        minMeters: minMeters !== undefined ? (minMeters ? parseFloat(minMeters) : null) : undefined,
        minBedrooms: minBedrooms !== undefined ? (minBedrooms ? parseInt(minBedrooms) : null) : undefined,
        propertyTypes: propertyTypes !== undefined ? (Array.isArray(propertyTypes) ? JSON.stringify(propertyTypes) : propertyTypes) : undefined,
        amenities: amenities !== undefined ? (Array.isArray(amenities) ? JSON.stringify(amenities) : amenities) : undefined,
        urgency: urgency !== undefined ? urgency : undefined,
        barterAssetsJson: barterAssetsJson !== undefined ? (Array.isArray(barterAssetsJson) ? JSON.stringify(barterAssetsJson) : barterAssetsJson) : undefined
      }
    });

    return NextResponse.json({
      success: true,
      message: "تنظیمات و معیارهای متقاضی با موفقیت ذخیره شد.",
      buyerProfile: updated
    });
  } catch (error: any) {
    console.error("PUT /api/profile/buyer error:", error);
    return NextResponse.json({ error: "خطا در به‌روزرسانی پروفایل متقاضی" }, { status: 500 });
  }
}
