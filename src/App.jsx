import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";

/* ============================================================================
   DABRO BARBERSHOP — Premium Single-Page Landing Site
   Stack: React + Tailwind CSS + Framer Motion (no other UI libraries)
   Languages: English / Russian / Uzbek (manual state-based i18n)
   ========================================================================= */

/* ============================================================================
   O'Z RASM VA VIDEOLARINGIZNI SHU YERGA QO'YING — 3 TA JOY:

   1) MEDIA.about          → "Biz haqimizda" bo'limidagi bitta rasm
   2) galleryData (pastda) → Galereya bo'limidagi 8 ta rasm ("url" maydoni)
   3) MEDIA.heroVideo va MEDIA.promoVideo → bosh sahifa va "Tajriba" videolari

   QANDAY QILISH KERAK:
   a) Loyihangizdagi "public" papkasini oching, ichiga "media" degan papka yarating
      (masalan: public/media/about.jpg, public/media/gallery-1.jpg, public/media/hero.mp4)
   b) Rasm/video fayllaringizni o'sha papkaga tashlang
   c) Pastdagi https://... havolalarni shunga almashtiring: "/media/about.jpg"
      (boshida faqat / bo'lsin, https:// kerak emas — chunki fayl endi o'zingizning loyihangizda)

   Papka bilan ovora bo'lishni istamasangiz: rasm/videoni istalgan bepul saytga
   (masalan imgur.com, yoki telefoningizdan Google Drive'ga) yuklab, undan chiqqan
   to'g'ridan-to'g'ri havolani shu yerga qo'ysangiz ham ishlayveradi.
   ========================================================================= */
const MEDIA = {
  heroPoster:
    "https://images.unsplash.com/photo-1657105052497-f996284ffff8?auto=format&fit=crop&w=1600&q=80",
  heroVideo: "https://assets.mixkit.co/videos/43236/43236-360.mp4", // <-- shu yerga o'z videongizni qo'ying
  // DIQQAT: hozir bu yerda video o'rniga RASM (.avif) havolasi turibdi, shuning uchun
  // "Tajriba" bo'limidagi video hozircha ishlamaydi (kod endi shunga chidamli qilib
  // qo'yildi — video ishlamasa, shu joyda oddiy rasm ko'rsatiladi). Ishlashi uchun
  // shu yerga haqiqiy .mp4 video havolasini qo'ying.
  promoVideo: "https://i.postimg.cc/tTn25Yjn/IMG-2370.avif", // <-- shu yerga o'z VIDEOingizni (.mp4) qo'ying
  about:
    "https://i.postimg.cc/NGbNBq00/IMG-2377.avif", // <-- "Biz haqimizda" rasmi shu yerda
};

/* Galereya rasmlari — pastdagi har bir "url" ni o'zingizning rasmingizga almashtiring */
const galleryData = [
  {
    id: 1,
    category: "interior",
    url: "https://i.postimg.cc/7ZSnWK9J/IMG-0519.avif",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    id: 2,
    category: "haircuts",
    url: "https://i.postimg.cc/qRcpzB5b/IMG-2381.avif",
    span: "",
  },
  {
    id: 3,
    category: "workspace",
    url: "https://i.postimg.cc/v86hn8nz/IMG-0524.avif",
    span: "md:row-span-2",
  },
  {
    id: 4,
    category: "atmosphere",
    url: "https://i.postimg.cc/kGrxs8SZ/IMG-0525.avif",
    span: "",
  },
  {
    id: 5,
    category: "interior",
    url: "https://i.postimg.cc/HWZmr2Q6/Snimok-ekrana-2026-07-25-052546.png",
    span: "",
  },
  {
    id: 6,
    category: "haircuts",
    url: "https://i.postimg.cc/SNM6ngwf/IMG-0520.avif",
    span: "md:col-span-2",
  },
  {
    id: 7,
    category: "workspace",
    url: "https://i.postimg.cc/QVGWgrRY/IMG-0522.avif",
    span: "",
  },
  {
    id: 8,
    category: "atmosphere",
    url: "https://i.postimg.cc/26S0B2HX/IMG-2384.avif",
    span: "",
  },
];

/* ----------------------------------------------------------------------
   UTILITIES
   ---------------------------------------------------------------------- */
const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

/* Tor ekranlarda (telefon) yoki "reduced motion" yoqilgan bo'lsa, eng "og'ir"
   scroll-parallaks effektlarini (scale + translate) o'chirish uchun. Aynan shu
   effektlar to'liq ekranli video ustida ishlaganda telefonda eng ko'p "qotish"ga
   sabab bo'ladi. */
const useSimplifiedMotion = () => {
  const [simplified, setSimplified] = useState(false);

  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 767px)");
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSimplified(mqMobile.matches || mqReduced.matches);
    update();
    mqMobile.addEventListener("change", update);
    mqReduced.addEventListener("change", update);
    return () => {
      mqMobile.removeEventListener("change", update);
      mqReduced.removeEventListener("change", update);
    };
  }, []);

  return simplified;
};

