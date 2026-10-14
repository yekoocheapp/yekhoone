import { initialProperties, Property } from "./properties";

export type UnitStatus = "rent" | "sale" | "occupied" | "unlisted";

export interface BuildingUnit {
  id: string;
  unitNumber: string; // e.g. "واحد ۵ - شرقی"
  floor: number;
  meters: number;
  bedrooms: number;
  status: UnitStatus;
  propertyId?: number; // Links to initialProperties if listed in YeKhoone
  deposit?: number;    // Tomans
  rent?: number;       // Tomans
  totalPrice?: number; // Tomans
  hasVirtualTour?: boolean;
  notes?: string;
}

export interface BuildingFloor {
  floorNumber: number;
  floorLabel: string; // e.g. "طبقه پنجم (پنت‌هاوس)"
  units: BuildingUnit[];
}

export interface TehranBuilding {
  id: string;
  name: string;
  district: string;
  street: string;
  plaque: string;
  fullAddress: string;
  totalFloors: number;
  unitsCount: number;
  age: number; // Building age
  architecturalStyle: "modern-glass" | "classic-travertine" | "luxury-terrace" | "minimalist-brick" | "highrise-tower";
  amenities: {
    hasElevator: boolean;
    hasParking: boolean;
    hasStorage: boolean;
    hasLobby: boolean;
    hasLobbyMan: boolean;
    hasRoofGarden: boolean;
    hasPool: boolean;
    hasGym: boolean;
  };
  // Geospatial & 3D world positioning
  coordinates: {
    lat: number;
    lng: number;
  };
  worldPosition: {
    x: number; // 3D X coordinate
    z: number; // 3D Z coordinate
  };
  dimensions: {
    width: number;
    depth: number;
    height: number;
  };
  colorTheme?: {
    facadeColor: string;
    windowColor: string;
    roofColor: string;
    accentColor: string;
  };
  floors: BuildingFloor[];
}

export interface DistrictShortcut {
  id: string;
  name: string;
  nameEn: string;
  centerCoordinates: { lat: number; lng: number };
  worldCenter: { x: number; z: number };
  cameraTarget: { x: number; y: number; z: number };
  cameraPosition: { x: number; y: number; z: number };
  activeListingsCount: number;
  description: string;
}

export const TEHRAN_DISTRICTS: DistrictShortcut[] = [
  {
    id: "saadat-abad",
    name: "سعادت‌آباد",
    nameEn: "Sa'adat Abad",
    centerCoordinates: { lat: 35.7876, lng: 51.3734 },
    worldCenter: { x: -60, z: -80 },
    cameraTarget: { x: -60, y: 15, z: -80 },
    cameraPosition: { x: -30, y: 70, z: -20 },
    activeListingsCount: 84,
    description: "بلوار علامه، میدان کاج، خیابان‌های دنج مروارید و سرو غربی"
  },
  {
    id: "shahrak-gharb",
    name: "شهرک غرب",
    nameEn: "Shahrak-e Gharb",
    centerCoordinates: { lat: 35.7592, lng: 51.3654 },
    worldCenter: { x: -70, z: 40 },
    cameraTarget: { x: -70, y: 15, z: 40 },
    cameraPosition: { x: -40, y: 80, z: 110 },
    activeListingsCount: 62,
    description: "بلوار ایران‌زمین، خیابان مهستان، گلستان و فازهای ویلایی دیپلمات‌نشین"
  },
  {
    id: "niavaran",
    name: "نیاوران و شمیرانات",
    nameEn: "Niavaran",
    centerCoordinates: { lat: 35.8198, lng: 51.4682 },
    worldCenter: { x: 70, z: -160 },
    cameraTarget: { x: 70, y: 25, z: -160 },
    cameraPosition: { x: 100, y: 95, z: -100 },
    activeListingsCount: 47,
    description: "خیابان گل‌سنگ، بوکان، یاسر، عمار و برج‌باغ‌های مشرف به کوهستان"
  },
  {
    id: "marzdaran",
    name: "مرزداران",
    nameEn: "Marzdaran",
    centerCoordinates: { lat: 35.7381, lng: 51.3542 },
    worldCenter: { x: -40, z: 120 },
    cameraTarget: { x: -40, y: 15, z: 120 },
    cameraPosition: { x: -10, y: 75, z: 190 },
    activeListingsCount: 53,
    description: "بلوار اصلی مرزداران، ابراهیمی، بوستان، ناهید و دسترسی عالی به یادگار"
  },
  {
    id: "punak",
    name: "پونک و سردار جنگل",
    nameEn: "Punak",
    centerCoordinates: { lat: 35.7689, lng: 51.3321 },
    worldCenter: { x: -140, z: -20 },
    cameraTarget: { x: -140, y: 15, z: -20 },
    cameraPosition: { x: -110, y: 75, z: 50 },
    activeListingsCount: 71,
    description: "سردار جنگل شمالی، خیابان شقایق، مخبری و میرزابابایی"
  },
  {
    id: "sadeghiyeh",
    name: "صادقیه و ستارخان",
    nameEn: "Sadeghiyeh",
    centerCoordinates: { lat: 35.7205, lng: 51.3392 },
    worldCenter: { x: -80, z: 190 },
    cameraTarget: { x: -80, y: 15, z: 190 },
    cameraPosition: { x: -50, y: 70, z: 255 },
    activeListingsCount: 92,
    description: "فلکه اول صادقیه، خیابان سازمان آب، گلناز و دسترسی سریع به مترو"
  }
];

