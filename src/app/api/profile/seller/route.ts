import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "لطفاً ابتدا وارد حساب کاربری خود شوید." }, { status: 401 });
    }

    let sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: user.id }
    });

    if (!sellerProfile) {
      sellerProfile = await prisma.sellerProfile.create({
        data: {
          userId: user.id,
          sellerType: "owner",
          nationalId: "۰۰۱۲۳۴۵۶۷۸",
          nationalIdVerified: true,
          deedVerified: true,
          propertyType: "آپارتمان مسکونی",
          district: "سعادت‌آباد",
          isBarterAccepted: true,
          barterTargetDescription: "تمایل به تهاتر آپارتمان با خودرو خارجی لوکس یا زمین ویلایی در کلاردشت و دماوند.",
          builderResumeJson: JSON.stringify([
            {
              id: "res-1",
              title: "مجتمع مسکونی نسترن سعادت‌آباد",
              district: "سعادت‌آباد، علامه شمالی",
              unitsCount: 10,
              year: "۱۴۰۲",
              style: "مدرن مینیمال",
              image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
            },
            {
              id: "res-2",
              title: "ویلای مدرن شهرک غرب",
              district: "شهرک غرب، فاز ۱",
              unitsCount: 1,
              year: "۱۴۰۱",
              style: "معماری سبز و استخر شیشه‌ای",
              image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
            }
          ])
        }
      });
    }

    // Get properties registered by this owner
    let ownedProperties = await prisma.property.findMany({
      where: {
        OR: [
          { userId: user.id },
          { agentPhone: user.contact }
        ]
      },
      include: {
        barterTerms: true,
        partnershipTerms: true
      }
    });

    // If owner has no properties yet, provide real properties for a realistic showcase
    if (ownedProperties.length === 0) {
      ownedProperties = await prisma.property.findMany({
        take: 3,
        include: {
          barterTerms: true,
          partnershipTerms: true
        }
      });
    }

    // Inbound Proposals (Sample real-world exchange & JV offers for owner)
    const inboundProposals = [
      {
        id: "prop-1",
        type: "barter",
        propertyTitle: ownedProperties[0]?.title || "آپارتمان نوساز علامه شمالی",
        senderName: "مهندس کامران رستگار",
        senderPhone: "۰۹۱۲۳۴۵۶۷۸۹",
        offeredAssetCategory: "خودرو خارجی",
        offeredAssetTitle: "لکسوس NX300 مدل ۲۰۱۸ فول عمان (بی‌رنگ)",
        offeredAssetValuation: "۶,۵۰۰,۰۰۰,۰۰۰ تومان",
        cashDelta: "پرداخت ۵,۵۰۰,۰۰۰,۰۰۰ تومان نقدینگی مابه‌التفاوت",
        date: "امروز ساعت ۱۴:۳۰",
        status: "pending"
      },
      {
        id: "prop-2",
        type: "partnership",
        propertyTitle: "ملک ۶۰۰ متری کلنگی سعادت‌آباد",
        senderName: "شرکت ساختمانی سازه‌گستر نوین (گرید ۱)",
        senderPhone: "۰۹۱۲۸۸۸۹۹۰۰",
        offeredAssetCategory: "مشارکت در ساخت",
        offeredAssetTitle: "سهم ۶۰٪ مالک به ۴۰٪ سازنده + ۱۶ میلیارد بلاعوض",
        offeredAssetValuation: "تضمین بانکی حسن انجام کار",
        cashDelta: "تامین ۱۰۰٪ هزینه ساخت و جواز",
        date: "دیروز",
        status: "pending"
      }
    ];

    // Upcoming Neshasst sessions
    const neshasstSessions = await prisma.neshasstSession.findMany({
      where: {
        OR: [
          { sellerPhone: user.contact },
          { sellerName: user.fullName }
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
      sellerProfile,
      ownedProperties,
      inboundProposals,
      neshasstSessions
    });
  } catch (error: any) {
    console.error("GET /api/profile/seller error:", error);
    return NextResponse.json({ error: "خطا در بارگذاری اطلاعات مالک و سازنده" }, { status: 500 });
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
      sellerType,
      companyName,
      nationalId,
      nationalIdVerified,
      deedVerified,
      propertyType,
      district,
      isBarterAccepted,
      barterTargetDescription,
      builderResumeJson
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

    const updated = await prisma.sellerProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        sellerType: sellerType || "owner",
        companyName: companyName || null,
        nationalId: nationalId || null,
        nationalIdVerified: nationalIdVerified !== undefined ? nationalIdVerified : false,
        deedVerified: deedVerified !== undefined ? deedVerified : false,
        propertyType: propertyType || null,
        district: district || null,
        isBarterAccepted: isBarterAccepted !== undefined ? isBarterAccepted : false,
        barterTargetDescription: barterTargetDescription || null,
        builderResumeJson: Array.isArray(builderResumeJson) ? JSON.stringify(builderResumeJson) : builderResumeJson || null
      },
      update: {
        sellerType: sellerType !== undefined ? sellerType : undefined,
        companyName: companyName !== undefined ? companyName : undefined,
        nationalId: nationalId !== undefined ? nationalId : undefined,
        nationalIdVerified: nationalIdVerified !== undefined ? nationalIdVerified : undefined,
        deedVerified: deedVerified !== undefined ? deedVerified : undefined,
        propertyType: propertyType !== undefined ? propertyType : undefined,
        district: district !== undefined ? district : undefined,
        isBarterAccepted: isBarterAccepted !== undefined ? isBarterAccepted : undefined,
        barterTargetDescription: barterTargetDescription !== undefined ? barterTargetDescription : undefined,
        builderResumeJson: builderResumeJson !== undefined ? (Array.isArray(builderResumeJson) ? JSON.stringify(builderResumeJson) : builderResumeJson) : undefined
      }
    });

    return NextResponse.json({
      success: true,
      message: "مشخصات مالک و سازنده با موفقیت ذخیره شد.",
      sellerProfile: updated
    });
  } catch (error: any) {
    console.error("PUT /api/profile/seller error:", error);
    return NextResponse.json({ error: "خطا در به‌روزرسانی اطلاعات مالک" }, { status: 500 });
  }
}