/* ============================================================================
   ICONS — minimal hand-drawn line icons (no icon library dependency)
   ========================================================================= */
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const IconMenu = (p) => (
  <svg {...base} {...p}>
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="17" x2="20" y2="17" />
  </svg>
);
const IconClose = (p) => (
  <svg {...base} {...p}>
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);
const IconChevronDown = (p) => (
  <svg {...base} {...p}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const IconArrowRight = (p) => (
  <svg {...base} {...p}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
const IconArrowUp = (p) => (
  <svg {...base} {...p}>
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);
const IconStar = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <polygon points="12,2 14.9,8.6 22,9.3 16.7,14.1 18.2,21.2 12,17.6 5.8,21.2 7.3,14.1 2,9.3 9.1,8.6" />
  </svg>
);
const IconPhone = (p) => (
  <svg {...base} {...p}>
    <rect x="7" y="2" width="10" height="20" rx="2.5" />
    <line x1="10" y1="18" x2="14" y2="18" />
  </svg>
);
const IconTelegram = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <polygon points="2,13 21,3 14,21 11,14" />
  </svg>
);
const IconInstagram = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const IconPin = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="9" r="5.5" />
    <polygon points="7.2,13 16.8,13 12,21" fill="currentColor" stroke="none" />
  </svg>
);
const IconClock = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="7" x2="12" y2="12.5" />
    <line x1="12" y1="12" x2="15.5" y2="14" />
  </svg>
);
const IconScissors = (p) => (
  <svg {...base} {...p}>
    <circle cx="6.5" cy="6.5" r="2.5" />
    <circle cx="6.5" cy="17.5" r="2.5" />
    <line x1="8.5" y1="8.2" x2="20" y2="19" />
    <line x1="8.5" y1="15.8" x2="20" y2="5" />
  </svg>
);
const IconRazor = (p) => (
  <svg {...base} {...p}>
    <line x1="4" y1="20" x2="16" y2="8" />
    <rect x="14.5" y="3.5" width="6" height="6" rx="1.2" transform="rotate(45 17.5 6.5)" />
  </svg>
);
const IconSmiley = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
    <path d="M8 14.5c1.2 1.4 2.6 2 4 2s2.8-.6 4-2" />
  </svg>
);
const IconCrown = (p) => (
  <svg {...base} {...p}>
    <polygon points="3,18 3,9 8,13 12,6 16,13 21,9 21,18" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const IconVolumeOn = (p) => (
  <svg {...base} {...p}>
    <polygon points="4,9 8,9 13,4 13,20 8,15 4,15" fill="currentColor" stroke="none" />
    <path d="M17 8c1.5 1.2 2.3 2.6 2.3 4s-.8 2.8-2.3 4" />
  </svg>
);
const IconVolumeOff = (p) => (
  <svg {...base} {...p}>
    <polygon points="4,9 8,9 13,4 13,20 8,15 4,15" fill="currentColor" stroke="none" />
    <line x1="16" y1="9" x2="21" y2="14" />
    <line x1="21" y1="9" x2="16" y2="14" />
  </svg>
);
const IconCheck = (p) => (
  <svg {...base} {...p}>
    <polyline points="5 13 10 18 19 6" />
  </svg>
);
const IconBottle = (p) => (
  <svg {...base} {...p}>
    <path d="M10 3h4" />
    <path d="M10 3v3.4L7.4 9.6A3 3 0 0 0 6.5 11.7V19a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-7.3a3 3 0 0 0-.9-2.1L14 6.4V3" />
    <line x1="8.5" y1="14" x2="15.5" y2="14" />
  </svg>
);
const IconFlask = (p) => (
  <svg {...base} {...p}>
    <path d="M9.5 3h5" />
    <path d="M10.2 3v6.4L5 17.8A2 2 0 0 0 6.7 21h10.6A2 2 0 0 0 19 17.8L13.8 9.4V3" />
    <line x1="8" y1="15" x2="16" y2="15" />
  </svg>
);

/* ============================================================================
   TRANSLATIONS — every UI string in English, Russian & Uzbek
   ========================================================================= */
const translations = {
  en: {
    nav: { home: "Home", about: "About", barbers: "Barbers", prices: "Prices", gallery: "Gallery", contact: "Contact" },
    common: { bookAppointment: "Book Appointment", bookNow: "Book Now", viewBarbers: "View Barbers", scroll: "Scroll", popular: "Most Popular" },
    hero: { title: "DABRO BARBERSHOP", subtitle: "Where style meets craftsmanship" },
    about: {
      kicker: "About Us",
      title: "The Art of Precision Grooming",
      text: "Since 2022, DABRO Barbershop has been redefining the grooming experience in Tashkent. We blend timeless craftsmanship with modern technique, creating a sanctuary where every detail — from the first consultation to the final touch — is treated as an art form. This is more than a haircut. It's a ritual of refinement.",
      stat1: "Years of Excellence",
      stat2: "Happy Clients",
      stat3: "Awards Won",
    },
    gallery: {
      kicker: "Gallery",
      title: "Inside Our World",
      subtitle: "A glimpse into the atmosphere, craft and space we've built.",
      categories: { interior: "Interior", haircuts: "Haircuts", workspace: "Workspace", atmosphere: "Atmosphere" },
    },
    video: { kicker: "Experience", title: "Feel The Craft", subtitle: "Watch how precision, passion and artistry come together." },
    barbers: {
      kicker: "Our Team",
      title: "Meet The Masters",
      subtitle: "Skilled hands. Sharp eyes. Unmatched precision.",
      experience: "Experience",
      languages: "Languages",
      skills: "Specialties",
      years: "years",
    },
    prices: {
      kicker: "Price List",
      title: "Investment In Yourself",
      subtitle: "Transparent pricing for uncompromising quality.",
      groups: { haircuts: "Haircuts", extras: "Additional Services", promo: "Up to 20% Off", treatments: "Specialty Treatments" },
    },
    contact: {
      kicker: "Visit Us",
      title: "Let's Get You Looking Sharp",
      subtitle: "Book your seat at Tashkent's most exclusive barbershop.",
      address: "Address",
      addressValue: "Tashkent, Uzbekistan — tap to view on the map",
      mapCta: "Open in Google Maps",
      hours: "Working Hours",
      hoursValue: "Mon – Sun: 9:00 AM – 9:00 PM",
      phone: "Phone",
    },
    footer: { tagline: "Where Style Meets Perfection", rights: "All Rights Reserved." },
  },
  ru: {
    nav: { home: "Главная", about: "О нас", barbers: "Барберы", prices: "Цены", gallery: "Галерея", contact: "Контакты" },
    common: { bookAppointment: "Записаться", bookNow: "Записаться", viewBarbers: "Наши барберы", scroll: "Прокрутите", popular: "Популярный выбор" },
    hero: { title: "DABRO BARBERSHOP", subtitle: "Там, где стиль встречает мастерство" },
    about: {
      kicker: "О нас",
      title: "Искусство безупречного стиля",
      text: "С 2022 года DABRO Barbershop задаёт новые стандарты барберинга в Ташкенте. Мы сочетаем традиционное мастерство с современными техниками, создавая пространство, где каждая деталь — от первой консультации до финального штриха — становится настоящим искусством. Это больше, чем стрижка. Это ритуал безупречности.",
      stat1: "Лет совершенства",
      stat2: "Довольных клиентов",
      stat3: "Наград получено",
    },
    gallery: {
      kicker: "Галерея",
      title: "Загляните в наш мир",
      subtitle: "Атмосфера, мастерство и пространство, которые мы создали.",
      categories: { interior: "Интерьер", haircuts: "Стрижки", workspace: "Рабочее место", atmosphere: "Атмосфера" },
    },
    video: { kicker: "Атмосфера", title: "Почувствуйте мастерство", subtitle: "Посмотрите, как точность, страсть и искусство соединяются воедино." },
    barbers: {
      kicker: "Наша команда",
      title: "Знакомьтесь с мастерами",
      subtitle: "Уверенные руки. Острый глаз. Безупречная точность.",
      experience: "Опыт",
      languages: "Языки",
      skills: "Специализация",
      years: "лет",
    },
    prices: {
      kicker: "Прайс-лист",
      title: "Инвестиция в себя",
      subtitle: "Прозрачные цены за безупречное качество.",
      groups: { haircuts: "Стрижки", extras: "Доп. услуги", promo: "Акция до 20%", treatments: "Спецпроцедуры" },
    },
    contact: {
      kicker: "Приходите к нам",
      title: "Сделаем ваш образ безупречным",
      subtitle: "Забронируйте место в самом эксклюзивном барбершопе Ташкента.",
      address: "Адрес",
      addressValue: "Ташкент, Узбекистан — нажмите, чтобы посмотреть на карте",
      mapCta: "Открыть в Google Картах",
      hours: "Часы работы",
      hoursValue: "Пн – Вс: 9:00 – 21:00",
      phone: "Телефон",
    },
    footer: { tagline: "Там, где стиль встречает совершенство", rights: "Все права защищены." },
  },
  uz: {
    nav: { home: "Bosh sahifa", about: "Biz haqimizda", barbers: "Barberlar", prices: "Narxlar", gallery: "Galereya", contact: "Aloqa" },
    common: { bookAppointment: "Aloqaga chiqish", bookNow: "Aloqaga chiqish", viewBarbers: "Barberlarni ko'rish", scroll: "Pastga aylantiring", popular: "Eng mashhur" },
    hero: { title: "DABRO BARBERSHOP", subtitle: "Uslub mahorat bilan uchrashadigan joy" },
    about: {
      kicker: "Biz haqimizda",
      title: "Mukammal parvarishlash san'ati",
      text: "2022 yildan buyon DABRO Barbershop Toshkentda barberlik sohasini yangi bosqichga olib chiqmoqda. Biz an'anaviy mahoratni zamonaviy texnika bilan uyg'unlashtirib, har bir detal — birinchi maslahatdan so'nggi teginishgacha — san'at asari sifatida qaraladigan makon yaratamiz. Bu shunchaki soch olish emas. Bu mukammallik marosimi.",
      stat1: "Yillik tajriba",
      stat2: "Mamnun mijozlar",
      stat3: "Yutilgan mukofotlar",
    },
    gallery: {
      kicker: "Galereya",
      title: "Bizning dunyomizga nazar",
      subtitle: "Biz yaratgan muhit, mahorat va makonga bir nazar.",
      categories: { interior: "Interyer", haircuts: "Soch turmaklari", workspace: "Ish joyi", atmosphere: "Muhit" },
    },
    video: { kicker: "Tajriba", title: "Mahoratni his eting", subtitle: "Aniqlik, ishtiyoq va san'at qanday birlashishini tomosha qiling." },
    barbers: {
      kicker: "Jamoamiz",
      title: "Ustalar bilan tanishing",
      subtitle: "Mohir qo'llar. O'tkir nigoh. Tengsiz aniqlik.",
      experience: "Tajriba",
      languages: "Tillar",
      skills: "Mutaxassisligi",
      years: "yil",
    },
    prices: {
      kicker: "Narxlar ro'yxati",
      title: "O'zingizga sarmoya",
      subtitle: "Yuqori sifat uchun shaffof narxlar.",
      groups: { haircuts: "Soch olish", extras: "Qo'shimcha xizmatlar", promo: "20% gacha aksiya", treatments: "Maxsus protseduralar" },
    },
    contact: {
      kicker: "Bizga tashrif buyuring",
      title: "Ko'rinishingizni mukammal qilaylik",
      subtitle: "Toshkentning eng nufuzli barbershopidan joy band qiling.",
      address: "Manzil",
      addressValue: "Toshkent, O'zbekiston — xaritada ko'rish uchun bosing",
      mapCta: "Google Xaritada ochish",
      hours: "Ish vaqti",
      hoursValue: "Dush – Yak: 9:00 – 21:00",
      phone: "Telefon",
    },
    footer: { tagline: "Uslub mukammallik bilan uchrashadigan joy", rights: "Barcha huquqlar himoyalangan." },
  },
};

/* Shared skill dictionary used by every barber card (avoids repeated strings) */
const skillLabels = {
  fade: { en: "Fade", ru: "Фейд", uz: "Feyd" },
  beard: { en: "Beard", ru: "Борода", uz: "Soqol" },
  classic: { en: "Classic", ru: "Классика", uz: "Klassik" },
  modern: { en: "Modern", ru: "Модерн", uz: "Zamonaviy" },
  skinFade: { en: "Skin Fade", ru: "Скин Фейд", uz: "Skin Feyd" },
  texturedCrop: { en: "Textured Crop", ru: "Текстурная стрижка", uz: "Tekstürali kesim" },
  buzzCut: { en: "Buzz Cut", ru: "Стрижка бокс", uz: "Mashinka bilan olish" },
  hotTowel: { en: "Hot Towel", ru: "Горячее полотенце", uz: "Issiq sochiq" },
  hairDesign: { en: "Hair Design", ru: "Дизайн стрижки", uz: "Soch dizayni" },
  kidsCut: { en: "Kids Cut", ru: "Детская стрижка", uz: "Bolalar kesimi" },
};

/* Names for every line item on the real price board, keyed the same way skillLabels are */
const priceItemLabels = {
  mensCut: { en: "Men's Haircut", ru: "Мужская стрижка", uz: "Erkaklar soch olish" },
  kidsHaircut: { en: "Kids' Haircut (up to 10 y.o.)", ru: "Детская стрижка (до 10 лет)", uz: "Bolalar soch olish (10 yoshgacha)" },
  longCut: { en: "Long Haircut", ru: "Удлиненная стрижка", uz: "Uzun soch olish" },
  guardCut: { en: "Single Guard Clipper Cut", ru: "Стрижка под одну насадку", uz: "Bitta nasadka bilan olish" },
  beardShave: { en: "Beard Shaping & Shave", ru: "Моделирование бороды и бритьё", uz: "Soqolni shakllantirish va olish" },
  grayCoverage: { en: "Gray Hair Coverage", ru: "Камуфляж седины", uz: "Oqargan sochni tuslash" },
  facialCare: { en: "Facial Skin Care", ru: "Уход за кожей лица", uz: "Yuz terisiga parvarish" },
  waxRemoval: { en: "Wax Hair Removal", ru: "Удаление лишних волос воском", uz: "Mumli epilyatsiya" },
  scalpCare: { en: "Scalp Care", ru: "Уход за кожей головы", uz: "Bosh terisiga parvarish" },
  fatherSon: { en: "Father + Son", ru: "Отец + Сын", uz: "Ota + O'g'il" },
  fatherComboSon: { en: "Father (Cut + Beard) + Son", ru: "Отец (Стрижка + борода) + Сын", uz: "Ota (Soch + Soqol) + O'g'il" },
  cutBeardCombo: { en: "Haircut + Beard Shaping", ru: "Стрижка + моделирование бороды", uz: "Soch olish + Soqol shakllantirish" },
  hairPerm: { en: "Chemical + Bio Hair Perm", ru: "Хим + Био завивка волос", uz: "Kimyoviy + Bio jingalak qilish" },
  hairCreatine: { en: "Hair Creatine Treatment", ru: "Креатин для волос", uz: "Soch uchun kreatin" },
};

/* ============================================================================
   ANIMATION VARIANTS — reused across every section (no duplicated tweens)
   ========================================================================= */
const EASE = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 46 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};
const fadeLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.85, ease: EASE } },
};
const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.85, ease: EASE } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE } },
};
const staggerContainer = (staggerChildren = 0.12, delayChildren = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

/* ============================================================================
   DATA — barbers, prices, gallery, nav & language options
   ========================================================================= */
const barbersData = [
  {
    id: 1,
    name: "Jamshid",
    photo: "https://i.postimg.cc/Bvdg74Nh/IMG-2378.avif",
    position: { en: "Master Barber & Founder", ru: "Мастер-барбер и основатель", uz: "Usta barber va asoschisi" },
    experience: 12,
    rating: 5.0,
    languages: ["", "RU", "UZ"],
  
    telegram: "aziz_barber",
    instagram: "aziz.barber",
    skills: ["fade", "beard", "classic", "hotTowel", "hairDesign"],
    description: {
      en: "The visionary behind DABRO Barbershop — Aziz blends classic barbering traditions with modern precision, and his steady hand has made his name synonymous with excellence.",
      ru: "Визионер, стоящий за DABRO Barbershop. Азиз сочетает классические традиции барберинга с современной точностью — его твёрдая рука сделала его имя синонимом совершенства.",
      uz: "DABRO Barbershop ortidagi g'oya muallifi. Aziz klassik an'analarni zamonaviy aniqlik bilan uyg'unlashtiradi — uning ishonchli qo'li uni mukammallik timsoliga aylantirdi.",
    },
  },
  {
    id: 2,
    name: "Sherzod",
    photo: "https://i.postimg.cc/CKV5c2kK/IMG-2385.avif",
    position: { en: "Senior Barber", ru: "Старший барбер", uz: "Katta barber" },
    experience: 8,
    rating: 4.9,
    languages: ["UZ", "RU"],
    telegram: "david_barber",
    instagram: "david.barber",
    skills: ["skinFade", "texturedCrop", "modern", "buzzCut"],
    description: {
      en: "David's specialty is contemporary fades and textured styles. Trained in London, he brings an international edge to every single cut.",
      ru: "Специализация Дэвида — современные фейды и текстурные стрижки. Обучался в Лондоне, привносит международный подход в каждую стрижку.",
      uz: "Devidning mutaxassisligi — zamonaviy feydlar va tekstürali turmaklar. Londonda ta'lim olgan, har bir ishga xalqaro yondashuvni olib keladi.",
    },
  },
  {
    id: 3,
    name: "Sarvar",
    photo: "",
    position: { en: "Beard Specialist", ru: "Специалист по бороде", uz: "Soqol bo'yicha mutaxassis" },
    experience: 6,
    rating: 4.8,
    languages: ["", "UZ"],
    telegram: "rustam_barber",
    instagram: "rustam.barber",
    skills: ["beard", "hotTowel", "classic"],
    description: {
      en: "A true artisan of facial hair, Rustam sculpts beards with surgical precision, blending traditional straight-razor technique with modern shaping.",
      ru: "Настоящий мастер по уходу за бородой, Рустам придаёт форму с ювелирной точностью, сочетая классическую технику опасной бритвы с современным моделированием.",
      uz: "Soqolga ishlov berishning haqiqiy ustasi Rustam an'anaviy ustara texnikasini zamonaviy shakllantirish bilan birlashtirib, yuqori aniqlikda ishlaydi.",
    },
  },
  {
    id: 4,
    name: "Kamron",
    photo: "https://i.postimg.cc/tCVc9vnx/IMG-2372.avif",
    position: { en: "Style Consultant", ru: "Стилист-консультант", uz: "Uslub bo'yicha maslahatchi" },
    experience: 5,
    rating: 4.7,
    languages: ["", "UZ"],
    phone: "+998 94 456 78 90",
    telegram: "jasur_barber",
    instagram: "jasur.barber",
    skills: ["modern", "texturedCrop", "kidsCut", "fade"],
    description: {
      en: "Jasur has an intuitive sense for modern trends, helping every client discover a look that matches their personality perfectly.",
      ru: "У Джасура интуитивное чувство современных трендов — он помогает клиентам подобрать образ, идеально отражающий их индивидуальность.",
      uz: "Jasur zamonaviy trendlarni chuqur his qiladi va mijozlarga o'z shaxsiyatiga mos ko'rinishni topishda yordam beradi.",
    },
  },
];

const priceGroups = [
  {
    id: "haircuts",
    icon: IconScissors,
    items: [
      { key: "mensCut", price: 100000 },
      { key: "kidsHaircut", price: 70000 },
      { key: "longCut", price: 130000 },
      { key: "guardCut", price: 50000 },
      { key: "beardShave", price: 70000 },
    ],
  },
  {
    id: "extras",
    icon: IconBottle,
    items: [
      { key: "grayCoverage", price: 50000 },
      { key: "facialCare", price: 50000 },
      { key: "waxRemoval", price: 50000 },
      { key: "scalpCare", price: 50000 },
    ],
  },
  {
    id: "promo",
    icon: IconStar,
    featured: true,
    items: [
      { key: "fatherSon", price: 140000 },
      { key: "fatherComboSon", price: 180000 },
      { key: "cutBeardCombo", price: 130000 },
    ],
  },
  {
    id: "treatments",
    icon: IconFlask,
    items: [
      { key: "hairPerm", price: 500000 },
      { key: "hairCreatine", price: 400000 },
    ],
  },
];

const languageOptions = [
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
  { code: "uz", label: "UZ" },
];

const navLinks = [
  { id: "home", key: "home" },
  { id: "about", key: "about" },
  { id: "barbers", key: "barbers" },
  { id: "prices", key: "prices" },
  { id: "gallery", key: "gallery" },
  { id: "contact", key: "contact" },
];

const shopContact = {
  phone: "+998 77 960 66 64",
  telegram: "dabrobarbershop",
  instagram: "dabrobarbershop",
  mapsUrl: "https://maps.app.goo.gl/UHqvJfRG2E13WWRi9?g_st=ic",
};

/* ============================================================================
   GLOBAL STYLES — fonts, scrollbar, selection colour, dark map filter
   ========================================================================= */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;0,900;1,500&family=Inter:wght@300;400;500;600;700;800&display=swap');
    :root {
      --bg: #060606;
      --surface: #100d0a;
      --surface-strong: #17120e;
      --text: #f8f1e6;
      --muted: #b7aa91;
      --accent: #d4b06a;
      --accent-strong: #ecd4a5;
      --accent-soft: #7a5527;
      --border: rgba(212, 176, 106, 0.22);
      --shadow: 0 25px 80px rgba(0, 0, 0, 0.45);
    }
    html { scroll-behavior: smooth; background: var(--bg); }
    .font-display { font-family: 'Playfair Display', serif; }
    .font-body { font-family: 'Inter', sans-serif; }
    ::selection { background: var(--accent); color: #000000; }
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, var(--accent) 0%, #8a6432 100%); border-radius: 999px; }
    ::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, var(--accent-strong) 0%, var(--accent) 100%); }
    * { scrollbar-width: thin; scrollbar-color: var(--accent) var(--bg); }
    .map-dark { filter: invert(92%) hue-rotate(180deg) brightness(0.95) contrast(1.05); }
    .luxury-ring {
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08), 0 0 0 1px rgba(212,176,106,0.14);
    }
    .gold-line {
      background: linear-gradient(90deg, transparent 0%, rgba(212,176,106,0.8) 50%, transparent 100%);
    }
    .chrome-text {
      background-image: linear-gradient(180deg, #fbfbfb 0%, #cfcfcf 20%, #6b6b6b 40%, #f7f7f7 52%, #9a9a9a 68%, #eaeaea 82%, #707070 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
      text-shadow: 0 1px 1px rgba(0,0,0,0.35);
    }
  `}</style>
);

/* ============================================================================
   SMALL REUSABLE PIECES
   ========================================================================= */

/* Section eyebrow + heading + subtitle, centred, staggered on scroll */
const SectionHeading = ({ kicker, title, subtitle }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.4 }}
    variants={staggerContainer(0.15)}
    className="max-w-2xl mx-auto text-center mb-14 md:mb-20"
  >
    <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-5">
      <span className="h-px w-10 gold-line" />
      <span className="text-[11px] md:text-sm tracking-[0.35em] uppercase text-[#d1b06b] font-semibold">{kicker}</span>
      <span className="h-px w-10 gold-line" />
    </motion.div>
    <motion.h2 variants={fadeUp} className="font-display text-4xl md:text-6xl font-bold leading-[1.05] mb-5 text-white">
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p variants={fadeUp} className="text-[#a79c8c] text-base md:text-lg leading-relaxed">
        {subtitle}
      </motion.p>
    )}
  </motion.div>
);

/* Animated count-up number, triggers once when scrolled into view */
const Counter = ({ to, suffix = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1800;
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * to));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, to]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

/* Five-star rating row with numeric score */
const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((i) => (
      <IconStar key={i} className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? "text-white" : "text-white/20"}`} />
    ))}
    <span className="text-xs text-neutral-400 ml-1.5">{rating.toFixed(1)}</span>
  </div>
);

