import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        contact: user.contact,
        role: user.role,
        buyerProfile: user.buyerProfile,
        sellerProfile: user.sellerProfile,
        agentProfile: user.agentProfile,
        agency: user.agency
      }
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false, error: "خطا در احراز هویت" }, { status: 500 });
  }
}