export const TEHRAN_BUILDINGS: TehranBuilding[] = [
  // 1. Allameh Shomali, Sa'adat Abad (Matches Property #1)
  {
    id: "bldg-saadat-allameh-24",
    name: "ساختمان مسکونی بهار ۲۴",
    district: "سعادت‌آباد",
    street: "خیابان علامه شمالی، کوچه هجدهم شرقی",
    plaque: "پلاک ۲۴",
    fullAddress: "سعادت‌آباد، خیابان علامه شمالی، کوچه هجدهم شرقی، پلاک ۲۴",
    totalFloors: 5,
    unitsCount: 10,
    age: 2,
    architecturalStyle: "modern-glass",
    amenities: {
      hasElevator: true,
      hasParking: true,
      hasStorage: true,
      hasLobby: true,
      hasLobbyMan: true,
      hasRoofGarden: true,
      hasPool: false,
      hasGym: false
    },
    coordinates: { lat: 35.7876, lng: 51.3734 },
    worldPosition: { x: -60, z: -80 },
    dimensions: { width: 18, depth: 22, height: 26 },
    colorTheme: {
      facadeColor: "#e2e8f0",
      windowColor: "#0284c7",
      roofColor: "#334155",
      accentColor: "#f59e0b"
    },
    floors: [
      {
        floorNumber: 5,
        floorLabel: "طبقه ۵ (پنت‌هاوس)",
        units: [
          {
            id: "u-5-1",
            unitNumber: "واحد ۹ - شمالی",
            floor: 5,
            meters: 130,
            bedrooms: 3,
            status: "occupied",
            notes: "سکونت شخصی مالک اصلی ساختمان"
          },
          {
            id: "u-5-2",
            unitNumber: "واحد ۱۰ - جنوبی با روف‌گاردن",
            floor: 5,
            meters: 140,
            bedrooms: 3,
            status: "unlisted",
            notes: "ثبت‌نشده در سامانه"
          }
        ]
      },
      {
        floorNumber: 4,
        floorLabel: "طبقه ۴",
        units: [
          {
            id: "u-4-1",
            unitNumber: "واحد ۷ - شمالی",
            floor: 4,
            meters: 120,
            bedrooms: 2,
            status: "occupied",
            notes: "سکونت خانوادگی"
          },
          {
            id: "u-4-2",
            unitNumber: "واحد ۸ - جنوبی",
            floor: 4,
            meters: 120,
            bedrooms: 2,
            status: "unlisted"
          }
        ]
      },
      {
        floorNumber: 3,
        floorLabel: "طبقه ۳ (آگهی فعال رهن و اجاره)",
        units: [
          {
            id: "u-3-1",
            unitNumber: "واحد ۵ - آفتاب‌گیر جنوبی",
            floor: 3,
            meters: 120,
            bedrooms: 2,
            status: "rent",
            propertyId: 1, // Directly linked to property 1!
            deposit: 600000000,
            rent: 32000000,
            hasVirtualTour: true,
            notes: "واحد آماده تحویل با تور مجازی ۳۶۰ درجه و ویدیو واک‌ترو اختصاصی"
          },
          {
            id: "u-3-2",
            unitNumber: "واحد ۶ - شمالی",
            floor: 3,
            meters: 120,
            bedrooms: 2,
            status: "occupied"
          }
        ]
      },
      {
        floorNumber: 2,
        floorLabel: "طبقه ۲",
        units: [
          {
            id: "u-2-1",
            unitNumber: "واحد ۳ - شمالی",
            floor: 2,
            meters: 120,
            bedrooms: 2,
            status: "occupied"
          },
          {
            id: "u-2-2",
            unitNumber: "واحد ۴ - جنوبی",
            floor: 2,
            meters: 120,
            bedrooms: 2,
            status: "unlisted"
          }
        ]
      },
      {
        floorNumber: 1,
        floorLabel: "طبقه ۱",
        units: [
          {
            id: "u-1-1",
            unitNumber: "واحد ۱ - شمالی با حیاط خلوت",
            floor: 1,
            meters: 115,
            bedrooms: 2,
            status: "occupied"
          },
          {
            id: "u-1-2",
            unitNumber: "واحد ۲ - جنوبی",
            floor: 1,
            meters: 115,
            bedrooms: 2,
            status: "unlisted"
          }
        ]
      }
    ]
  },

  // 2. Iran Zamin / Mehestan, Shahrak-e Gharb (Matches Property #2)
  {
    id: "bldg-shahrak-mehestan-10",
    name: "برج باغ دیپلمات مهستان",
    district: "شهرک غرب",
    street: "بلوار ایران‌زمین، خیابان مهستان، کوچه گلستان",
    plaque: "پلاک ۱۰",
    fullAddress: "شهرک غرب، بلوار ایران‌زمین، خیابان مهستان، کوچه گلستان، پلاک ۱۰",
    totalFloors: 6,
    unitsCount: 6,
    age: 4,
    architecturalStyle: "luxury-terrace",
    amenities: {
      hasElevator: true,
      hasParking: true,
      hasStorage: true,
      hasLobby: true,
      hasLobbyMan: true,
      hasRoofGarden: true,
      hasPool: true,
      hasGym: true
    },
    coordinates: { lat: 35.7592, lng: 51.3654 },
    worldPosition: { x: -70, z: 40 },
    dimensions: { width: 22, depth: 24, height: 32 },
    colorTheme: {
      facadeColor: "#f1f5f9",
      windowColor: "#38bdf8",
      roofColor: "#1e293b",
      accentColor: "#10b981"
    },
    floors: [
      {
        floorNumber: 6,
        floorLabel: "طبقه ۶ (پنت‌هاوس دوبلکس)",
        units: [
          {
            id: "u-sh-6-1",
            unitNumber: "پنت‌هاوس رویال با استخر روباز",
            floor: 6,
            meters: 220,
            bedrooms: 4,
            status: "occupied",
            notes: "سکونت شخصی سازنده"
          }
        ]
      },
      {
        floorNumber: 5,
        floorLabel: "طبقه ۵ (آگهی فعال رهن و اجاره تک‌واحدی)",
        units: [
          {
            id: "u-sh-5-1",
            unitNumber: "واحد ۵ - تک‌واحدی با تراس ۱۵ متری",
            floor: 5,
            meters: 145,
            bedrooms: 3,
            status: "rent",
            propertyId: 2, // Matches Property 2!
            deposit: 1200000000,
            rent: 45000000,
            hasVirtualTour: true,
            notes: "واحد دیپلمات‌نشین فول مشاعات استخر سونا جکوزی و تراس رو به فضای سبز"
          }
        ]
      },
      {
        floorNumber: 4,
        floorLabel: "طبقه ۴ (تک‌واحدی)",
        units: [
          {
            id: "u-sh-4-1",
            unitNumber: "واحد ۴ - تک‌واحدی",
            floor: 4,
            meters: 145,
            bedrooms: 3,
            status: "occupied"
          }
        ]
      },
      {
        floorNumber: 3,
        floorLabel: "طبقه ۳ (تک‌واحدی)",
        units: [
          {
            id: "u-sh-3-1",
            unitNumber: "واحد ۳ - تک‌واحدی",
            floor: 3,
            meters: 145,
            bedrooms: 3,
            status: "occupied"
          }
        ]
      },
      {
        floorNumber: 2,
        floorLabel: "طبقه ۲ (تک‌واحدی)",
        units: [
          {
            id: "u-sh-2-1",
            unitNumber: "واحد ۲ - تک‌واحدی",
            floor: 2,
            meters: 145,
            bedrooms: 3,
            status: "unlisted"
          }
        ]
      },
      {
        floorNumber: 1,
        floorLabel: "طبقه ۱ (تک‌واحدی)",
        units: [
          {
            id: "u-sh-1-1",
            unitNumber: "واحد ۱ - تک‌واحدی با پاسیو اختصاصی",
            floor: 1,
            meters: 140,
            bedrooms: 3,
            status: "occupied"
          }
        ]
      }
    ]
  },

  // 3. Niavaran, Gol-Sang (Matches Property #5 - Luxury Sale)
  {
    id: "bldg-niavaran-golsang-yas",
    name: "عمارت رویال یاس نیاوران",
    district: "نیاوران",
    street: "خیابان گل‌سنگ، بن‌بست مینا",
    plaque: "پلاک ۱۸",
    fullAddress: "نیاوران، خیابان گل‌سنگ، بن‌بست مینا، عمارت یاس، پلاک ۱۸",
    totalFloors: 8,
    unitsCount: 16,
    age: 0,
    architecturalStyle: "classic-travertine",
    amenities: {
      hasElevator: true,
      hasParking: true,
      hasStorage: true,
      hasLobby: true,
      hasLobbyMan: true,
      hasRoofGarden: true,
      hasPool: true,
      hasGym: true
    },
    coordinates: { lat: 35.8198, lng: 51.4682 },
    worldPosition: { x: 70, z: -160 },
    dimensions: { width: 25, depth: 26, height: 44 },
    colorTheme: {
      facadeColor: "#fef3c7",
      windowColor: "#60a5fa",
      roofColor: "#0f172a",
      accentColor: "#fbbf24"
    },
    floors: [
      {
        floorNumber: 8,
        floorLabel: "طبقه ۸ (پنت‌هاوس تریپلکس)",
        units: [
          {
            id: "u-niav-8-1",
            unitNumber: "پنت‌هاوس تریپلکس ۳۰۰ متری",
            floor: 8,
            meters: 300,
            bedrooms: 4,
            status: "unlisted"
          }
        ]
      },
      {
        floorNumber: 7,
        floorLabel: "طبقه ۷",
        units: [
          {
            id: "u-niav-7-1",
            unitNumber: "واحد ۱۳ - شرقی",
            floor: 7,
            meters: 180,
            bedrooms: 3,
            status: "occupied"
          },
          {
            id: "u-niav-7-2",
            unitNumber: "واحد ۱۴ - غربی",
            floor: 7,
            meters: 180,
            bedrooms: 3,
            status: "occupied"
          }
        ]
      },
      {
        floorNumber: 6,
        floorLabel: "طبقه ۶ (آگهی فعال خرید و فروش ۴۸ میلیاردی)",
        units: [
          {
            id: "u-niav-6-1",
            unitNumber: "واحد ۱۱ - غربی رو به کوهستان",
            floor: 6,
            meters: 180,
            bedrooms: 3,
            status: "sale",
            propertyId: 5, // Matches Property 5!
            totalPrice: 48000000000,
            hasVirtualTour: false,
            notes: "سازه مارک‌دار نیاوران، ۲ پارکینگ سندی باکس، سینما و استخر اختصاصی"
          },
          {
            id: "u-niav-6-2",
            unitNumber: "واحد ۱۲ - شرقی",
            floor: 6,
            meters: 180,
            bedrooms: 3,
            status: "occupied"
          }
        ]
      },
      {
        floorNumber: 5,
        floorLabel: "طبقه ۵",
        units: [
          {
            id: "u-niav-5-1",
            unitNumber: "واحد ۹ - شرقی",
            floor: 5,
            meters: 180,
            bedrooms: 3,
            status: "unlisted"
          },
          {
            id: "u-niav-5-2",
            unitNumber: "واحد ۱۰ - غربی",
            floor: 5,
            meters: 180,
            bedrooms: 3,
            status: "occupied"
          }
        ]
      },
      {
        floorNumber: 4,
        floorLabel: "طبقه ۴",
        units: [
          {
            id: "u-niav-4-1",
            unitNumber: "واحد ۷ - شرقی",
            floor: 4,
            meters: 180,
            bedrooms: 3,
            status: "occupied"
          },
          {
            id: "u-niav-4-2",
            unitNumber: "واحد ۸ - غربی",
            floor: 4,
            meters: 180,
            bedrooms: 3,
            status: "occupied"
          }
        ]
      },
      {
        floorNumber: 3,
        floorLabel: "طبقه ۳",
        units: [
          {
            id: "u-niav-3-1",
            unitNumber: "واحد ۵ - شرقی",
            floor: 3,
            meters: 180,
            bedrooms: 3,
            status: "unlisted"
          },
          {
            id: "u-niav-3-2",
            unitNumber: "واحد ۶ - غربی",
            floor: 3,
            meters: 180,
            bedrooms: 3,
            status: "occupied"
          }
        ]
      },
      {
        floorNumber: 2,
        floorLabel: "طبقه ۲",
        units: [
          {
            id: "u-niav-2-1",
            unitNumber: "واحد ۳ - شرقی",
            floor: 2,
            meters: 175,
            bedrooms: 3,
            status: "occupied"
          },
          {
            id: "u-niav-2-2",
            unitNumber: "واحد ۴ - غربی",
            floor: 2,
            meters: 175,
            bedrooms: 3,
            status: "occupied"
          }
        ]
      },
      {
        floorNumber: 1,
        floorLabel: "طبقه ۱",
        units: [
          {
            id: "u-niav-1-1",
            unitNumber: "واحد ۱ - شرقی",
            floor: 1,
            meters: 170,
            bedrooms: 3,
            status: "occupied"
          },
          {
            id: "u-niav-1-2",
            unitNumber: "واحد ۲ - غربی",
            floor: 1,
            meters: 170,
            bedrooms: 3,
            status: "unlisted"
          }
        ]
      }
    ]
  },

  // 4. Marzdaran, Ebrahimi (Matches Property #4)
  {
    id: "bldg-marzdaran-ebrahimi-8",
    name: "ساختمان بوستان مرزداران",
    district: "مرزداران",
    street: "خیابان شهید ابراهیمی، کوچه بوستان دوم",
    plaque: "پلاک ۸",
    fullAddress: "مرزداران، خیابان شهید ابراهیمی، کوچه بوستان دوم، پلاک ۸",
    totalFloors: 5,
    unitsCount: 10,
    age: 1,
    architecturalStyle: "minimalist-brick",
    amenities: {
      hasElevator: true,
      hasParking: true,
      hasStorage: true,
      hasLobby: true,
      hasLobbyMan: false,
      hasRoofGarden: false,
      hasPool: false,
      hasGym: false
    },
    coordinates: { lat: 35.7381, lng: 51.3542 },
    worldPosition: { x: -40, z: 120 },
    dimensions: { width: 16, depth: 20, height: 25 },
    colorTheme: {
      facadeColor: "#e2e8f0",
      windowColor: "#38bdf8",
      roofColor: "#334155",
      accentColor: "#3b82f6"
    },
    floors: [
      {
        floorNumber: 5,
        floorLabel: "طبقه ۵",
        units: [
          {
            id: "u-marz-5-1",
            unitNumber: "واحد ۹ - شمالی",
            floor: 5,
            meters: 95,
            bedrooms: 2,
            status: "occupied"
          },
          {
            id: "u-marz-5-2",
            unitNumber: "واحد ۱۰ - جنوبی",
            floor: 5,
            meters: 95,
            bedrooms: 2,
            status: "occupied"
          }
        ]
      },
      {
        floorNumber: 4,
        floorLabel: "طبقه ۴ (آگهی فعال رهن و اجاره)",
        units: [
          {
            id: "u-marz-4-1",
            unitNumber: "واحد ۷ - آفتاب‌گیر جنوبی",
            floor: 4,
            meters: 95,
            bedrooms: 2,
            status: "rent",
            propertyId: 4, // Matches Property 4!
            deposit: 400000000,
            rent: 22000000,
            hasVirtualTour: false,
            notes: "واحد نوساز بسیار شیک با پارکینگ سندی و داکت اسپلیت"
          },
          {
            id: "u-marz-4-2",
            unitNumber: "واحد ۸ - شمالی",
            floor: 4,
            meters: 95,
            bedrooms: 2,
            status: "unlisted"
          }
        ]
      },
      {
        floorNumber: 3,
        floorLabel: "طبقه ۳",
        units: [
          {
            id: "u-marz-3-1",
            unitNumber: "واحد ۵",
            floor: 3,
            meters: 95,
            bedrooms: 2,
            status: "occupied"
          },
          {
            id: "u-marz-3-2",
            unitNumber: "واحد ۶",
            floor: 3,
            meters: 95,
            bedrooms: 2,
            status: "occupied"
          }
        ]
      },
      {
        floorNumber: 2,
        floorLabel: "طبقه ۲",
        units: [
          {
            id: "u-marz-2-1",
            unitNumber: "واحد ۳",
            floor: 2,
            meters: 95,
            bedrooms: 2,
            status: "unlisted"
          },
          {
            id: "u-marz-2-2",
            unitNumber: "واحد ۴",
            floor: 2,
            meters: 95,
            bedrooms: 2,
            status: "occupied"
          }
        ]
      },
      {
        floorNumber: 1,
        floorLabel: "طبقه ۱",
        units: [
          {
            id: "u-marz-1-1",
            unitNumber: "واحد ۱",
            floor: 1,
            meters: 90,
            bedrooms: 2,
            status: "occupied"
          },
          {
            id: "u-marz-1-2",
            unitNumber: "واحد ۲",
            floor: 1,
            meters: 90,
            bedrooms: 2,
            status: "occupied"
          }
        ]
      }
    ]
  },

  // 5. Punak, Sardar Jangal (Matches Property #3)
  {
    id: "bldg-punak-sardar-12",
    name: "ساختمان مسکونی شقایق پونک",
    district: "پونک",
    street: "بلوار سردار جنگل شمالی، خیابان شقایق",
    plaque: "پلاک ۱۲",
    fullAddress: "پونک، بلوار سردار جنگل شمالی، خیابان شقایق، پلاک ۱۲",
    totalFloors: 5,
    unitsCount: 15,
    age: 5,
    architecturalStyle: "modern-glass",
    amenities: {
      hasElevator: true,
      hasParking: true,
      hasStorage: true,
      hasLobby: false,
      hasLobbyMan: false,
      hasRoofGarden: false,
      hasPool: false,
      hasGym: false
    },
    coordinates: { lat: 35.7689, lng: 51.3321 },
    worldPosition: { x: -140, z: -20 },
    dimensions: { width: 20, depth: 22, height: 26 },
    colorTheme: {
      facadeColor: "#cbd5e1",
      windowColor: "#38bdf8",
      roofColor: "#1e293b",
      accentColor: "#059669"
    },
    floors: [
      {
        floorNumber: 5,
        floorLabel: "طبقه ۵",
        units: [
          { id: "u-pn-5-1", unitNumber: "واحد ۱۳", floor: 5, meters: 85, bedrooms: 2, status: "occupied" },
          { id: "u-pn-5-2", unitNumber: "واحد ۱۴", floor: 5, meters: 85, bedrooms: 2, status: "occupied" },
          { id: "u-pn-5-3", unitNumber: "واحد ۱۵", floor: 5, meters: 85, bedrooms: 2, status: "unlisted" }
        ]
      },
      {
        floorNumber: 4,
        floorLabel: "طبقه ۴",
        units: [
          { id: "u-pn-4-1", unitNumber: "واحد ۱۰", floor: 4, meters: 85, bedrooms: 2, status: "occupied" },
          { id: "u-pn-4-2", unitNumber: "واحد ۱۱", floor: 4, meters: 85, bedrooms: 2, status: "occupied" },
          { id: "u-pn-4-3", unitNumber: "واحد ۱۲", floor: 4, meters: 85, bedrooms: 2, status: "occupied" }
        ]
      },
      {
        floorNumber: 3,
        floorLabel: "طبقه ۳",
        units: [
          { id: "u-pn-3-1", unitNumber: "واحد ۷", floor: 3, meters: 85, bedrooms: 2, status: "occupied" },
          { id: "u-pn-3-2", unitNumber: "واحد ۸", floor: 3, meters: 85, bedrooms: 2, status: "unlisted" },
          { id: "u-pn-3-3", unitNumber: "واحد ۹", floor: 3, meters: 85, bedrooms: 2, status: "occupied" }
        ]
      },
      {
        floorNumber: 2,
        floorLabel: "طبقه ۲ (آگهی فعال رهن کامل)",
        units: [
          {
            id: "u-pn-2-1",
            unitNumber: "واحد ۴ - شمالی خوش‌نقشه",
            floor: 2,
            meters: 85,
            bedrooms: 2,
            status: "rent",
            propertyId: 3, // Matches Property 3!
            deposit: 850000000,
            rent: 0,
            hasVirtualTour: false,
            notes: "رهن کامل فوری، سالن مربع پرده‌خور، دسترسی آسان به ستاری و همت"
          },
          { id: "u-pn-2-2", unitNumber: "واحد ۵", floor: 2, meters: 85, bedrooms: 2, status: "occupied" },
          { id: "u-pn-2-3", unitNumber: "واحد ۶", floor: 2, meters: 85, bedrooms: 2, status: "occupied" }
        ]
      },
      {
        floorNumber: 1,
        floorLabel: "طبقه ۱",
        units: [
          { id: "u-pn-1-1", unitNumber: "واحد ۱", floor: 1, meters: 80, bedrooms: 2, status: "occupied" },
          { id: "u-pn-1-2", unitNumber: "واحد ۲", floor: 1, meters: 80, bedrooms: 2, status: "occupied" },
          { id: "u-pn-1-3", unitNumber: "واحد ۳", floor: 1, meters: 80, bedrooms: 2, status: "unlisted" }
        ]
      }
    ]
  },

  // 6. Sadeghiyeh, Sazman Ab (Matches Property #6)
  {
    id: "bldg-sadeghiyeh-sazman-14",
    name: "ساختمان مسکونی گلناز",
    district: "صادقیه",
    street: "فلکه اول، خیابان سازمان آب، کوچه گلناز",
    plaque: "پلاک ۱۴",
    fullAddress: "صادقیه، فلکه اول، خیابان سازمان آب، کوچه گلناز، پلاک ۱۴",
    totalFloors: 4,
    unitsCount: 8,
    age: 12,
    architecturalStyle: "classic-travertine",
    amenities: {
      hasElevator: false,
      hasParking: true,
      hasStorage: true,
      hasLobby: false,
      hasLobbyMan: false,
      hasRoofGarden: false,
      hasPool: false,
      hasGym: false
    },
    coordinates: { lat: 35.7205, lng: 51.3392 },
    worldPosition: { x: -80, z: 190 },
    dimensions: { width: 15, depth: 18, height: 18 },
    colorTheme: {
      facadeColor: "#e2e8f0",
      windowColor: "#38bdf8",
      roofColor: "#334155",
      accentColor: "#e11d48"
    },
    floors: [
      {
        floorNumber: 4,
        floorLabel: "طبقه ۴",
        units: [
          { id: "u-sad-4-1", unitNumber: "واحد ۷", floor: 4, meters: 70, bedrooms: 1, status: "occupied" },
          { id: "u-sad-4-2", unitNumber: "واحد ۸", floor: 4, meters: 70, bedrooms: 1, status: "unlisted" }
        ]
      },
      {
        floorNumber: 3,
        floorLabel: "طبقه ۳",
        units: [
          { id: "u-sad-3-1", unitNumber: "واحد ۵", floor: 3, meters: 70, bedrooms: 1, status: "occupied" },
          { id: "u-sad-3-2", unitNumber: "واحد ۶", floor: 3, meters: 70, bedrooms: 1, status: "occupied" }
        ]
      },
      {
        floorNumber: 2,
        floorLabel: "طبقه ۲",
        units: [
          { id: "u-sad-2-1", unitNumber: "واحد ۳", floor: 2, meters: 70, bedrooms: 1, status: "unlisted" },
          { id: "u-sad-2-2", unitNumber: "واحد ۴", floor: 2, meters: 70, bedrooms: 1, status: "occupied" }
        ]
      },
      {
        floorNumber: 1,
        floorLabel: "طبقه ۱ (آگهی فعال رهن و اجاره بازسازی کامل)",
        units: [
          {
            id: "u-sad-1-1",
            unitNumber: "واحد ۱ - بازسازی صفر تا صد",
            floor: 1,
            meters: 70,
            bedrooms: 1,
            status: "rent",
            propertyId: 6, // Matches Property 6!
            deposit: 250000000,
            rent: 16000000,
            hasVirtualTour: false,
            notes: "۲ دقیقه پیاده‌روی تا مترو طرشت و صادقیه، بازسازی مدرن نقلی"
          },
          { id: "u-sad-1-2", unitNumber: "واحد ۲", floor: 1, meters: 70, bedrooms: 1, status: "occupied" }
        ]
      }
    ]
  },

  // Neighboring Mapped Buildings (Surrounding Street Parcels for high-density 3D realism)
  {
    id: "bldg-saadat-allameh-22",
    name: "ساختمان آرین ۲۲",
    district: "سعادت‌آباد",
    street: "خیابان علامه شمالی، کوچه هجدهم شرقی",
    plaque: "پلاک ۲۲",
    fullAddress: "سعادت‌آباد، خیابان علامه شمالی، کوچه هجدهم شرقی، پلاک ۲۲",
    totalFloors: 5,
    unitsCount: 10,
    age: 4,
    architecturalStyle: "classic-travertine",
    amenities: {
      hasElevator: true,
      hasParking: true,
      hasStorage: true,
      hasLobby: false,
      hasLobbyMan: false,
      hasRoofGarden: false,
      hasPool: false,
      hasGym: false
    },
    coordinates: { lat: 35.7877, lng: 51.3736 },
    worldPosition: { x: -35, z: -80 },
    dimensions: { width: 16, depth: 20, height: 24 },
    colorTheme: {
      facadeColor: "#f8fafc",
      windowColor: "#38bdf8",
      roofColor: "#334155",
      accentColor: "#64748b"
    },
    floors: [
      {
        floorNumber: 5,
        floorLabel: "طبقه ۵",
        units: [
          { id: "u-ar-5-1", unitNumber: "واحد ۹", floor: 5, meters: 110, bedrooms: 2, status: "occupied" },
          { id: "u-ar-5-2", unitNumber: "واحد ۱۰", floor: 5, meters: 110, bedrooms: 2, status: "unlisted" }
        ]
      },
      {
        floorNumber: 4,
        floorLabel: "طبقه ۴",
        units: [
          { id: "u-ar-4-1", unitNumber: "واحد ۷", floor: 4, meters: 110, bedrooms: 2, status: "occupied" },
          { id: "u-ar-4-2", unitNumber: "واحد ۸", floor: 4, meters: 110, bedrooms: 2, status: "occupied" }
        ]
      },
      {
        floorNumber: 3,
        floorLabel: "طبقه ۳",
        units: [
          { id: "u-ar-3-1", unitNumber: "واحد ۵", floor: 3, meters: 110, bedrooms: 2, status: "occupied" },
          { id: "u-ar-3-2", unitNumber: "واحد ۶", floor: 3, meters: 110, bedrooms: 2, status: "unlisted" }
        ]
      },
      {
        floorNumber: 2,
        floorLabel: "طبقه ۲",
        units: [
          { id: "u-ar-2-1", unitNumber: "واحد ۳", floor: 2, meters: 110, bedrooms: 2, status: "occupied" },
          { id: "u-ar-2-2", unitNumber: "واحد ۴", floor: 2, meters: 110, bedrooms: 2, status: "occupied" }
        ]
      },
      {
        floorNumber: 1,
        floorLabel: "طبقه ۱",
        units: [
          { id: "u-ar-1-1", unitNumber: "واحد ۱", floor: 1, meters: 110, bedrooms: 2, status: "occupied" },
          { id: "u-ar-1-2", unitNumber: "واحد ۲", floor: 1, meters: 110, bedrooms: 2, status: "occupied" }
        ]
      }
    ]
  },

  {
    id: "bldg-saadat-allameh-26",
    name: "مجتمع مسکونی سروستان ۲۶",
    district: "سعادت‌آباد",
    street: "خیابان علامه شمالی، کوچه هجدهم شرقی",
    plaque: "پلاک ۲۶",
    fullAddress: "سعادت‌آباد، خیابان علامه شمالی، کوچه هجدهم شرقی، پلاک ۲۶",
    totalFloors: 6,
    unitsCount: 12,
    age: 1,
    architecturalStyle: "luxury-terrace",
    amenities: {
      hasElevator: true,
      hasParking: true,
      hasStorage: true,
      hasLobby: true,
      hasLobbyMan: true,
      hasRoofGarden: true,
      hasPool: false,
      hasGym: false
    },
    coordinates: { lat: 35.7875, lng: 51.3731 },
    worldPosition: { x: -85, z: -80 },
    dimensions: { width: 19, depth: 23, height: 30 },
    colorTheme: {
      facadeColor: "#f1f5f9",
      windowColor: "#0ea5e9",
      roofColor: "#0f172a",
      accentColor: "#10b981"
    },
    floors: [
      {
        floorNumber: 6,
        floorLabel: "طبقه ۶ (روف‌گاردن)",
        units: [
          { id: "u-sv-6-1", unitNumber: "پنت ۱", floor: 6, meters: 150, bedrooms: 3, status: "occupied" },
          { id: "u-sv-6-2", unitNumber: "پنت ۲", floor: 6, meters: 150, bedrooms: 3, status: "unlisted" }
        ]
      },
      {
        floorNumber: 5,
        floorLabel: "طبقه ۵",
        units: [
          { id: "u-sv-5-1", unitNumber: "واحد ۹", floor: 5, meters: 125, bedrooms: 2, status: "occupied" },
          { id: "u-sv-5-2", unitNumber: "واحد ۱۰", floor: 5, meters: 125, bedrooms: 2, status: "unlisted" }
        ]
      },
      {
        floorNumber: 4,
        floorLabel: "طبقه ۴",
        units: [
          { id: "u-sv-4-1", unitNumber: "واحد ۷", floor: 4, meters: 125, bedrooms: 2, status: "occupied" },
          { id: "u-sv-4-2", unitNumber: "واحد ۸", floor: 4, meters: 125, bedrooms: 2, status: "occupied" }
        ]
      },
      {
        floorNumber: 3,
        floorLabel: "طبقه ۳",
        units: [
          { id: "u-sv-3-1", unitNumber: "واحد ۵", floor: 3, meters: 125, bedrooms: 2, status: "occupied" },
          { id: "u-sv-3-2", unitNumber: "واحد ۶", floor: 3, meters: 125, bedrooms: 2, status: "occupied" }
        ]
      },
      {
        floorNumber: 2,
        floorLabel: "طبقه ۲",
        units: [
          { id: "u-sv-2-1", unitNumber: "واحد ۳", floor: 2, meters: 125, bedrooms: 2, status: "occupied" },
          { id: "u-sv-2-2", unitNumber: "واحد ۴", floor: 2, meters: 125, bedrooms: 2, status: "occupied" }
        ]
      },
      {
        floorNumber: 1,
        floorLabel: "طبقه ۱",
        units: [
          { id: "u-sv-1-1", unitNumber: "واحد ۱", floor: 1, meters: 120, bedrooms: 2, status: "occupied" },
          { id: "u-sv-1-2", unitNumber: "واحد ۲", floor: 1, meters: 120, bedrooms: 2, status: "unlisted" }
        ]
      }
    ]
  },

  {
    id: "bldg-shahrak-iranzamin-tower",
    name: "برج مدرن ایران‌زمین",
    district: "شهرک غرب",
    street: "بلوار ایران‌زمین، تقاطع مهستان",
    plaque: "پلاک ۲",
    fullAddress: "شهرک غرب، بلوار ایران‌زمین، تقاطع مهستان، پلاک ۲",
    totalFloors: 10,
    unitsCount: 20,
    age: 3,
    architecturalStyle: "highrise-tower",
    amenities: {
      hasElevator: true,
      hasParking: true,
      hasStorage: true,
      hasLobby: true,
      hasLobbyMan: true,
      hasRoofGarden: true,
      hasPool: true,
      hasGym: true
    },
    coordinates: { lat: 35.7595, lng: 51.3662 },
    worldPosition: { x: -40, z: 45 },
    dimensions: { width: 24, depth: 24, height: 52 },
    colorTheme: {
      facadeColor: "#f8fafc",
      windowColor: "#0284c7",
      roofColor: "#0f172a",
      accentColor: "#38bdf8"
    },
    floors: [
      {
        floorNumber: 10,
        floorLabel: "طبقه ۱۰ (پنت‌هاوس)",
        units: [
          { id: "u-tw-10-1", unitNumber: "رویال پنت ۱", floor: 10, meters: 260, bedrooms: 4, status: "occupied" }
        ]
      },
      {
        floorNumber: 9,
        floorLabel: "طبقه ۹",
        units: [
          { id: "u-tw-9-1", unitNumber: "واحد ۱۷", floor: 9, meters: 170, bedrooms: 3, status: "unlisted" },
          { id: "u-tw-9-2", unitNumber: "واحد ۱۸", floor: 9, meters: 170, bedrooms: 3, status: "occupied" }
        ]
      },
      {
        floorNumber: 8,
        floorLabel: "طبقه ۸",
        units: [
          { id: "u-tw-8-1", unitNumber: "واحد ۱۵", floor: 8, meters: 170, bedrooms: 3, status: "occupied" },
          { id: "u-tw-8-2", unitNumber: "واحد ۱۶", floor: 8, meters: 170, bedrooms: 3, status: "occupied" }
        ]
      },
      {
        floorNumber: 7,
        floorLabel: "طبقه ۷",
        units: [
          { id: "u-tw-7-1", unitNumber: "واحد ۱۳", floor: 7, meters: 170, bedrooms: 3, status: "occupied" },
          { id: "u-tw-7-2", unitNumber: "واحد ۱۴", floor: 7, meters: 170, bedrooms: 3, status: "unlisted" }
        ]
      },
      {
        floorNumber: 6,
        floorLabel: "طبقه ۶",
        units: [
          { id: "u-tw-6-1", unitNumber: "واحد ۱۱", floor: 6, meters: 170, bedrooms: 3, status: "occupied" },
          { id: "u-tw-6-2", unitNumber: "واحد ۱۲", floor: 6, meters: 170, bedrooms: 3, status: "occupied" }
        ]
      },
      {
        floorNumber: 5,
        floorLabel: "طبقه ۵",
        units: [
          { id: "u-tw-5-1", unitNumber: "واحد ۹", floor: 5, meters: 170, bedrooms: 3, status: "occupied" },
          { id: "u-tw-5-2", unitNumber: "واحد ۱۰", floor: 5, meters: 170, bedrooms: 3, status: "occupied" }
        ]
      },
      {
        floorNumber: 4,
        floorLabel: "طبقه ۴",
        units: [
          { id: "u-tw-4-1", unitNumber: "واحد ۷", floor: 4, meters: 170, bedrooms: 3, status: "unlisted" },
          { id: "u-tw-4-2", unitNumber: "واحد ۸", floor: 4, meters: 170, bedrooms: 3, status: "occupied" }
        ]
      },
      {
        floorNumber: 3,
        floorLabel: "طبقه ۳",
        units: [
          { id: "u-tw-3-1", unitNumber: "واحد ۵", floor: 3, meters: 170, bedrooms: 3, status: "occupied" },
          { id: "u-tw-3-2", unitNumber: "واحد ۶", floor: 3, meters: 170, bedrooms: 3, status: "occupied" }
        ]
      },
      {
        floorNumber: 2,
        floorLabel: "طبقه ۲",
        units: [
          { id: "u-tw-2-1", unitNumber: "واحد ۳", floor: 2, meters: 170, bedrooms: 3, status: "occupied" },
          { id: "u-tw-2-2", unitNumber: "واحد ۴", floor: 2, meters: 170, bedrooms: 3, status: "occupied" }
        ]
      },
      {
        floorNumber: 1,
        floorLabel: "طبقه ۱",
        units: [
          { id: "u-tw-1-1", unitNumber: "واحد ۱", floor: 1, meters: 165, bedrooms: 3, status: "occupied" },
          { id: "u-tw-1-2", unitNumber: "واحد ۲", floor: 1, meters: 165, bedrooms: 3, status: "unlisted" }
        ]
      }
    ]
  },

  {
    id: "bldg-niavaran-bukan-15",
    name: "برج‌باغ کاخ بوکان",
    district: "نیاوران",
    street: "خیابان بوکان، بن‌بست کوهپایه",
    plaque: "پلاک ۱۵",
    fullAddress: "نیاوران، خیابان بوکان، بن‌بست کوهپایه، پلاک ۱۵",
    totalFloors: 9,
    unitsCount: 18,
    age: 2,
    architecturalStyle: "luxury-terrace",
    amenities: {
      hasElevator: true,
      hasParking: true,
      hasStorage: true,
      hasLobby: true,
      hasLobbyMan: true,
      hasRoofGarden: true,
      hasPool: true,
      hasGym: true
    },
    coordinates: { lat: 35.821, lng: 51.469 },
    worldPosition: { x: 105, z: -165 },
    dimensions: { width: 26, depth: 28, height: 48 },
    colorTheme: {
      facadeColor: "#fef3c7",
      windowColor: "#38bdf8",
      roofColor: "#0284c7",
      accentColor: "#f59e0b"
    },
    floors: [
      {
        floorNumber: 9,
        floorLabel: "طبقه ۹ (پنت‌هاوس)",
        units: [
          { id: "u-bk-9-1", unitNumber: "پنت‌هاوس رویال", floor: 9, meters: 320, bedrooms: 4, status: "occupied" }
        ]
      },
      {
        floorNumber: 8,
        floorLabel: "طبقه ۸",
        units: [
          { id: "u-bk-8-1", unitNumber: "واحد ۱۵", floor: 8, meters: 200, bedrooms: 3, status: "unlisted" },
          { id: "u-bk-8-2", unitNumber: "واحد ۱۶", floor: 8, meters: 200, bedrooms: 3, status: "occupied" }
        ]
      },
      {
        floorNumber: 7,
        floorLabel: "طبقه ۷",
        units: [
          { id: "u-bk-7-1", unitNumber: "واحد ۱۳", floor: 7, meters: 200, bedrooms: 3, status: "occupied" },
          { id: "u-bk-7-2", unitNumber: "واحد ۱۴", floor: 7, meters: 200, bedrooms: 3, status: "occupied" }
        ]
      },
      {
        floorNumber: 6,
        floorLabel: "طبقه ۶",
        units: [
          { id: "u-bk-6-1", unitNumber: "واحد ۱۱", floor: 6, meters: 200, bedrooms: 3, status: "occupied" },
          { id: "u-bk-6-2", unitNumber: "واحد ۱۲", floor: 6, meters: 200, bedrooms: 3, status: "unlisted" }
        ]
      },
      {
        floorNumber: 5,
        floorLabel: "طبقه ۵",
        units: [
          { id: "u-bk-5-1", unitNumber: "واحد ۹", floor: 5, meters: 200, bedrooms: 3, status: "occupied" },
          { id: "u-bk-5-2", unitNumber: "واحد ۱۰", floor: 5, meters: 200, bedrooms: 3, status: "occupied" }
        ]
      },
      {
        floorNumber: 4,
        floorLabel: "طبقه ۴",
        units: [
          { id: "u-bk-4-1", unitNumber: "واحد ۷", floor: 4, meters: 200, bedrooms: 3, status: "occupied" },
          { id: "u-bk-4-2", unitNumber: "واحد ۸", floor: 4, meters: 200, bedrooms: 3, status: "occupied" }
        ]
      },
      {
        floorNumber: 3,
        floorLabel: "طبقه ۳",
        units: [
          { id: "u-bk-3-1", unitNumber: "واحد ۵", floor: 3, meters: 200, bedrooms: 3, status: "unlisted" },
          { id: "u-bk-3-2", unitNumber: "واحد ۶", floor: 3, meters: 200, bedrooms: 3, status: "occupied" }
        ]
      },
      {
        floorNumber: 2,
        floorLabel: "طبقه ۲",
        units: [
          { id: "u-bk-2-1", unitNumber: "واحد ۳", floor: 2, meters: 195, bedrooms: 3, status: "occupied" },
          { id: "u-bk-2-2", unitNumber: "واحد ۴", floor: 2, meters: 195, bedrooms: 3, status: "occupied" }
        ]
      },
      {
        floorNumber: 1,
        floorLabel: "طبقه ۱",
        units: [
          { id: "u-bk-1-1", unitNumber: "واحد ۱", floor: 1, meters: 190, bedrooms: 3, status: "occupied" },
          { id: "u-bk-1-2", unitNumber: "واحد ۲", floor: 1, meters: 190, bedrooms: 3, status: "unlisted" }
        ]
      }
    ]
  }
];

// Helper functions
export function getBuildingById(id: string): TehranBuilding | undefined {
  return TEHRAN_BUILDINGS.find((b) => b.id === id);
}

export function getBuildingByPropertyId(propertyId: number): TehranBuilding | undefined {
  for (const bldg of TEHRAN_BUILDINGS) {
    for (const floor of bldg.floors) {
      for (const unit of floor.units) {
        if (unit.propertyId === propertyId) {
          return bldg;
        }
      }
    }
  }
  return undefined;
}

export function getActiveUnitsInBuilding(building: TehranBuilding): {
  rentUnits: BuildingUnit[];
  saleUnits: BuildingUnit[];
} {
  const rentUnits: BuildingUnit[] = [];
  const saleUnits: BuildingUnit[] = [];

  for (const floor of building.floors) {
    for (const unit of floor.units) {
      if (unit.status === "rent" && unit.propertyId) {
        rentUnits.push(unit);
      } else if (unit.status === "sale" && unit.propertyId) {
        saleUnits.push(unit);
      }
    }
  }

  return { rentUnits, saleUnits };
}