/* Animated skill pill used inside barber cards */
const SkillBadge = ({ skillKey, lang }) => (
  <motion.span
    variants={fadeUp}
    whileHover={{ scale: 1.08, borderColor: "rgba(255,255,255,0.55)" }}
    className="px-3 py-1.5 rounded-full border border-white/15 bg-white/5 text-[11px] md:text-xs text-neutral-300 tracking-wide transition-colors"
  >
    {skillLabels[skillKey][lang]}
  </motion.span>
);

/* EN / RU / UZ pill switch with a sliding highlight */
const LanguageSwitcher = ({ lang, setLang }) => (
  <div className="relative flex items-center bg-white/5 border border-white/10 rounded-full p-1">
    {languageOptions.map((opt) => (
      <button
        key={opt.code}
        onClick={() => setLang(opt.code)}
        aria-label={`Switch to ${opt.label}`}
        className="relative px-2.5 py-1.5 text-[11px] font-semibold tracking-wide rounded-full"
      >
        {lang === opt.code && (
          <motion.span
            layoutId="langPill"
            className="absolute inset-0 bg-white rounded-full"
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
          />
        )}
        <span className={`relative z-10 ${lang === opt.code ? "text-black" : "text-neutral-400"}`}>{opt.label}</span>
      </button>
    ))}
  </div>
);

