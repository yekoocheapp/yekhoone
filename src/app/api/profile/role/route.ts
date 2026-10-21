import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "لطفاً ابتدا وارد حساب کاربری خود شوید." }, { status: 401 });
    }

    const body = await request.json();
    const { role } = body;

    if (!role || !["buyer", "seller", "agent", "agency"].includes(role)) {
      return NextResponse.json({ error: "نقش نامعتبر است." }, { status: 400 });
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role },
      include: {
        buyerProfile: true,
        sellerProfile: true,
        agentProfile: true,
        agency: true
      }
    });

    // Ensure relevant sub-profile exists
    if (role === "agent" && !updatedUser.agentProfile) {
      await prisma.agentProfile.create({
        data: {
          userId: user.id,
          specialtyDistrict: "کل تهران",
          rating: 5.0,
          dealsCount: 0
        }
      });
    } else if (role === "seller" && !updatedUser.sellerProfile) {
      await prisma.sellerProfile.create({
        data: {
          userId: user.id,
          nationalIdVerified: false
        }
      });
    } else if (role === "buyer" && !updatedUser.buyerProfile) {
      await prisma.buyerProfile.create({
        data: {
          userId: user.id,
          demandType: "buy",
          budgetLabel: "توافقی"
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: `نقش شما با موفقیت به «${
        role === "agent" ? "مشاور املاک" : role === "seller" ? "مالک و سازنده" : role === "agency" ? "دپارتمان املاک" : "متقاضی مسکن"
      }» تغییر یافت.`,
      role
    });
  } catch (error: any) {
    console.error("PUT /api/profile/role error:", error);
    return NextResponse.json({ error: "خطا در تغییر نقش کاربری" }, { status: 500 });
  }
}
