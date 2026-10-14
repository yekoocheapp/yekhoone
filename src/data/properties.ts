export interface Property {
  id: number;
  title: string;
  slug: string;
  district: string;
  address: string;
  type: "rent" | "sale";
  propertyType: "آپارتمان مسکونی" | "ویلایی / خانه" | "مستغلات" | "اداری و تجاری";
  meters: number;
  bedrooms: number;
  floor: number;
  totalFloors: number;
  unitsPerFloor: number;
  age: number; // Building age in years (0 = نوساز)
  orientation: "شمالی" | "جنوبی" | "دوکله" | "شرقی-غربی" | "شمالی-جنوبی";
  hasParking: boolean;
  hasElevator: boolean;
  hasStorage: boolean;
  hasBalcony: boolean;
  coolingSystem: string;
  heatingSystem: string;
  flooring: string;
  deedStatus: string; // e.g. سند تک‌برگ شخصی
  deposit: number; // in Tomans
  rent: number;    // in Tomans
  totalPrice?: number;
  pricePerMeter?: number;
  agencyName: string;
  agencyPhone: string;
  agentName: string;
  agentRole: string;
  agentPhone: string;
  agentRating: number;
  agentDealsCount: number;
  isVerified: boolean;
  images: string[];
  tags: string[];
  description: string;
  coordinates: { lat: number; lng: number };
  createdAt: string;
  lastAlgorithmicBump?: string;
  nextAlgorithmicBump?: string;
  bumpIntervalHours?: number; // 4 to 6 hours systemic rotation
}