/* Contact icon button — small circular link used across cards, contact & footer */
const IconLink = ({ href, label, children }) => (
  <a
    href={href}
    target={href?.startsWith("http") ? "_blank" : undefined}
    rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    aria-label={label}
    className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#16120f] border border-[#c9a96f]/20 flex items-center justify-center text-[#e8d6a4] hover:bg-[#c9a96f] hover:text-black hover:border-[#c9a96f] transition-all duration-300"
  >
    {children}
  </a>
);

const FloatingContactButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-[60]">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="mb-3 w-[270px] rounded-2xl border border-[#c9a96f]/20 bg-[#0f0d0b]/95 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-md"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#d1b06b]">Call us</p>
                <p className="font-display text-lg text-white">DABRO BARBERSHOP</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-[#a79c8c]">✕</button>
            </div>
            <a href={`tel:${shopContact.phone.replace(/\s/g, "")}`} className="mb-2 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-[#f4ebdb]">
              <IconPhone className="w-4 h-4 text-[#d1b06b]" />
              <span>{shopContact.phone}</span>
            </a>
            <div className="flex items-center gap-2">
              <IconLink href={`https://t.me/${shopContact.telegram}`} label="Telegram">
                <IconTelegram className="w-4 h-4" />
              </IconLink>
              <IconLink href={`https://instagram.com/${shopContact.instagram}`} label="Instagram">
                <IconInstagram className="w-4 h-4" />
              </IconLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-[#c9a96f]/25 bg-[#0f0d0b] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_35px_rgba(201,169,111,0.2)]"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c9a96f] text-black">
          <IconPhone className="w-4 h-4" />
        </span>
        <span>Call now</span>
      </motion.button>
    </div>
  );
};

/* Premium barber profile card */
const BarberCard = ({ barber, lang, t }) => (
  <motion.div
    variants={fadeUp}
    whileHover={{ y: -10 }}
    transition={{ duration: 0.4, ease: EASE }}
    className="group relative overflow-hidden rounded-[28px] border border-[#d4b06a]/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.035)_0%,rgba(212,176,106,0.10)_100%)] shadow-[0_20px_60px_rgba(0,0,0,0.32)] transition-all duration-500 hover:-translate-y-2 hover:border-[#d4b06a]/35 hover:shadow-[0_30px_80px_rgba(212,176,106,0.16)]"
  >
    {/* Photo + name overlay */}
    <div className="relative aspect-[4/3] overflow-hidden">
      {barber.photo ? (
        <img
          src={barber.photo}
          alt={barber.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        // barber.photo bo'sh bo'lsa (masalan hali rasm yuklanmagan bo'lsa), buzilgan
        // <img> o'rniga chiroyli, brendga mos placeholder ko'rsatiladi.
        <div className="w-full h-full flex items-center justify-center bg-[linear-gradient(135deg,#1c1712_0%,#2a2118_100%)]">
          <span className="font-display text-6xl font-bold text-[#d4b06a]/35">
            {barber.name.charAt(0)}
          </span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
      <div className="absolute bottom-4 left-5 right-5">
        <h3 className="font-display text-xl md:text-2xl font-bold text-white">{barber.name}</h3>
        <p className="text-xs md:text-sm text-neutral-300 tracking-wide">{barber.position[lang]}</p>
      </div>
    </div>

    {/* Details */}
    <div className="p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <StarRating rating={barber.rating} />
        <span className="text-xs text-neutral-500">
          {barber.experience} {t.barbers.years} · {t.barbers.experience}
        </span>
      </div>

      <p className="text-sm text-neutral-400 leading-relaxed mb-5">{barber.description[lang]}</p>

      <div className="mb-5">
        <div className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-2">{t.barbers.skills}</div>
        <motion.div
          variants={staggerContainer(0.06)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap gap-2"
        >
          {barber.skills.map((skill) => (
            <SkillBadge key={skill} skillKey={skill} lang={lang} />
          ))}
        </motion.div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center gap-1.5" title={t.barbers.languages}>
          {barber.languages.map((code) => (
            <span key={code} className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#c9a96f]/10 text-[#e8d6a4] border border-[#c9a96f]/20">
              {code}
            </span>
          ))}
        </div>
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#9d8d70]">Booked</span>
      </div>
    </div>
  </motion.div>
);

/* Single line item — name, dotted leader, price (mirrors the printed price board) */
/* One service, one small card — icon, name, chrome price (matches the card style shown in the reference screenshot) */
const ServicePriceCard = ({ labelKey, price, icon: Icon, lang }) => (
  <motion.div
    variants={fadeUp}
    whileHover={{ y: -8, borderColor: "rgba(255,255,255,0.3)" }}
    transition={{ duration: 0.4, ease: EASE }}
    className="rounded-[24px] border border-[#d4b06a]/15 bg-[linear-gradient(135deg,rgba(255,255,255,0.035)_0%,rgba(212,176,106,0.08)_100%)] p-6 md:p-7 shadow-[0_16px_40px_rgba(0,0,0,0.22)]"
  >
    <Icon className="w-7 h-7 mb-5 text-white" strokeWidth={1.2} />
    <h3 className="font-display text-lg md:text-xl font-bold mb-4 text-white">{priceItemLabels[labelKey][lang]}</h3>
    <div className="flex items-baseline gap-1.5">
      <span className="chrome-text text-2xl md:text-3xl font-bold font-display">{price.toLocaleString()}</span>
      <span className="text-xs text-neutral-500 font-medium">UZS</span>
    </div>
  </motion.div>
);

/* Featured gold card — the 3 real "Акция до 20%" combo offers, replacing the old fake feature checklist */
const PromoCard = ({ t, lang }) => {
  const promoGroup = priceGroups.find((g) => g.id === "promo");

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="relative overflow-hidden rounded-[28px] border border-[#e8cf9e]/35 bg-[linear-gradient(135deg,#f8edc9_0%,#d4b06a_50%,#83572b_100%)] p-8 text-[#140f08] md:p-12 shadow-[0_20px_70px_rgba(212,176,106,0.2)]"
    >
      <span className="absolute top-6 right-6 md:top-8 md:right-8 bg-black text-white text-[10px] md:text-xs font-semibold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full">
        {t.common.popular}
      </span>
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div>
          <IconStar className="w-9 h-9 mb-5" strokeWidth={1.2} />
          <h3 className="font-display text-3xl md:text-4xl font-bold mb-7">{t.prices.groups.promo}</h3>
          <motion.a
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollToId("contact"); }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="inline-block bg-black text-white px-7 py-3.5 rounded-full text-sm font-semibold tracking-wide"
          >
            {t.common.bookNow}
          </motion.a>
        </div>
        <ul className="space-y-4">
          {promoGroup.items.map((item) => (
            <li key={item.key} className="flex items-baseline justify-between gap-4 text-sm md:text-base text-neutral-800">
              <span>{priceItemLabels[item.key][lang]}</span>
              <span className="font-bold whitespace-nowrap">
                {item.price.toLocaleString()} <span className="text-xs font-normal text-neutral-600">UZS</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

/* ============================================================================
   1. INTRO LOADING ANIMATION
   ========================================================================= */
const LoadingScreen = () => (
  <motion.div
    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0, scale: 1.04 }}
    transition={{ duration: 0.9, ease: EASE }}
  >
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer(0.22, 0.1)}
      className="flex flex-col items-center"
    >
      <motion.div variants={scaleIn}>
        <IconScissors className="w-9 h-9 md:w-10 md:h-10 mb-5 text-white" strokeWidth={1} />
      </motion.div>
      <motion.h1 variants={fadeUp} className="font-display text-3xl md:text-5xl tracking-[0.2em] font-semibold text-white">
        DABRO
      </motion.h1>
      <motion.p variants={fadeUp} className="text-[10px] md:text-xs tracking-[0.35em] text-[#d1b06b] mt-2 uppercase">
        Barbershop
      </motion.p>
    </motion.div>
    <div className="absolute bottom-16 w-40 md:w-56 h-px bg-white/10 overflow-hidden rounded-full">
      <motion.div
        className="h-full bg-white"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 1.7, ease: "easeInOut" }}
      />
    </div>
  </motion.div>
);

/* ============================================================================
   NAVIGATION — sticky, transparent → blurred on scroll
   ========================================================================= */
const Navbar = ({ lang, setLang, t }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // { passive: true } + requestAnimationFrame throttling: brauzer scroll'ni
    // darhol boshlaydi, handler esa freym tezligidan tez-tez ishlamaydi — bu
    // ayniqsa telefonda scroll paytidagi "qotish"ni kamaytiradi.
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (id) => {
    setMenuOpen(false);
    scrollToId(id);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? "bg-[#060606]/90 backdrop-blur-md border-b border-[#d4b06a]/15 py-3 md:py-4 shadow-[0_10px_40px_rgba(0,0,0,0.2)]" : "bg-transparent py-5 md:py-7"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between">
        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); handleNavClick("home"); }}
          className="flex items-center gap-2 group"
        >
          <IconScissors className="w-5 h-5 md:w-6 md:h-6 text-white transition-transform duration-500 group-hover:rotate-45" strokeWidth={1.3} />
          <span className="font-display text-lg md:text-xl tracking-[0.1em] font-semibold text-white">DABRO</span>
        </a>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-9">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => { e.preventDefault(); handleNavClick(link.id); }}
              className="group relative text-sm tracking-wide text-neutral-300 hover:text-white transition-colors duration-300"
            >
              {t.nav[link.key]}
              <span className="absolute left-0 -bottom-1.5 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <LanguageSwitcher lang={lang} setLang={setLang} />
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleNavClick("contact")}
            className="hidden md:inline-flex items-center bg-[linear-gradient(135deg,#f3e4b8_0%,#d4b06a_100%)] text-[#140f08] text-xs font-semibold tracking-[0.2em] uppercase px-5 py-2.5 rounded-full shadow-[0_10px_30px_rgba(212,176,106,0.22)] hover:brightness-110 transition-all duration-300"
          >
            {t.common.bookAppointment}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, borderColor: "rgba(212,176,106,0.55)" }}
            whileTap={{ scale: 0.94 }}
            className="lg:hidden w-10 h-10 rounded-full bg-[#16120f] border border-[#c9a96f]/20 flex items-center justify-center text-white transition-colors duration-300"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <IconClose className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
          </motion.button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="lg:hidden overflow-hidden bg-black/95 backdrop-blur-md border-t border-white/10"
          >
            <div className="flex flex-col px-6 py-6 gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.id); }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="py-3 text-lg text-neutral-200 border-b border-white/5 last:border-none"
                >
                  {t.nav[link.key]}
                </motion.a>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.06, duration: 0.4 }}
                onClick={() => handleNavClick("contact")}
                className="mt-5 bg-[linear-gradient(135deg,#f3e4b8_0%,#d4b06a_100%)] text-[#140f08] text-sm font-semibold tracking-[0.2em] uppercase px-5 py-3 rounded-full shadow-[0_10px_30px_rgba(212,176,106,0.22)]"
              >
                {t.common.bookAppointment}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

