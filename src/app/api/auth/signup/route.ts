import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, signToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, contact, password, role = "buyer" } = body;

    if (!firstName || !lastName || !contact || !password) {
      return NextResponse.json(
        { error: "تمامی فیلدهای ستاره‌دار الزامی هستند." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "کلمه عبور باید حداقل ۶ کاراکتر باشد." },
        { status: 400 }
      );
    }

    const normalizedContact = contact.trim().toLowerCase();
    const isEmail = normalizedContact.includes("@");

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { contact: normalizedContact }
    });

    if (existing) {
      return NextResponse.json(
        { error: "کاربری با این شماره یا ایمیل قبلاً در سامانه ثبت‌نام کرده است." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    // Create user and profile
    const newUser = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        fullName,
        contact: normalizedContact,
        email: isEmail ? normalizedContact : null,
        phone: !isEmail ? normalizedContact : null,
        passwordHash,
        role: role || "buyer",
        isVerified: false,
        buyerProfile:
          role === "buyer"
            ? {
                create: {
                  demandType: "buy",
                  budgetLabel: "توافقی"
                }
              }
            : undefined,
        sellerProfile:
          role === "seller"
            ? {
                create: {
                  nationalIdVerified: false
                }
              }
            : undefined,
        agentProfile:
          role === "agent"
            ? {
                create: {
                  specialtyDistrict: "کل تهران",
                  rating: 5.0,
                  dealsCount: 0
                }
              }
            : undefined
      },
      include: {
        buyerProfile: true,
        sellerProfile: true,
        agentProfile: true,
        agency: true
      }
    });

    const token = signToken({
      userId: newUser.id,
      contact: newUser.contact,
      role: newUser.role,
      fullName: newUser.fullName
    });

    const response = NextResponse.json({
      success: true,
      message: `حساب کاربری «${fullName}» با موفقیت ایجاد شد.`,
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        contact: newUser.contact,
        role: newUser.role,
        buyerProfile: newUser.buyerProfile,
        sellerProfile: newUser.sellerProfile,
        agentProfile: newUser.agentProfile
      }
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/"
    });

    return response;
  } catch (error: any) {
    console.error("SignUp API Error:", error);
    return NextResponse.json(
      { error: "خطای سرور هنگام ثبت‌نام رخ داد. لطفاً مجدداً تلاش فرمایید." },
      { status: 500 }
    );
  }
}
