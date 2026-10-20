import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { initialProperties } from "../src/data/properties";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting YeKhoone database seeding...");

  // 1. Clear existing data
  await prisma.favorite.deleteMany();
  await prisma.barterTerms.deleteMany();
  await prisma.partnershipTerms.deleteMany();
  await prisma.neshasstSession.deleteMany();
  await prisma.property.deleteMany();
  await prisma.buyerProfile.deleteMany();
  await prisma.sellerProfile.deleteMany();
  await prisma.agentProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.agency.deleteMany();

  // 2. Create Default Agencies
  const agencySaadatAbad = await prisma.agency.create({
    data: {
      id: "agency-saadat-abad",
      name: "دپارتمان املاک سرمایه‌گذاری سعادت‌آباد",
      managerName: "مهندس فرهمند",
      supervisorName: "حاج آقا رضایی",
      licenseNumber: "TR-884920",
      phone: "02122114400",
      officePhone: "02122114401",
      address: "سعادت‌آباد، میدان کاج، مجتمع تجاری سرو، طبقه ۴",
      isVerified: true
    }
  });

  const agencyNiavaran = await prisma.agency.create({
    data: {
      id: "agency-niavaran",
      name: "دفتر مهندسی و املاک لوکس نیاوران",
      managerName: "دکتر حسینی",
      supervisorName: "مهندس شریفی",
      licenseNumber: "TR-991203",
      phone: "02122805500",
      address: "نیاوران، خیابان باهنر، پلاک ۱۴۲",
      isVerified: true
    }
  });

  // 3. Create Sample Admin & Agent Users
  const passwordHash = await bcrypt.hash("123456", 10);

  const agentUser = await prisma.user.create({
    data: {
      firstName: "مهندس",
      lastName: "فرهمند",
      fullName: "مهندس فرهمند",
      contact: "09121114400",
      phone: "09121114400",
      passwordHash,
      role: "agent",
      isVerified: true,
      agencyId: agencySaadatAbad.id,
      agentProfile: {
        create: {
          licenseCode: "AG-4400",
          agencyName: agencySaadatAbad.name,
          agencyId: agencySaadatAbad.id,
          specialtyDistrict: "سعادت‌آباد و شهرک غرب",
          rating: 4.9,
          dealsCount: 74
        }
      }
    }
  });

  const buyerUser = await prisma.user.create({
    data: {
      firstName: "امید",
      lastName: "سروری",
      fullName: "امید سروری",
      contact: "09129990011",
      phone: "09129990011",
      passwordHash,
      role: "buyer",
      isVerified: true,
      buyerProfile: {
        create: {
          demandType: "buy",
          budgetLabel: "تا ۲۰ میلیارد تومان",
          desiredDistricts: JSON.stringify(["سعادت‌آباد", "شهرک غرب", "پونک"])
        }
      }
    }
  });

  // 4. Seed Properties
  for (const p of initialProperties) {
    const createdProp = await prisma.property.create({
      data: {
        id: p.id,
        title: p.title,
        slug: p.slug,
        district: p.district,
        address: p.address,
        type: p.type,
        propertyType: p.propertyType,
        meters: p.meters,
        bedrooms: p.bedrooms,
        floor: p.floor,
        totalFloors: p.totalFloors,
        unitsPerFloor: p.unitsPerFloor,
        age: p.age,
        orientation: p.orientation,
        hasParking: p.hasParking,
        hasElevator: p.hasElevator,
        hasStorage: p.hasStorage,
        hasBalcony: p.hasBalcony,
        coolingSystem: p.coolingSystem,
        heatingSystem: p.heatingSystem,
        flooring: p.flooring,
        deedStatus: p.deedStatus,
        deposit: p.deposit ? p.deposit.toString() : "0",
        rent: p.rent ? p.rent.toString() : "0",
        totalPrice: p.totalPrice ? p.totalPrice.toString() : "0",
        pricePerMeter: p.pricePerMeter ? p.pricePerMeter.toString() : "0",
        hasVirtualTour: p.hasVirtualTour || false,
        virtualTourData: p.virtualTour ? JSON.stringify(p.virtualTour) : null,
        videoTourUrl: p.videoUrl || null,
        isBarter: p.isBarter || false,
        isPartnership: p.isPartnership || false,
        frontageMeters: p.frontageMeters || null,
        streetWidth: p.streetWidth || null,
        densityPermit: p.densityPermit || null,
        agencyName: p.agencyName || agencySaadatAbad.name,
        agencyPhone: p.agencyPhone || agencySaadatAbad.phone,
        agencyId: agencySaadatAbad.id,
        agentName: p.agentName || agentUser.fullName,
        agentPhone: p.agentPhone || agentUser.contact,
        agentRole: p.agentRole || "مشاور رسمی",
        agentRating: p.agentRating || 4.9,
        agentDealsCount: p.agentDealsCount || 50,
        isVerified: p.isVerified,
        images: JSON.stringify(p.images),
        tags: JSON.stringify(p.tags),
        description: p.description,
        lat: p.coordinates.lat,
        lng: p.coordinates.lng,
        lastAlgorithmicBump: p.lastAlgorithmicBump || "۳۰ دقیقه پیش",
        nextAlgorithmicBump: p.nextAlgorithmicBump || "۳ ساعت دیگر",
        bumpIntervalHours: p.bumpIntervalHours || 6,
        userId: agentUser.id
      }
    });

    // Seed Barter terms if present
    if (p.isBarter && p.barterTerms) {
      await prisma.barterTerms.create({
        data: {
          propertyId: createdProp.id,
          targetAsset: p.barterTerms.targetAsset,
          targetAssetLabel: p.barterTerms.targetAssetLabel,
          cashDeltaTomans: p.barterTerms.cashDeltaTomans ? p.barterTerms.cashDeltaTomans.toString() : null,
          isDirectSwap: p.barterTerms.isDirectSwap || false,
          notes: p.barterTerms.notes || null
        }
      });
    }

    // Seed Partnership terms if present
    if (p.isPartnership && p.partnershipTerms) {
      await prisma.partnershipTerms.create({
        data: {
          propertyId: createdProp.id,
          ownerSharePercent: p.partnershipTerms.ownerSharePercent,
          builderSharePercent: p.partnershipTerms.builderSharePercent,
          belaAvazTomans: p.partnershipTerms.belaAvazTomans ? p.partnershipTerms.belaAvazTomans.toString() : null,
          projectDurationMonths: p.partnershipTerms.projectDurationMonths || 24,
          permitStatus: p.partnershipTerms.permitStatus || null,
          builderReputationNotes: p.partnershipTerms.builderReputationNotes || null
        }
      });
    }
  }

  // 5. Seed a Sample Neshasst Session
  await prisma.neshasstSession.create({
    data: {
      id: "neshasst-live-01",
      propertyId: 12,
      title: "نشست آنلاین بررسی قرارداد مشارکت در ساخت ملک ۶۰۰ متری سعادت‌آباد",
      propertyAddress: "سعادت‌آباد، خیابان صرافهای شمالی، کوچه نوزدهم",
      status: "scheduled",
      scheduledDate: "۱۴۰۵/۰۲/۰۲",
      scheduledTime: "۱۷:۳۰",
      hostAgentName: "مهندس فرهمند",
      hostAgencyName: agencySaadatAbad.name,
      buyerName: "مهندس آریا (سازنده برند منطقه ۲)",
      buyerPhone: "۰۹۱۲۳۴۵۶۷۸۹",
      sellerName: "حاج آقا نادری (نماینده مالکین تجمیعی)",
      sellerPhone: "۰۹۱۲۸۸۸۹۹۰۰",
      contractDraft: "پیش‌نویس قرارداد مشارکت ۶۰ به ۴۰ با شرط بلاعوض ۱۵ میلیارد تومان و تحویل ۲۴ ماهه."
    }
  });

  console.log("✅ Database seeded successfully with 12 properties, agencies, users, and partnership data!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
