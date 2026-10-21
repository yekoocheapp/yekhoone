import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "لطفاً ابتدا وارد حساب کاربری خود شوید." }, { status: 401 });
    }

    let agency = await prisma.agency.findFirst({
      where: {
        OR: [
          { users: { some: { id: user.id } } },
          { managerName: { contains: user.lastName || user.fullName } }
        ]
      },
      include: {
        agents: {
          include: {
            user: {
              select: {
                fullName: true,
                contact: true,
                phone: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!agency) {
      agency = await prisma.agency.create({
        data: {
          name: "دپارتمان املاک سرمایه‌گذاری سعادت‌آباد",
          managerName: user.fullName || "دکتر حیدری",
          supervisorName: "مهندس فرهمند (مدیر ارشد قراردادها)",
          licenseNumber: "۸۴۹۲۰۱",
          phone: "۰۲۱۲۲۱۱۴۴۰۰",
          officePhone: "۰۲۱۲۲۱۱۴۴۰۱",
          address: "تهران، سعادت‌آباد، میدان کاج، خیابان سرو غربی، پلاک ۲۴، ساختمان دپارتمان مرکزی",
          description: "دپارتمان تخصصی معاملات مسکن، فایلینگ انحصاری، تهاتر دارایی و مشارکت در ساخت منطقه ۲ و ۱ تهران با نظارت کامل حقوقی و اتاق‌های قرارداد VIP.",
          city: "تهران",
          districtsCovered: JSON.stringify(["سعادت‌آباد", "شهرک غرب", "پونک", "نیاوران", "فرمانیه"]),
          isVerified: true
        },
        include: {
          agents: {
            include: {
              user: true
            }
          }
        }
      });
    }

    // Connect user to agency if not connected
    await prisma.user.update({
      where: { id: user.id },
      data: { agencyId: agency.id }
    });

    // Master Properties of this Agency
    const agencyProperties = await prisma.property.findMany({
      where: {
        OR: [
          { agencyId: agency.id },
          { agencyName: { contains: agency.name } },
          { agencyPhone: agency.phone }
        ]
      },
      include: {
        barterTerms: true,
        partnershipTerms: true
      },
      take: 30
    });

    // Sample agent roster if database has few
    const agentsList = agency.agents && agency.agents.length > 0 ? agency.agents.map(a => ({
      id: a.id,
      name: a.user.fullName,
      phone: a.user.contact,
      role: a.dealTypesSpecialty ? "کارشناس ارشد معاملات" : "مشاور املاک",
      specialtyDistrict: a.specialtyDistrict || "سعادت‌آباد",
      rating: a.rating,
      dealsCount: a.dealsCount || 12,
      activeListingsCount: 8
    })) : [
      {
        id: "ag-1",
        name: "مهندس آرش فرهمند",
        phone: "۰۹۱۲۱۱۱۴۴۰۰",
        role: "سرپرست رنج مشارکت و تهاتر",
        specialtyDistrict: "سعادت‌آباد و شهرک غرب",
        rating: 4.9,
        dealsCount: 42,
        activeListingsCount: 14
      },
      {
        id: "ag-2",
        name: "پرویز احمدی",
        phone: "۰۹۱۲۲۲۲۳۳۴۴",
        role: "مشاور ارشد رنج فروش مسکونی",
        specialtyDistrict: "سعادت‌آباد، علامه و سرو",
        rating: 4.8,
        dealsCount: 26,
        activeListingsCount: 9
      },
      {
        id: "ag-3",
        name: "سارا کیانی",
        phone: "۰۹۱۲۵۵۵۶۶۷۷",
        role: "کارشناس رهن و اجاره آپارتمان",
        specialtyDistrict: "شهرک غرب و پونک",
        rating: 5.0,
        dealsCount: 31,
        activeListingsCount: 11
      }
    ];

    // Agency Neshasst Sessions
    const neshasstSessions = await prisma.neshasstSession.findMany({
      where: {
        OR: [
          { hostAgencyName: { contains: agency.name } },
          { hostAgentName: { contains: agency.supervisorName || "" } }
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
        contact: user.contact,
        role: user.role
      },
      agency,
      agentsList,
      agencyProperties,
      neshasstSessions
    });
  } catch (error: any) {
    console.error("GET /api/profile/agency error:", error);
    return NextResponse.json({ error: "خطا در بارگذاری اطلاعات دپارتمان املاک" }, { status: 500 });
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
      name,
      licenseNumber,
      managerName,
      supervisorName,
      phone,
      officePhone,
      address,
      description,
      districtsCovered
    } = body;

    // Find agency
    let agency = await prisma.agency.findFirst({
      where: {
        OR: [
          { users: { some: { id: user.id } } },
          { managerName: { contains: user.lastName || user.fullName } }
        ]
      }
    });

    if (!agency) {
      agency = await prisma.agency.create({
        data: {
          name: name || "دپارتمان املاک سرمایه‌گذاری سعادت‌آباد",
          managerName: managerName || user.fullName,
          phone: phone || user.contact
        }
      });
    }

    const updated = await prisma.agency.update({
      where: { id: agency.id },
      data: {
        name: name !== undefined ? name : undefined,
        licenseNumber: licenseNumber !== undefined ? licenseNumber : undefined,
        managerName: managerName !== undefined ? managerName : undefined,
        supervisorName: supervisorName !== undefined ? supervisorName : undefined,
        phone: phone !== undefined ? phone : undefined,
        officePhone: officePhone !== undefined ? officePhone : undefined,
        address: address !== undefined ? address : undefined,
        description: description !== undefined ? description : undefined,
        districtsCovered: districtsCovered !== undefined ? (Array.isArray(districtsCovered) ? JSON.stringify(districtsCovered) : districtsCovered) : undefined
      }
    });

    return NextResponse.json({
      success: true,
      message: "مشخصات حقوقی و اداری دپارتمان با موفقیت به‌روزرسانی شد.",
      agency: updated
    });
  } catch (error: any) {
    console.error("PUT /api/profile/agency error:", error);
    return NextResponse.json({ error: "خطا در به‌روزرسانی اطلاعات دپارتمان" }, { status: 500 });
  }
}