export const initialProperties: Property[] = [
  {
    id: 1,
    title: "آپارتمان ۱۲۰ متری، نورگیر فوق‌العاده، علامه شمالی",
    slug: "apartment-120m-allameh-shomali",
    district: "سعادت‌آباد",
    address: "سعادت‌آباد، خیابان علامه شمالی، کوچه هجدهم شرقی، پلاک ۲۴",
    type: "rent",
    propertyType: "آپارتمان مسکونی",
    meters: 120,
    bedrooms: 2,
    floor: 3,
    totalFloors: 5,
    unitsPerFloor: 2,
    age: 2,
    orientation: "جنوبی",
    hasParking: true,
    hasElevator: true,
    hasStorage: true,
    hasBalcony: true,
    coolingSystem: "داکت اسپلیت اینورتر",
    heatingSystem: "پکیج و رادیاتور آلمانی",
    flooring: "سنگ دهبید ۸۰×۸۰",
    deedStatus: "سند تک‌برگ شخصی ملکی",
    deposit: 600000000,
    rent: 32000000,
    agencyName: "املاک نوین سعادت‌آباد",
    agencyPhone: "۰۲۱۲۲۳۳۴۴۵۵",
    agentName: "مهرداد حیدری",
    agentRole: "مشاور ارشد منطقه ۲",
    agentPhone: "۰۹۱۲۳۴۵۶۷۸۹",
    agentRating: 4.9,
    agentDealsCount: 52,
    isVerified: true,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["نوساز کلیدنخورده", "لابی مجلل مبله", "سرایداری ۲۴ ساعته مقیم", "سالن پرده‌خور"],
    description: "واحدی استثنایی در یکی از دنج‌ترین و عریض‌ترین کوچه‌های علامه شمالی. پلان تفکیکی بی‌نقص بدون کوچک‌ترین پرتی. سالن پذیرایی وسیع و آفتاب‌گیر با پنجره‌های قدی ترمال‌بریک رو به جنوب. آشپزخانه دلباز با کابینت‌های مدرن انزو و صفحه سنگ کورین. اتاق خواب‌های استاندارد با کمد دیواری‌های عمیق. لابی شیک، مشاعات تمیز، ۲ لاین آسانسور ویتور ایتالیا و سرایدار مقیم. تخلیه و آماده تحویل فوری.",
    coordinates: { lat: 35.7876, lng: 51.3734 },
    createdAt: "امروز",
    lastAlgorithmicBump: "۴۵ دقیقه پیش",
    nextAlgorithmicBump: "۳ ساعت و ۱۵ دقیقه دیگر",
    bumpIntervalHours: 4
  },
  {
    id: 2,
    title: "۱۴۵ متری دیپلمات‌نشین، فاز یک با تراس قابل چیدمان",
    slug: "apartment-145m-shahrak-gharb",
    district: "شهرک غرب",
    address: "شهرک غرب، بلوار ایران‌زمین، خیابان مهستان، کوچه گلستان",
    type: "rent",
    propertyType: "آپارتمان مسکونی",
    meters: 145,
    bedrooms: 3,
    floor: 5,
    totalFloors: 6,
    unitsPerFloor: 1,
    age: 4,
    orientation: "دوکله",
    hasParking: true,
    hasElevator: true,
    hasStorage: true,
    hasBalcony: true,
    coolingSystem: "چیلر مرکزی و فن‌کویل",
    heatingSystem: "موتورخانه مرکزی",
    flooring: "پارکت لمینت آلمانی",
    deedStatus: "سند تک‌برگ شش‌دانگ",
    deposit: 1200000000,
    rent: 45000000,
    agencyName: "املاک دیپلمات غرب",
    agencyPhone: "۰۲۱۸۸۰۸۸۰۸۰",
    agentName: "مهندس حسینی",
    agentRole: "مدیر قراردادهای املاک غرب",
    agentPhone: "۰۹۱۹۸۷۶۵۴۳۲",
    agentRating: 4.8,
    agentDealsCount: 68,
    isVerified: true,
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["تک‌واحدی", "تراس رو به فضای سبز", "استخر و جکوزی فعال", "مستر روم"],
    description: "لوکس‌ترین سازه منطقه در تاپ لوکیشن ایران‌زمین. فرعی دنج و مشجر. یک خواب مستر با کلوزت روم مجهز. آشپزخانه فرنیش بوش آلمان. مشاعات آبی لوکس شامل استخر، سونا و جکوزی فعال با نگهداری هفتگی. پارکینگ باکس اختصاصی بدون مزاحم. لابی‌من سه شیفت و امنیت فوق‌العاده بالا.",
    coordinates: { lat: 35.7592, lng: 51.3654 },
    createdAt: "۲ روز پیش",
    lastAlgorithmicBump: "۲ ساعت پیش",
    nextAlgorithmicBump: "۲ ساعت دیگر",
    bumpIntervalHours: 4
  },
  {
    id: 3,
    title: "۸۵ متری خوش‌نقشه، سردار جنگل شمالی، رهن کامل",
    slug: "apartment-85m-punak",
    district: "پونک",
    address: "پونک، بلوار سردار جنگل شمالی، خیابان شقایق، پلاک ۱۲",
    type: "rent",
    propertyType: "آپارتمان مسکونی",
    meters: 85,
    bedrooms: 2,
    floor: 2,
    totalFloors: 5,
    unitsPerFloor: 3,
    age: 5,
    orientation: "شمالی",
    hasParking: true,
    hasElevator: true,
    hasStorage: true,
    hasBalcony: false,
    coolingSystem: "کولر گازی اسپلیت",
    heatingSystem: "پکیج",
    flooring: "سرامیک درجه یک",
    deedStatus: "سند تک‌برگ",
    deposit: 850000000,
    rent: 0,
    agencyName: "املاک کاج پونک",
    agencyPhone: "۰۲۱۴۴۴۴۱۱۱۱",
    agentName: "امیر رضایی",
    agentRole: "مشاور تخصصی پونک و سردار جنگل",
    agentPhone: "۰۹۳۵۱۲۳۴۵۶۷",
    agentRating: 4.7,
    agentDealsCount: 39,
    isVerified: true,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["رهن کامل", "سالن مربع بدون پرتی", "دسترسی عالی به ستاری و همت"],
    description: "واحدی استثنایی با رهن کامل و امکان تبدیل جزئی. نقشه مهندسی با چیدمان عالی برای دو دست مبل. نورگیر عالی در طول روز. مشاعات بازسازی شده با دوربین مداربسته در کل ساختمان. همسایگان موجه و فرهیخته. دسترسی ۲ دقیقه‌ای به بی‌آر‌تی و اشرفی اصفهانی.",
    coordinates: { lat: 35.7689, lng: 51.3321 },
    createdAt: "امروز",
    lastAlgorithmicBump: "۳ ساعت پیش",
    nextAlgorithmicBump: "۱ ساعت دیگر",
    bumpIntervalHours: 4
  },
  {
    id: 4,
    title: "۹۵ متری نوساز، خیابان ابراهیمی با پارکینگ سندی",
    slug: "apartment-95m-marzdaran",
    district: "مرزداران",
    address: "مرزداران، خیابان شهید ابراهیمی، کوچه بوستان دوم",
    type: "rent",
    propertyType: "آپارتمان مسکونی",
    meters: 95,
    bedrooms: 2,
    floor: 4,
    totalFloors: 5,
    unitsPerFloor: 2,
    age: 1,
    orientation: "جنوبی",
    hasParking: true,
    hasElevator: true,
    hasStorage: true,
    hasBalcony: true,
    coolingSystem: "داکت اسپلیت",
    heatingSystem: "پکیج",
    flooring: "سنگ اسلب",
    deedStatus: "سند تک‌برگ آماده انتقال",
    deposit: 400000000,
    rent: 22000000,
    agencyName: "املاک نگین مرزداران",
    agencyPhone: "۰۲۱۴۴۲۲۳۳۴۴",
    agentName: "محسن یعقوبی",
    agentRole: "کارشناس املاک منطقه مرزداران",
    agentPhone: "۰۹۱۲۸۸۸۹۹۰۰",
    agentRating: 4.8,
    agentDealsCount: 45,
    isVerified: true,
    images: [
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["کابینت های‌گلاس ترک", "تراس کاربردی", "آسانسور ۸ نفره اتوماتیک"],
    description: "واحدی بسیار شیک و مدرن با نور مستقیم جنوب. کابینت‌های های‌گلاس سفید مات با گاز رومیزی و هود توکار. سیستم سرمایش و گرمایش مستقل داکت اسپلیت. مشاعات تمام سنگ با نورپردازی خطی. مالک بسیار منعطف با امکان تمدید چند ساله برای خانواده موجه.",
    coordinates: { lat: 35.7381, lng: 51.3542 },
    createdAt: "۳ روز پیش",
    lastAlgorithmicBump: "۳۰ دقیقه پیش",
    nextAlgorithmicBump: "۵ ساعت و ۳۰ دقیقه دیگر",
    bumpIntervalHours: 6
  },
  {
    id: 5,
    title: "۱۸۰ متری مدرن، گل‌سنگ، فول مشاعات هتلینگ و روف‌گاردن",
    slug: "apartment-180m-niavaran-sale",
    district: "نیاوران",
    address: "نیاوران، خیابان گل‌سنگ، بن‌بست مینا، عمارت یاس",
    type: "sale",
    propertyType: "آپارتمان مسکونی",
    meters: 180,
    bedrooms: 3,
    floor: 6,
    totalFloors: 8,
    unitsPerFloor: 2,
    age: 0,
    orientation: "شمالی-جنوبی",
    hasParking: true,
    hasElevator: true,
    hasStorage: true,
    hasBalcony: true,
    coolingSystem: "VRF مرکزی داایکین ژاپن",
    heatingSystem: "موتورخانه مرکزی مدرن",
    flooring: "سنگ امپرادور اسپانیا",
    deedStatus: "سند تک‌برگ شخصی بدون ریشه",
    deposit: 0,
    rent: 0,
    totalPrice: 48000000000,
    pricePerMeter: 266666000,
    agencyName: "املاک پایتخت شمیران",
    agencyPhone: "۰۲۱۲۲۸۰۸۰۸۰",
    agentName: "سهراب کریمی",
    agentRole: "مشاور پروژه‌های لوکس شمیرانات",
    agentPhone: "۰۹۱۲۱۱۱۴۴۵۵",
    agentRating: 5.0,
    agentDealsCount: 74,
    isVerified: true,
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["شاهکار معماری", "روف‌گاردن مجهز ۳۶۰ درجه", "۲ پارکینگ سندی باکس", "لابی با ارتفاع سقف ۶ متر"],
    description: "فروش استثنایی واحدی سوپرلوکس در تاپ‌ترین لوکیشن گل‌سنگ نیاوران. سازه‌ای از سازنده بنام شمیران با متریال تماماً وارداتی برند. سالن یکپارچه بدون ستون رو به کوهستان و شهر. ۳ خواب کینگ با حمام‌های مستر اختصاصی. لابی مجلل به وسعت ۴۰۰ متر همراه با لابی‌من ۲۴ ساعته، تیم خدماتی مقیم، سالن اجتماعات، سینما اختصاصی و استخر چهارفصل در طبقه منفی دو.",
    coordinates: { lat: 35.8198, lng: 51.4682 },
    createdAt: "امروز",
    lastAlgorithmicBump: "۱ ساعت پیش",
    nextAlgorithmicBump: "۳ ساعت دیگر",
    bumpIntervalHours: 4
  },
  {
    id: 6,
    title: "۷۰ متری بازسازی کامل، سازمان آب، دسترسی عالی به مترو",
    slug: "apartment-70m-sadeghiyeh",
    district: "صادقیه",
    address: "صادقیه، فلکه اول، خیابان سازمان آب، کوچه گلناز",
    type: "rent",
    propertyType: "آپارتمان مسکونی",
    meters: 70,
    bedrooms: 1,
    floor: 1,
    totalFloors: 4,
    unitsPerFloor: 2,
    age: 12,
    orientation: "جنوبی",
    hasParking: true,
    hasElevator: false,
    hasStorage: true,
    hasBalcony: true,
    coolingSystem: "کولر آبی سلولزی",
    heatingSystem: "شوفاژ مرکزی",
    flooring: "کفپوش لمینت ضدآب",
    deedStatus: "سند تک‌برگ اوقافی نیست (شخصی)",
    deposit: 250000000,
    rent: 16000000,
    agencyName: "املاک ستاره صادقیه",
    agencyPhone: "۰۲۱۴۴۲۵۵۵۵۵",
    agentName: "بهروز مرادی",
    agentRole: "مشاور منطقه صادقیه و ستارخان",
    agentPhone: "۰۹۱۲۷۷۷۲۲۳۳",
    agentRating: 4.6,
    agentDealsCount: 31,
    isVerified: true,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["صفر تا صد بازسازی", "۲ دقیقه پیاده تا ایستگاه مترو", "تخلیه کلید در املاک"],
    description: "واحد نقلی و بسیار تمیز، بازسازی شده به سبک مینیمال مدرن. لوله‌کشی و سیم‌کشی به طور کامل تعویض شده است. مناسب زوج یا مجرد موجه. ساختمان بسیار آرام با مدیریت قوی. دسترسی فوق‌العاده سریع به ایستگاه مترو طرشت و میدان صادقیه.",
    coordinates: { lat: 35.7205, lng: 51.3392 },
    createdAt: "۴ روز پیش",
    lastAlgorithmicBump: "۴ ساعت پیش",
    nextAlgorithmicBump: "۲ ساعت دیگر",
    bumpIntervalHours: 6
  }
];

export function getPropertyById(id: number): Property | undefined {
  return initialProperties.find(p => p.id === id);
}

export function formatPersianNumber(num: number | string): string {
  return new Intl.NumberFormat("fa-IR").format(Number(num));
}
