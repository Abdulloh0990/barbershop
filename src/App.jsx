import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";

/* ============================================================================
   ELITE BARBER STUDIO — Premium Single-Page Landing Site
   Stack: React + Tailwind CSS + Framer Motion (no other UI libraries)
   Languages: English / Russian / Uzbek (manual state-based i18n)
   ========================================================================= */

/* ----------------------------------------------------------------------
   MEDIA — replace these with your studio's real photography & footage.
   Photos are free-to-use Unsplash images; videos are free Mixkit clips.
   ---------------------------------------------------------------------- */
const MEDIA = {
  heroPoster:
    "https://images.unsplash.com/photo-1657105052497-f996284ffff8?auto=format&fit=crop&w=1600&q=80",
  heroVideo: "https://assets.mixkit.co/videos/43236/43236-360.mp4", // TODO: swap for real studio footage
  promoVideo: "https://assets.mixkit.co/videos/43232/43232-360.mp4", // TODO: swap for real studio footage
  about:
    "https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?auto=format&fit=crop&w=1200&q=80",
};

const galleryData = [
  {
    id: 1,
    category: "interior",
    url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1400&q=80",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    id: 2,
    category: "haircuts",
    url: "https://images.unsplash.com/photo-1647140655214-e4a2d914971f?auto=format&fit=crop&w=900&q=80",
    span: "",
  },
  {
    id: 3,
    category: "workspace",
    url: "https://images.unsplash.com/photo-1621645582931-d1d3e6564943?auto=format&fit=crop&w=900&q=80",
    span: "md:row-span-2",
  },
  {
    id: 4,
    category: "atmosphere",
    url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=80",
    span: "",
  },
  {
    id: 5,
    category: "interior",
    url: "https://images.unsplash.com/photo-1536520002442-39764a41e987?auto=format&fit=crop&w=900&q=80",
    span: "",
  },
  {
    id: 6,
    category: "haircuts",
    url: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=1400&q=80",
    span: "md:col-span-2",
  },
  {
    id: 7,
    category: "workspace",
    url: "https://images.unsplash.com/photo-1592647420148-bfcc177e2117?auto=format&fit=crop&w=900&q=80",
    span: "",
  },
  {
    id: 8,
    category: "atmosphere",
    url: "https://images.unsplash.com/photo-1678356164573-9a534fe43958?auto=format&fit=crop&w=900&q=80",
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

/* ============================================================================
   TRANSLATIONS — every UI string in English, Russian & Uzbek
   ========================================================================= */
const translations = {
  en: {
    nav: { home: "Home", about: "About", barbers: "Barbers", prices: "Prices", gallery: "Gallery", contact: "Contact" },
    common: { bookAppointment: "Book Appointment", bookNow: "Book Now", viewBarbers: "View Barbers", scroll: "Scroll", popular: "Most Popular" },
    hero: { title: "Elite Barber Studio", subtitle: "Where Style Meets Perfection" },
    about: {
      kicker: "About Us",
      title: "The Art of Precision Grooming",
      text: "For over a decade, Elite Barber Studio has redefined the grooming experience in the city. We blend timeless craftsmanship with modern technique, creating a sanctuary where every detail — from the first consultation to the final touch — is treated as an art form. This is more than a haircut. It's a ritual of refinement.",
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
      duration: "Duration",
      categories: { haircut: "Haircut", beard: "Beard Trim", kids: "Kids Haircut", combo: "Hair + Beard", premium: "Premium Package" },
      premiumFeatures: ["Precision Haircut", "Beard Sculpting", "Hot Towel Treatment", "Head & Shoulder Massage", "Premium Styling"],
    },
    contact: {
      kicker: "Visit Us",
      title: "Let's Get You Looking Sharp",
      subtitle: "Book your seat at Tashkent's most exclusive barbershop.",
      address: "Address",
      addressValue: "12 Amir Temur Street, Tashkent, Uzbekistan",
      hours: "Working Hours",
      hoursValue: "Mon – Sun: 9:00 AM – 9:00 PM",
      phone: "Phone",
    },
    footer: { tagline: "Where Style Meets Perfection", rights: "All Rights Reserved." },
  },
  ru: {
    nav: { home: "Главная", about: "О нас", barbers: "Барберы", prices: "Цены", gallery: "Галерея", contact: "Контакты" },
    common: { bookAppointment: "Записаться", bookNow: "Записаться", viewBarbers: "Наши барберы", scroll: "Прокрутите", popular: "Популярный выбор" },
    hero: { title: "Elite Barber Studio", subtitle: "Там, где стиль встречает совершенство" },
    about: {
      kicker: "О нас",
      title: "Искусство безупречного стиля",
      text: "Более десяти лет Elite Barber Studio задаёт новые стандарты барберинга в городе. Мы сочетаем традиционное мастерство с современными техниками, создавая пространство, где каждая деталь — от первой консультации до финального штриха — становится настоящим искусством. Это больше, чем стрижка. Это ритуал безупречности.",
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
      duration: "Длительность",
      categories: { haircut: "Стрижка", beard: "Оформление бороды", kids: "Детская стрижка", combo: "Стрижка + Борода", premium: "Премиум пакет" },
      premiumFeatures: ["Точная стрижка", "Моделирование бороды", "Горячее полотенце", "Массаж головы и плеч", "Премиальная укладка"],
    },
    contact: {
      kicker: "Приходите к нам",
      title: "Сделаем ваш образ безупречным",
      subtitle: "Забронируйте место в самом эксклюзивном барбершопе Ташкента.",
      address: "Адрес",
      addressValue: "ул. Амира Темура 12, Ташкент, Узбекистан",
      hours: "Часы работы",
      hoursValue: "Пн – Вс: 9:00 – 21:00",
      phone: "Телефон",
    },
    footer: { tagline: "Там, где стиль встречает совершенство", rights: "Все права защищены." },
  },
  uz: {
    nav: { home: "Bosh sahifa", about: "Biz haqimizda", barbers: "Barberlar", prices: "Narxlar", gallery: "Galereya", contact: "Aloqa" },
    common: { bookAppointment: "Aloqaga chiqish", bookNow: "Aloqaga chiqish", viewBarbers: "Barberlarni ko'rish", scroll: "Pastga aylantiring", popular: "Eng mashhur" },
    hero: { title: "Elite Barber Studio", subtitle: "Uslub mukammallik bilan uchrashadigan joy" },
    about: {
      kicker: "Biz haqimizda",
      title: "Mukammal parvarishlash san'ati",
      text: "O'n yildan ortiq vaqt davomida Elite Barber Studio shaharda barberlik sohasini yangi bosqichga olib chiqdi. Biz an'anaviy mahoratni zamonaviy texnika bilan uyg'unlashtirib, har bir detal — birinchi maslahatdan so'nggi teginishgacha — san'at asari sifatida qaraladigan makon yaratamiz. Bu shunchaki soch olish emas. Bu mukammallik marosimi.",
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
      duration: "Davomiyligi",
      categories: { haircut: "Soch olish", beard: "Soqol olish", kids: "Bolalar uchun soch olish", combo: "Soch + Soqol", premium: "Premium paket" },
      premiumFeatures: ["Aniq soch olish", "Soqolni shakllantirish", "Issiq sochiq muolajasi", "Bosh va yelka massaji", "Premium turmak"],
    },
    contact: {
      kicker: "Bizga tashrif buyuring",
      title: "Ko'rinishingizni mukammal qilaylik",
      subtitle: "Toshkentning eng nufuzli barbershopidan joy band qiling.",
      address: "Manzil",
      addressValue: "Amir Temur ko'chasi 12, Toshkent, O'zbekiston",
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
    name: "Aziz Karimov",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    position: { en: "Master Barber & Founder", ru: "Мастер-барбер и основатель", uz: "Usta barber va asoschisi" },
    experience: 12,
    rating: 5.0,
    languages: ["EN", "RU", "UZ"],
    phone: "+998 90 123 45 67",
    telegram: "aziz_barber",
    instagram: "aziz.barber",
    skills: ["fade", "beard", "classic", "hotTowel", "hairDesign"],
    description: {
      en: "The visionary behind Elite Barber Studio — Aziz blends classic barbering traditions with modern precision, and his steady hand has made his name synonymous with excellence.",
      ru: "Визионер, стоящий за Elite Barber Studio. Азиз сочетает классические традиции барберинга с современной точностью — его твёрдая рука сделала его имя синонимом совершенства.",
      uz: "Elite Barber Studio ortidagi g'oya muallifi. Aziz klassik an'analarni zamonaviy aniqlik bilan uyg'unlashtiradi — uning ishonchli qo'li uni mukammallik timsoliga aylantirdi.",
    },
  },
  {
    id: 2,
    name: "David Bennett",
    photo: "https://randomuser.me/api/portraits/men/56.jpg",
    position: { en: "Senior Barber", ru: "Старший барбер", uz: "Katta barber" },
    experience: 8,
    rating: 4.9,
    languages: ["EN", "RU"],
    phone: "+998 91 234 56 78",
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
    name: "Rustam Yusupov",
    photo: "https://randomuser.me/api/portraits/men/68.jpg",
    position: { en: "Beard Specialist", ru: "Специалист по бороде", uz: "Soqol bo'yicha mutaxassis" },
    experience: 6,
    rating: 4.8,
    languages: ["RU", "UZ"],
    phone: "+998 93 345 67 89",
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
    name: "Jasur Nazarov",
    photo: "https://randomuser.me/api/portraits/men/75.jpg",
    position: { en: "Style Consultant", ru: "Стилист-консультант", uz: "Uslub bo'yicha maslahatchi" },
    experience: 5,
    rating: 4.7,
    languages: ["EN", "UZ"],
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

const priceCategories = [
  { id: "haircut", icon: IconScissors, price: 100000, duration: { en: "40 min", ru: "40 мин", uz: "40 daqiqa" } },
  { id: "beard", icon: IconRazor, price: 60000, duration: { en: "20 min", ru: "20 мин", uz: "20 daqiqa" } },
  { id: "kids", icon: IconSmiley, price: 70000, duration: { en: "30 min", ru: "30 мин", uz: "30 daqiqa" } },
  { id: "combo", icon: IconScissors, price: 150000, duration: { en: "60 min", ru: "60 мин", uz: "60 daqiqa" } },
  { id: "premium", icon: IconCrown, price: 250000, duration: { en: "90 min", ru: "90 мин", uz: "90 daqiqa" }, featured: true },
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

/* ============================================================================
   GLOBAL STYLES — fonts, scrollbar, selection colour, dark map filter
   ========================================================================= */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;0,900;1,500&family=Inter:wght@300;400;500;600;700;800&display=swap');
    html { scroll-behavior: smooth; background:#000; }
    .font-display { font-family: 'Playfair Display', serif; }
    .font-body { font-family: 'Inter', sans-serif; }
    ::selection { background:#ffffff; color:#000000; }
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background:#000000; }
    ::-webkit-scrollbar-thumb { background:#333333; border-radius: 999px; }
    ::-webkit-scrollbar-thumb:hover { background:#555555; }
    * { scrollbar-width: thin; scrollbar-color: #333333 #000000; }
    .map-dark { filter: invert(92%) hue-rotate(180deg) brightness(0.9) contrast(1.05); }
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
      <span className="h-px w-8 bg-white/30" />
      <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-neutral-400 font-medium">{kicker}</span>
      <span className="h-px w-8 bg-white/30" />
    </motion.div>
    <motion.h2 variants={fadeUp} className="font-display text-4xl md:text-6xl font-bold leading-[1.05] mb-5">
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p variants={fadeUp} className="text-neutral-400 text-base md:text-lg leading-relaxed">
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
    className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300 hover:bg-white hover:text-black hover:border-white transition-colors duration-300"
  >
    {children}
  </a>
);

/* Premium barber profile card */
const BarberCard = ({ barber, lang, t }) => (
  <motion.div
    variants={fadeUp}
    whileHover={{ y: -10 }}
    transition={{ duration: 0.4, ease: EASE }}
    className="group relative bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden hover:border-white/30 hover:shadow-[0_25px_70px_-15px_rgba(255,255,255,0.12)] transition-all duration-500"
  >
    {/* Photo + name overlay */}
    <div className="relative aspect-[4/3] overflow-hidden">
      <img
        src={barber.photo}
        alt={barber.name}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
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
            <span key={code} className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">
              {code}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <IconLink href={`tel:${barber.phone.replace(/\s/g, "")}`} label="Call">
            <IconPhone className="w-4 h-4" />
          </IconLink>
          <IconLink href={`https://t.me/${barber.telegram}`} label="Telegram">
            <IconTelegram className="w-4 h-4" />
          </IconLink>
          <IconLink href={`https://instagram.com/${barber.instagram}`} label="Instagram">
            <IconInstagram className="w-4 h-4" />
          </IconLink>
        </div>
      </div>
    </div>
  </motion.div>
);

/* Price card — regular tier or the inverted "featured" tier */
const PriceCard = ({ item, t, lang }) => {
  const Icon = item.icon;

  if (item.featured) {
    return (
      <motion.div
        variants={fadeUp}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="relative sm:col-span-2 lg:col-span-4 bg-white text-black rounded-3xl p-8 md:p-12 overflow-hidden"
      >
        <span className="absolute top-6 right-6 md:top-8 md:right-8 bg-black text-white text-[10px] md:text-xs font-semibold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full">
          {t.common.popular}
        </span>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <Icon className="w-9 h-9 mb-5" strokeWidth={1.2} />
            <h3 className="font-display text-3xl md:text-4xl font-bold mb-3">{t.prices.categories[item.id]}</h3>
            <div className="flex flex-wrap items-baseline gap-2 mb-7">
              <span className="text-4xl md:text-5xl font-bold font-display">{item.price.toLocaleString()}</span>
              <span className="text-sm font-medium text-neutral-600">UZS</span>
              <span className="text-sm text-neutral-500 ml-2 inline-flex items-center gap-1">
                <IconClock className="w-3.5 h-3.5" /> {item.duration[lang]}
              </span>
            </div>
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
          <ul className="space-y-3">
            {t.prices.premiumFeatures.map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-sm md:text-base text-neutral-700">
                <IconCheck className="w-4 h-4 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -8, borderColor: "rgba(255,255,255,0.3)" }}
      transition={{ duration: 0.4, ease: EASE }}
      className="bg-white/[0.03] border border-white/10 rounded-3xl p-7 md:p-8"
    >
      <Icon className="w-8 h-8 mb-6 text-white" strokeWidth={1.2} />
      <h3 className="font-display text-xl md:text-2xl font-bold mb-4">{t.prices.categories[item.id]}</h3>
      <div className="flex items-baseline gap-1.5 mb-2">
        <span className="text-2xl md:text-3xl font-bold font-display">{item.price.toLocaleString()}</span>
        <span className="text-xs text-neutral-500 font-medium">UZS</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-neutral-500">
        <IconClock className="w-3.5 h-3.5" /> {item.duration[lang]}
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
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: EASE }}
      className="flex flex-col items-center"
    >
      <IconScissors className="w-9 h-9 md:w-10 md:h-10 mb-5 text-white" strokeWidth={1} />
      <h1 className="font-display text-3xl md:text-5xl tracking-[0.15em] font-semibold text-white">ELITE</h1>
      <p className="text-[10px] md:text-xs tracking-[0.5em] text-neutral-400 mt-2 uppercase">Barber Studio</p>
    </motion.div>
    <div className="absolute bottom-16 w-40 md:w-56 h-px bg-white/10 overflow-hidden rounded-full">
      <motion.div
        className="h-full bg-white"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 2.2, ease: "easeInOut" }}
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
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (id) => {
    setMenuOpen(false);
    scrollToId(id);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? "bg-black/70 backdrop-blur-xl border-b border-white/10 py-3 md:py-4" : "bg-transparent py-5 md:py-7"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between">
        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); handleNavClick("home"); }}
          className="flex items-center gap-2 group"
        >
          <IconScissors className="w-5 h-5 md:w-6 md:h-6 text-white transition-transform duration-500 group-hover:rotate-45" strokeWidth={1.3} />
          <span className="font-display text-lg md:text-xl tracking-[0.1em] font-semibold text-white">ELITE</span>
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
            className="hidden md:inline-flex items-center bg-white text-black text-xs font-semibold tracking-wide px-5 py-2.5 rounded-full hover:bg-neutral-200 transition-colors duration-300"
          >
            {t.common.bookAppointment}
          </motion.button>
          <button
            className="lg:hidden text-white"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <IconClose className="w-6 h-6" /> : <IconMenu className="w-6 h-6" />}
          </button>
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
            className="lg:hidden overflow-hidden bg-black/95 backdrop-blur-xl border-t border-white/10"
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
                className="mt-5 bg-white text-black text-sm font-semibold tracking-wide px-5 py-3 rounded-full"
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
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);

  const titleWords = t.hero.title.split(" ");

  return (
    <section id="home" ref={ref} className="relative h-screen w-full overflow-hidden bg-black">
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
        <div className="absolute inset-0 bg-black/20" />
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
            className="group relative overflow-hidden bg-white text-black px-8 py-4 rounded-full font-semibold text-sm tracking-wide inline-flex items-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.15)]"
          >
            {t.common.bookAppointment}
            <IconArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
            whileTap={{ scale: 0.96 }}
            onClick={() => scrollToId("barbers")}
            className="border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-sm tracking-wide"
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
  const stats = [
    { value: 12, suffix: "+", label: t.about.stat1 },
    { value: 8500, suffix: "+", label: t.about.stat2 },
    { value: 15, suffix: "", label: t.about.stat3 },
  ];

  return (
    <section id="about" className="relative bg-black py-24 md:py-36 px-6 md:px-10 overflow-hidden">
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
            alt="Inside Elite Barber Studio"
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl" />
          <div className="absolute -bottom-6 -left-6 bg-white text-black rounded-2xl px-6 py-5 shadow-2xl hidden md:block">
            <div className="font-display text-2xl font-bold">12+</div>
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
  <section id="gallery" className="relative bg-black py-24 md:py-36 px-6 md:px-10">
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
            className={`relative rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer ${item.span}`}
          >
            <img
              src={item.url}
              alt={t.gallery.categories[item.category]}
              loading="lazy"
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
  const videoRef = useRef(null);

  const toggleMute = () => {
    setMuted((m) => !m);
    if (videoRef.current) videoRef.current.muted = !muted;
  };

  return (
    <section className="relative bg-black py-24 md:py-36 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <SectionHeading kicker={t.video.kicker} title={t.video.title} subtitle={t.video.subtitle} />

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10"
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted={muted}
            loop
            playsInline
            poster={MEDIA.about}
          >
            <source src={MEDIA.promoVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          <button
            onClick={toggleMute}
            aria-label="Toggle sound"
            className="absolute bottom-5 right-5 w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors duration-300"
          >
            {muted ? <IconVolumeOff className="w-5 h-5" /> : <IconVolumeOn className="w-5 h-5" />}
          </button>
        </motion.div>
      </div>
    </section>
  );
};

/* ============================================================================
   6. OUR BARBERS
   ========================================================================= */
const Barbers = ({ t, lang }) => (
  <section id="barbers" className="relative bg-black py-24 md:py-36 px-6 md:px-10">
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
const PriceList = ({ t, lang }) => (
  <section id="prices" className="relative bg-black py-24 md:py-36 px-6 md:px-10">
    <div className="max-w-6xl mx-auto">
      <SectionHeading kicker={t.prices.kicker} title={t.prices.title} subtitle={t.prices.subtitle} />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer(0.12)}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
      >
        {priceCategories.map((item) => (
          <PriceCard key={item.id} item={item} t={t} lang={lang} />
        ))}
      </motion.div>
    </div>
  </section>
);

/* ============================================================================
   8. CONTACT — info (fade-left), map (fade-right)
   ========================================================================= */
const Contact = ({ t }) => (
  <section id="contact" className="relative bg-black py-24 md:py-36 px-6 md:px-10">
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
            { icon: IconPin, label: t.contact.address, value: t.contact.addressValue },
            { icon: IconClock, label: t.contact.hours, value: t.contact.hoursValue },
            { icon: IconPhone, label: t.contact.phone, value: "+998 90 123 45 67" },
          ].map((row, i) => (
            <motion.div
              key={i}
              variants={fadeLeft}
              className="flex items-start gap-4 bg-white/[0.03] border border-white/10 rounded-2xl p-5"
            >
              <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                <row.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-1">{row.label}</div>
                <div className="text-sm md:text-base text-neutral-200">{row.value}</div>
              </div>
            </motion.div>
          ))}

          <motion.div variants={fadeLeft} className="flex items-center gap-3 pt-2">
            <IconLink href="https://t.me/elitebarber" label="Telegram">
              <IconTelegram className="w-5 h-5" />
            </IconLink>
            <IconLink href="https://instagram.com/elitebarberstudio" label="Instagram">
              <IconInstagram className="w-5 h-5" />
            </IconLink>
          </motion.div>

          <motion.a
            variants={fadeLeft}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="tel:+998901234567"
            className="inline-block w-full sm:w-auto text-center bg-white text-black px-8 py-4 rounded-full font-semibold text-sm tracking-wide mt-2"
          >
            {t.common.bookAppointment}
          </motion.a>
        </motion.div>

        <motion.div
          variants={fadeRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="relative rounded-3xl overflow-hidden border border-white/10 min-h-[320px]"
        >
          <iframe
            title="Elite Barber Studio location"
            src="https://www.google.com/maps?q=Amir+Temur+Street+Tashkent+Uzbekistan&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: "320px" }}
            loading="lazy"
            className="absolute inset-0 map-dark"
          />
        </motion.div>
      </div>
    </div>
  </section>
);

/* ============================================================================
   9. FOOTER — minimal, social icons, copyright
   ========================================================================= */
const Footer = ({ t }) => (
  <footer className="relative bg-black border-t border-white/10 pt-16 pb-8 px-6 md:px-10">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-white/10">
        <div className="flex flex-col items-center md:items-start gap-3">
          <div className="flex items-center gap-2">
            <IconScissors className="w-5 h-5 text-white" strokeWidth={1.3} />
            <span className="font-display text-xl tracking-[0.1em] font-semibold text-white">ELITE</span>
          </div>
          <p className="text-sm text-neutral-500">{t.footer.tagline}</p>
        </div>

        <div className="flex items-center gap-3">
          <IconLink href="tel:+998901234567" label="Phone">
            <IconPhone className="w-4 h-4" />
          </IconLink>
          <IconLink href="https://t.me/elitebarber" label="Telegram">
            <IconTelegram className="w-4 h-4" />
          </IconLink>
          <IconLink href="https://instagram.com/elitebarberstudio" label="Instagram">
            <IconInstagram className="w-4 h-4" />
          </IconLink>
        </div>

        <button
          onClick={() => scrollToId("home")}
          aria-label="Back to top"
          className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-300 hover:bg-white hover:text-black transition-colors duration-300"
        >
          <IconArrowUp className="w-4 h-4" />
        </button>
      </div>

      <p className="text-center text-xs text-neutral-600 pt-8">
        © {new Date().getFullYear()} Elite Barber Studio. {t.footer.rights}
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
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = "";
    }, 2500);
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

      <Footer t={t} />
    </div>
  );
}