/* ============================================================================
   2. HERO — fullscreen video background, parallax, staggered title reveal
   ========================================================================= */
const Hero = ({ t }) => {
  const ref = useRef(null);
  const simplified = useSimplifiedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Telefonda / reduced-motion'da video "scale" qilinmaydi va parallaks siljishi
  // o'chiriladi — bular shu sahifadagi eng GPU-talab qiluvchi effekt bo'lib,
  // scroll paytida qotishning asosiy sababchisi edi. Fade-in (opacity) esa arzon
  // bo'lgani uchun hamma joyda saqlanadi.
  const bgY = useTransform(scrollYProgress, [0, 1], simplified ? ["0%", "0%"] : ["0%", "25%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], simplified ? [1, 1] : [1, 1.2]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], simplified ? ["0%", "0%"] : ["0%", "35%"]);

  const titleWords = t.hero.title.split(" ");

  return (
    <section id="home" ref={ref} className="relative h-screen w-full overflow-hidden bg-[#060606]">
      {/* Parallax background video */}
      <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0">
        <video
          className="w-full h-full object-cover grayscale-[20%] brightness-[0.7]"
          autoPlay
          muted
          loop
          playsInline
          poster={MEDIA.heroPoster}
        >
          <source src={MEDIA.heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,6,6,0.15)_0%,rgba(6,6,6,0.4)_35%,rgba(6,6,6,0.75)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,176,106,0.18),_transparent_38%)]" />
      </motion.div>

      {/* Foreground content */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="h-px w-8 bg-white/40" />
          <span className="text-xs md:text-sm tracking-[0.35em] uppercase text-neutral-300">Tashkent</span>
          <span className="h-px w-8 bg-white/40" />
        </motion.div>

        <h1 className="font-display text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-white leading-[0.95] mb-6 flex flex-wrap justify-center gap-x-4 md:gap-x-6">
          {titleWords.map((word, i) => (
            <motion.span
              key={word + i}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 + i * 0.12, ease: EASE }}
              className="inline-block"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-base md:text-xl text-neutral-300 tracking-wide mb-10 max-w-xl"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => scrollToId("contact")}
            className="group relative overflow-hidden bg-[linear-gradient(135deg,#f3e4b8_0%,#d4b06a_100%)] text-[#140f08] px-8 py-4 rounded-full font-semibold text-sm tracking-[0.2em] uppercase inline-flex items-center gap-2 shadow-[0_12px_40px_rgba(212,176,106,0.24)]"
          >
            {t.common.bookAppointment}
            <IconArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
            whileTap={{ scale: 0.96 }}
            onClick={() => scrollToId("barbers")}
            className="border border-[#f3e4b8]/40 text-[#f8f1e6] bg-white/5 backdrop-blur-md px-8 py-4 rounded-full font-semibold text-sm tracking-[0.2em] uppercase"
          >
            {t.common.viewBarbers}
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400">{t.common.scroll}</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
          <IconChevronDown className="w-4 h-4 text-neutral-400" />
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ============================================================================
   3. ABOUT — copy on the left (fade-left), image on the right (fade-right)
   ========================================================================= */
const About = ({ t }) => {
  // DABRO Barbershop 2022 yilda ochilgan — shu yildan hisoblab, "faoliyat yillari"
  // sonini har doim to'g'ri (avtomatik) ko'rsatish uchun.
  const yearsActive = new Date().getFullYear() - 2022;
  const stats = [
    { value: yearsActive, suffix: "+", label: t.about.stat1 },
    { value: 8500, suffix: "+", label: t.about.stat2 },
    { value: 15, suffix: "", label: t.about.stat3 },
  ];

  return (
    <section id="about" className="relative py-24 md:py-36 px-6 md:px-10 overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(212,176,106,0.12),_transparent_32%),#060606]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 md:gap-20 items-center">
        {/* Text column */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer(0.15)}
        >
          <motion.div variants={fadeLeft} className="flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-white/30" />
            <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-neutral-400 font-medium">{t.about.kicker}</span>
          </motion.div>
          <motion.h2 variants={fadeLeft} className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] mb-6">
            {t.about.title}
          </motion.h2>
          <motion.p variants={fadeLeft} className="text-neutral-400 text-base md:text-lg leading-relaxed mb-12">
            {t.about.text}
          </motion.p>

          <motion.div variants={fadeLeft} className="grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="font-display text-3xl md:text-4xl font-bold text-white mb-1">
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="text-xs md:text-sm text-neutral-500 leading-snug">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Image column */}
        <motion.div
          variants={fadeRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="relative aspect-[4/5] rounded-3xl overflow-hidden group"
        >
          <img
            src={MEDIA.about}
            alt="Inside DABRO Barbershop"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl" />
          <div className="absolute -bottom-6 -left-6 bg-[linear-gradient(135deg,#f7ebcc_0%,#d4b06a_100%)] text-[#140f08] rounded-2xl px-6 py-5 shadow-[0_20px_60px_rgba(212,176,106,0.2)] hidden md:block">
            <div className="font-display text-2xl font-bold">{yearsActive}+</div>
            <div className="text-xs text-neutral-600 tracking-wide">{t.about.stat1}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ============================================================================
   4. GALLERY — responsive bento grid with hover zoom + caption reveal
   ========================================================================= */
const Gallery = ({ t }) => (
  <section id="gallery" className="relative py-24 md:py-36 px-6 md:px-10 bg-[#060606]">
    <div className="max-w-7xl mx-auto">
      <SectionHeading kicker={t.gallery.kicker} title={t.gallery.title} subtitle={t.gallery.subtitle} />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer(0.08)}
        className="grid grid-cols-2 md:grid-cols-4 auto-rows-[140px] sm:auto-rows-[160px] md:auto-rows-[190px] gap-3 md:gap-4 grid-flow-row-dense"
      >
        {galleryData.map((item) => (
          <motion.div
            key={item.id}
            variants={scaleIn}
            className={`relative rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer border border-[#d4b06a]/15 bg-[#100d0a] shadow-[0_16px_50px_rgba(0,0,0,0.25)] ${item.span}`}
          >
            <img
              src={item.url}
              alt={t.gallery.categories[item.category]}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 p-4 md:p-5 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <span className="text-white text-xs md:text-sm tracking-[0.2em] uppercase font-medium">
                {t.gallery.categories[item.category]}
              </span>
            </div>
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl md:rounded-3xl pointer-events-none" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ============================================================================
   5. VIDEO SECTION — autoplay/muted/loop promo reel with unmute control
   ========================================================================= */
const VideoSection = ({ t }) => {
  const [muted, setMuted] = useState(true);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  // Video shu bo'lim ko'rinishga ~200px qolganda yuklana boshlaydi — sahifa birinchi
  // ochilganda 2 ta video bir vaqtda yuklanib, telefonni "qotirib" qo'ymasligi uchun.
  const isNearView = useInView(wrapperRef, { once: true, margin: "200px" });
  const showVideo = isNearView && !videoFailed;

  const toggleMute = () => {
    setMuted((m) => !m);
    if (videoRef.current) videoRef.current.muted = !muted;
  };

  return (
    <section className="relative py-24 md:py-36 px-6 md:px-10 bg-[radial-gradient(circle_at_top,_rgba(212,176,106,0.08),_transparent_35%),#060606]">
      <div className="max-w-6xl mx-auto">
        <SectionHeading kicker={t.video.kicker} title={t.video.title} subtitle={t.video.subtitle} />

        <motion.div
          ref={wrapperRef}
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative aspect-video rounded-[30px] overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.35)] border border-[#d4b06a]/20 bg-[#100d0a]"
        >
          {showVideo ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted={muted}
              loop
              playsInline
              preload="metadata"
              poster={MEDIA.about}
              onError={() => setVideoFailed(true)}
            >
              <source src={MEDIA.promoVideo} type="video/mp4" />
            </video>
          ) : (
            // Video hali ko'rinishga kelmagan, yoki havolasi ishlamasa (masalan hozirgi
            // .avif bug holatida) — shu yerda oddiy rasm ko'rsatiladi, ekran bo'sh yoki
            // "buzilgan" ko'rinmasligi uchun.
            <img
              src={MEDIA.about}
              alt={t.video.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          {showVideo && (
            <button
              onClick={toggleMute}
              aria-label="Toggle sound"
              className="absolute bottom-5 right-5 w-11 h-11 rounded-full bg-[#0f0d09]/70 backdrop-blur-md border border-[#d4b06a]/25 flex items-center justify-center text-[#f8f1e6] hover:bg-[#d4b06a] hover:text-[#140f08] transition-colors duration-300"
            >
              {muted ? <IconVolumeOff className="w-5 h-5" /> : <IconVolumeOn className="w-5 h-5" />}
            </button>
          )}
        </motion.div>
      </div>
    </section>
  );
};

/* ============================================================================
   6. OUR BARBERS
   ========================================================================= */
const Barbers = ({ t, lang }) => (
  <section id="barbers" className="relative py-24 md:py-36 px-6 md:px-10 bg-[#060606]">
    <div className="max-w-6xl mx-auto">
      <SectionHeading kicker={t.barbers.kicker} title={t.barbers.title} subtitle={t.barbers.subtitle} />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer(0.15)}
        className="grid sm:grid-cols-2 gap-6 md:gap-8"
      >
        {barbersData.map((barber) => (
          <BarberCard key={barber.id} barber={barber} lang={lang} t={t} />
        ))}
      </motion.div>
    </div>
  </section>
);

/* ============================================================================
   7. PRICE LIST
   ========================================================================= */
const PriceList = ({ t, lang }) => {
  const cardGroups = priceGroups.filter((g) => g.id !== "promo");

  return (
    <section id="prices" className="relative bg-black py-24 md:py-36 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <SectionHeading kicker={t.prices.kicker} title={t.prices.title} subtitle={t.prices.subtitle} />

        <div className="space-y-14 md:space-y-16">
          {cardGroups.map((group) => (
            <div key={group.id}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="flex items-center gap-3 mb-6"
              >
                <span className="h-px w-8 gold-line" />
                <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-[#d1b06b] font-semibold">
                  {t.prices.groups[group.id]}
                </span>
              </motion.div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={staggerContainer(0.1)}
                className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
              >
                {group.items.map((item) => (
                  <ServicePriceCard key={item.key} labelKey={item.key} price={item.price} icon={group.icon} lang={lang} />
                ))}
              </motion.div>
            </div>
          ))}

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp}>
            <PromoCard t={t} lang={lang} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ============================================================================
   8. CONTACT — info (fade-left), map (fade-right)
   ========================================================================= */
const Contact = ({ t }) => (
  <section id="contact" className="relative py-24 md:py-36 px-6 md:px-10 bg-[radial-gradient(circle_at_top_right,_rgba(212,176,106,0.12),_transparent_28%),#060606]">
    <div className="max-w-6xl mx-auto">
      <SectionHeading kicker={t.contact.kicker} title={t.contact.title} subtitle={t.contact.subtitle} />

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer(0.12)}
          className="space-y-4"
        >
          {[
            { icon: IconPin, label: t.contact.address, value: t.contact.addressValue, href: shopContact.mapsUrl },
            { icon: IconClock, label: t.contact.hours, value: t.contact.hoursValue },
            { icon: IconPhone, label: t.contact.phone, value: shopContact.phone, href: `tel:${shopContact.phone.replace(/\s/g, "")}` },
          ].map((row, i) => {
            const Wrapper = row.href ? motion.a : motion.div;
            return (
              <Wrapper
                key={i}
                variants={fadeLeft}
                {...(row.href ? { href: row.href, target: row.href.startsWith("http") ? "_blank" : undefined, rel: row.href.startsWith("http") ? "noopener noreferrer" : undefined } : {})}
                className={`flex items-start gap-4 bg-white/[0.03] border border-[#d4b06a]/15 rounded-2xl p-5 backdrop-blur-sm ${row.href ? "hover:border-[#d4b06a]/35 transition-colors duration-300" : ""}`}
              >
                <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <row.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-1">{row.label}</div>
                  <div className="text-sm md:text-base text-neutral-200">{row.value}</div>
                </div>
              </Wrapper>
            );
          })}

          <motion.div variants={fadeLeft} className="flex items-center gap-3 pt-2">
            <IconLink href={`https://t.me/${shopContact.telegram}`} label="Telegram">
              <IconTelegram className="w-5 h-5" />
            </IconLink>
            <IconLink href={`https://instagram.com/${shopContact.instagram}`} label="Instagram">
              <IconInstagram className="w-5 h-5" />
            </IconLink>
          </motion.div>

          <motion.a
            variants={fadeLeft}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href={`tel:${shopContact.phone.replace(/\s/g, "")}`}
            className="inline-block w-full sm:w-auto text-center bg-[linear-gradient(135deg,#f3e4b8_0%,#d4b06a_100%)] text-[#140f08] px-8 py-4 rounded-full font-semibold text-sm tracking-[0.2em] uppercase mt-2 shadow-[0_10px_30px_rgba(212,176,106,0.24)]"
          >
            {t.common.bookAppointment}
          </motion.a>
        </motion.div>

        <motion.a
          href={shopContact.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          variants={fadeRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          whileHover={{ scale: 1.01 }}
          className="group relative flex flex-col items-center justify-center gap-5 text-center p-10 rounded-[30px] overflow-hidden border border-[#d4b06a]/20 min-h-[320px] shadow-[0_20px_70px_rgba(0,0,0,0.3)] bg-[radial-gradient(circle_at_center,_rgba(212,176,106,0.14),_transparent_60%),#0c0a08]"
        >
          <div className="w-16 h-16 rounded-full bg-white/5 border border-[#d4b06a]/25 flex items-center justify-center text-[#e8d6a4] group-hover:bg-[#c9a96f] group-hover:text-black transition-colors duration-300">
            <IconPin className="w-7 h-7" />
          </div>
          <div>
            <p className="font-display text-xl md:text-2xl font-bold text-white mb-1">DABRO BARBERSHOP</p>
            <p className="text-sm text-neutral-400">Tashkent, Uzbekistan</p>
          </div>
          <span className="inline-flex items-center gap-2 bg-[linear-gradient(135deg,#f3e4b8_0%,#d4b06a_100%)] text-[#140f08] px-6 py-3 rounded-full text-xs font-semibold tracking-[0.2em] uppercase">
            {t.contact.mapCta}
            <IconArrowRight className="w-3.5 h-3.5" />
          </span>
        </motion.a>
      </div>
    </div>
  </section>
);

/* ============================================================================
   9. FOOTER — minimal, social icons, copyright
   ========================================================================= */
const Footer = ({ t }) => (
  <footer className="relative border-t border-[#d4b06a]/15 pt-16 pb-8 px-6 md:px-10 bg-[#060606]">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-white/10">
        <div className="flex flex-col items-center md:items-start gap-3">
          <div className="flex items-center gap-2">
            <IconScissors className="w-5 h-5 text-white" strokeWidth={1.3} />
            <span className="font-display text-xl tracking-[0.1em] font-semibold text-white">DABRO</span>
          </div>
          <p className="text-sm text-neutral-500">{t.footer.tagline}</p>
        </div>

        <div className="flex items-center gap-3">
          <IconLink href={`tel:${shopContact.phone.replace(/\s/g, "")}`} label="Phone">
            <IconPhone className="w-4 h-4" />
          </IconLink>
          <IconLink href={`https://t.me/${shopContact.telegram}`} label="Telegram">
            <IconTelegram className="w-4 h-4" />
          </IconLink>
          <IconLink href={`https://instagram.com/${shopContact.instagram}`} label="Instagram">
            <IconInstagram className="w-4 h-4" />
          </IconLink>
        </div>

        <button
          onClick={() => scrollToId("home")}
          aria-label="Back to top"
          className="w-10 h-10 rounded-full border border-[#d4b06a]/20 flex items-center justify-center text-[#f8f1e6] hover:bg-[#d4b06a] hover:text-[#140f08] transition-colors duration-300"
        >
          <IconArrowUp className="w-4 h-4" />
        </button>
      </div>

      <p className="text-center text-xs text-neutral-600 pt-8">
        © {new Date().getFullYear()} DABRO Barbershop. {t.footer.rights}
      </p>
    </div>
  </footer>
);

/* ============================================================================
   APP — root component: loading gate, language state, section assembly
   ========================================================================= */
export default function App() {
  const [lang, setLang] = useState("uz");
  const [isLoading, setIsLoading] = useState(true);
  const t = translations[lang];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = "";
    }, prefersReducedMotion ? 400 : 1800);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="bg-black text-white font-body min-h-screen">
      <GlobalStyles />

      <AnimatePresence>{isLoading && <LoadingScreen key="loader" />}</AnimatePresence>

      <Navbar lang={lang} setLang={setLang} t={t} />

      <main>
        <Hero t={t} />
        <About t={t} />
        <Gallery t={t} />
        <VideoSection t={t} />
        <Barbers t={t} lang={lang} />
        <PriceList t={t} lang={lang} />
        <Contact t={t} />
      </main>

      <FloatingContactButton />
      <Footer t={t} />
    </div>
  );
}
