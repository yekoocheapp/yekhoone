import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const sessions = await prisma.neshasstSession.findMany({
      include: {
        property: {
          select: { id: true, title: true, district: true, images: true, type: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, count: sessions.length, sessions });
  } catch (error) {
    return NextResponse.json({ error: "خطا در دریافت لیست نشست‌های آنلاین" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const {
      propertyId,
      scheduledDate,
      scheduledTime,
      buyerName,
      buyerPhone,
      sellerName,
      sellerPhone,
      contractDraft
    } = body;

    if (!propertyId || !scheduledDate || !scheduledTime) {
      return NextResponse.json(
        { error: "مشخصات ملک و زمان‌بندی نشست الزامی است." },
        { status: 400 }
      );
    }

    const prop = await prisma.property.findUnique({
      where: { id: Number(propertyId) }
    });

    if (!prop) {
      return NextResponse.json({ error: "ملک یافت نشد." }, { status: 404 });
    }

    const session = await prisma.neshasstSession.create({
      data: {
        propertyId: prop.id,
        title: `نشست بررسی قرارداد ${prop.title}`,
        propertyAddress: prop.address,
        scheduledDate,
        scheduledTime,
        status: "scheduled",
        hostAgentName: user ? user.fullName : prop.agentName || "مشاور معتمد دپارتمان",
        hostAgencyName: prop.agencyName || "دفتر معاملات رسمی",
        buyerName: buyerName || "متقاضی مسکن",
        buyerPhone: buyerPhone || "۰۹۱۲۰۰۰۰۰۰۰",
        sellerName: sellerName || prop.agentName || "مالک",
        sellerPhone: sellerPhone || prop.agentPhone || "۰۹۱۲۰۰۰۰۰۰۰",
        contractDraft: contractDraft || `پیش‌نویس قرارداد ${prop.type} با شروط مرضی‌الطرفین`
      }
    });

    return NextResponse.json({
      success: true,
      message: "اتاق نشست ۴ نفره آنلاین با موفقیت رزرو و زمان‌بندی شد.",
      session
    });
  } catch (error) {
    return NextResponse.json({ error: "خطا در ثبت جلسه نشست آنلاین" }, { status: 500 });
  }
}
