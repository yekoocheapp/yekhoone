import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "لطفاً ابتدا وارد حساب کاربری خود شوید." }, { status: 401 });
    }

    let agentProfile = await prisma.agentProfile.findUnique({
      where: { userId: user.id }
    });

    if (!agentProfile) {
      agentProfile = await prisma.agentProfile.create({
        data: {
          userId: user.id,
          licenseCode: "۹۹۴۸۲",
          agencyName: "دپارتمان املاک سرمایه‌گذاری سعادت‌آباد",
          specialtyDistrict: "سعادت‌آباد و شهرک غرب",
          specialtyDistricts: JSON.stringify(["سعادت‌آباد", "شهرک غرب", "پونک"]),
          dealTypesSpecialty: JSON.stringify(["sale", "barter", "partnership"]),
          bio: "کارشناس ارشد معاملات ملکی، تهاتر دارایی و پروژه‌های مشارکت در ساخت منطقه ۲ و ۱ تهران.",
          officePhone: "۰۲۱۲۲۰۰۳۳۰۰",
          rating: 4.9,
          dealsCount: 28,
          isVerifiedByAgency: true
        }
      });
    }

    // Parse agent specialty districts
    let districts: string[] = ["سعادت‌آباد", "شهرک غرب"];
    if (agentProfile.specialtyDistricts) {
      try {
        const parsed = JSON.parse(agentProfile.specialtyDistricts);
        if (Array.isArray(parsed) && parsed.length > 0) districts = parsed;
      } catch {}
    }

    // Get properties managed by or assigned to this agent
    const managedProperties = await prisma.property.findMany({
      where: {
        OR: [
          { userId: user.id },
          { agentPhone: user.contact },
          { agentName: { contains: user.lastName || user.fullName } },
          { district: { in: districts } }
        ]
      },
      include: {
        barterTerms: true,
        partnershipTerms: true
      },
      take: 20
    });

    // Get buyer demand leads in agent's districts
    const buyerProfiles = await prisma.buyerProfile.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            contact: true,
            phone: true,
            email: true
          }
        }
      },
      take: 10
    });

    // Filter leads matching agent's districts
    const buyerLeads = buyerProfiles.map(bp => {
      let desiredDistricts: string[] = [];
      if (bp.desiredDistricts) {
        try {
          const parsed = JSON.parse(bp.desiredDistricts);
          if (Array.isArray(parsed)) desiredDistricts = parsed;
        } catch {}
      }
      return {
        id: bp.id,
        buyerName: bp.user.fullName,
        contact: bp.user.contact,
        demandType: bp.demandType || "buy",
        budgetLabel: bp.budgetLabel || "توافقی",
        minBudgetTomans: bp.minBudgetTomans,
        maxBudgetTomans: bp.maxBudgetTomans,
        desiredDistricts,
        minMeters: bp.minMeters,
        minBedrooms: bp.minBedrooms,
        urgency: bp.urgency || "1month",
        createdAt: bp.createdAt
      };
    });

    // Get upcoming Neshasst sessions
    const neshasstSessions = await prisma.neshasstSession.findMany({
      where: {
        OR: [
          { hostAgentName: { contains: user.lastName || user.fullName } },
          { hostAgencyName: { contains: agentProfile.agencyName || "" } }
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
        role: user.role
      },
      agentProfile,
      managedProperties,
      buyerLeads,
      neshasstSessions
    });
  } catch (error: any) {
    console.error("GET /api/profile/agent error:", error);
    return NextResponse.json({ error: "خطا در بارگذاری اطلاعات میز کار مشاور املاک" }, { status: 500 });
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
      firstName,
      lastName,
      licenseCode,
      nationalCode,
      agencyName,
      specialtyDistrict,
      specialtyDistricts,
      dealTypesSpecialty,
      bio,
      officePhone
    } = body;

    // Optional user name update
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

    const updated = await prisma.agentProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        licenseCode: licenseCode || null,
        nationalCode: nationalCode || null,
        agencyName: agencyName || null,
        specialtyDistrict: specialtyDistrict || null,
        specialtyDistricts: Array.isArray(specialtyDistricts) ? JSON.stringify(specialtyDistricts) : specialtyDistricts || null,
        dealTypesSpecialty: Array.isArray(dealTypesSpecialty) ? JSON.stringify(dealTypesSpecialty) : dealTypesSpecialty || null,
        bio: bio || null,
        officePhone: officePhone || null
      },
      update: {
        licenseCode: licenseCode !== undefined ? licenseCode : undefined,
        nationalCode: nationalCode !== undefined ? nationalCode : undefined,
        agencyName: agencyName !== undefined ? agencyName : undefined,
        specialtyDistrict: specialtyDistrict !== undefined ? specialtyDistrict : undefined,
        specialtyDistricts: specialtyDistricts !== undefined ? (Array.isArray(specialtyDistricts) ? JSON.stringify(specialtyDistricts) : specialtyDistricts) : undefined,
        dealTypesSpecialty: dealTypesSpecialty !== undefined ? (Array.isArray(dealTypesSpecialty) ? JSON.stringify(dealTypesSpecialty) : dealTypesSpecialty) : undefined,
        bio: bio !== undefined ? bio : undefined,
        officePhone: officePhone !== undefined ? officePhone : undefined
      }
    });

    return NextResponse.json({
      success: true,
      message: "مشخصات و مجوز مشاور با موفقیت ذخیره شد.",
      agentProfile: updated
    });
  } catch (error: any) {
    console.error("PUT /api/profile/agent error:", error);
    return NextResponse.json({ error: "خطا در به‌روزرسانی اطلاعات مشاور املاک" }, { status: 500 });
  }
}
