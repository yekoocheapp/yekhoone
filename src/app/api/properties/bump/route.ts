import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "لطفاً ابتدا وارد حساب کاربری خود شوید." }, { status: 401 });
    }

    const body = await request.json();
    const { propertyId } = body;

    if (!propertyId) {
      return NextResponse.json({ error: "شناسه ملک الزامی است." }, { status: 400 });
    }

    const updated = await prisma.property.update({
      where: { id: Number(propertyId) },
      data: {
        lastAlgorithmicBump: "همین الان (به‌روزرسانی اختصاصی مشاور)",
        nextAlgorithmicBump: "۴ ساعت دیگر"
      }
    });

    return NextResponse.json({
      success: true,
      message: `ملک «${updated.title}» با موفقیت نردبان شد و در صدر نتایج قرار گرفت.`,
      property: updated
    });
  } catch (error: any) {
    console.error("Bump error:", error);
    return NextResponse.json({ error: "خطا در نردبان ملک" }, { status: 500 });
  }
}
