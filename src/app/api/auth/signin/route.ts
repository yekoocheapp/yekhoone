import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { comparePassword, signToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contact, password } = body;

    if (!contact || !password) {
      return NextResponse.json(
        { error: "شماره/ایمیل و کلمه عبور الزامی است." },
        { status: 400 }
      );
    }

    const normalizedContact = contact.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { contact: normalizedContact },
      include: {
        buyerProfile: true,
        sellerProfile: true,
        agentProfile: true,
        agency: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "کاربری با این مشخصات یافت نشد. لطفاً ابتدا ثبت‌نام فرمایید." },
        { status: 404 }
      );
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "کلمه عبور وارد شده نادرست است." },
        { status: 401 }
      );
    }

    const token = signToken({
      userId: user.id,
      contact: user.contact,
      role: user.role,
      fullName: user.fullName
    });

    const response = NextResponse.json({
      success: true,
      message: `خوش آمدید ${user.fullName}!`,
      user: {
        id: user.id,
        fullName: user.fullName,
        contact: user.contact,
        role: user.role,
        buyerProfile: user.buyerProfile,
        sellerProfile: user.sellerProfile,
        agentProfile: user.agentProfile,
        agency: user.agency
      }
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/"
    });

    return response;
  } catch (error: any) {
    console.error("SignIn API Error:", error);
    return NextResponse.json(
      { error: "خطایی هنگام ورود رخ داد." },
      { status: 500 }
    );
  }
}
