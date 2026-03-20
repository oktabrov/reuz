// ==========================================
// ReUz — Internationalization (EN / UZ)
// ==========================================

const translations = {
  en: {
    // Navbar
    'nav.search': 'Search for items',
    'nav.sell': 'Sell now',
    'nav.catalog': 'Catalog',
    'nav.inbox': 'Inbox',
    'nav.favorites': 'Favorites',
    'nav.profile': 'My Profile',
    'nav.orders': 'My Orders',

    'nav.admin': 'Admin Panel',
    'nav.logout': 'Log out',
    'nav.login': 'Log in',
    'nav.signup': 'Sign up',
    'nav.language': 'EN',

    // Categories bar
    'cat.women': 'Women',
    'cat.men': 'Men',
    'cat.kids': 'Kids',
    'cat.home': 'Home',
    'cat.electronics': 'Electronics',
    'cat.entertainment': 'Entertainment',
    'cat.sports': 'Sports',
    'cat.about': 'About',

    // Home
    'home.hero.title': 'Ready to declutter your closet?',
    'home.hero.sell': 'Sell now',
    'home.hero.how': 'Learn how it works',
    'home.feed.title': 'Newsfeed',
    'home.feed.popular': 'Popular items',
    'home.feed.recent': 'Recently added',
    'home.items_count': '{count} items',

    // Product detail
    'product.buy': 'Buy now',
    'product.message': 'Message seller',
    'product.description': 'Description',
    'product.condition': 'Condition',
    'product.brand': 'Brand',
    'product.size': 'Size',
    'product.category': 'Category',
    'product.color': 'Colour',
    'product.views': 'Views',
    'product.uploaded': 'Uploaded',
    'product.protection': 'Buyer Protection',
    'product.protection.desc': 'Get the item you ordered or your money back.',
    'product.seller': 'Member\'s items',
    'product.shipping': 'Shipping',
    'product.price': 'Price',

    // Checkout
    'checkout.title': 'Checkout',
    'checkout.item': 'Item',
    'checkout.buyer_protection': 'Buyer Protection fee',
    'checkout.shipping': 'Shipping',
    'checkout.total': 'Total',
    'checkout.pay': 'Pay',
    'checkout.card_number': 'Card number',
    'checkout.expiry': 'Expiry date',
    'checkout.cvv': 'Security code',
    'checkout.card_name': 'Name on card',
    'checkout.processing': 'Processing payment...',
    'checkout.success': 'Payment successful',
    'checkout.success_desc': 'Your order has been created.',

    // Orders
    'orders.title': 'My orders',
    'orders.buying': 'Buying',
    'orders.selling': 'Selling',
    'orders.empty_buy': 'No purchases yet',
    'orders.empty_sell': 'No sales yet',
    'orders.empty_buy_desc': 'Start browsing to find great deals!',
    'orders.empty_sell_desc': 'List an item to start selling!',

    // Order detail
    'order.back': 'Back to orders',
    'order.status': 'Order status',
    'order.actions': 'Actions',
    'order.cancel': 'Cancel order',
    'order.confirm': 'Everything is OK',
    'order.issue': 'I have an issue',
    'order.confirm_window': 'Confirm within 30 minutes or funds will be released automatically',
    'order.payment': 'Payment details',
    'order.seller_gets': 'Seller receives',
    'order.platform_rev': 'Platform revenue',
    'order.completed': 'Order completed',

    // Statuses
    'status.paid': 'Paid',
    'status.shipped': 'Shipped',
    'status.delivered': 'Delivered',
    'status.completed': 'Completed',
    'status.cancelled': 'Cancelled',
    'status.disputed': 'Dispute opened',
    'status.refunded': 'Refunded',

    // Dispute
    'dispute.title': 'I have an issue',
    'dispute.select_reason': 'What\'s the problem?',
    'dispute.not_received': 'Not received',
    'dispute.not_received_desc': 'I haven\'t received the item',
    'dispute.damaged': 'Damaged in transit',
    'dispute.damaged_desc': 'The item arrived damaged',
    'dispute.not_as_described': 'Not as described',
    'dispute.not_as_described_desc': 'The item differs significantly from the listing',
    'dispute.counterfeit': 'Counterfeit',
    'dispute.counterfeit_desc': 'The item appears to be fake',
    'dispute.describe': 'Describe the issue',
    'dispute.submit': 'Submit',
    'dispute.protection_note': 'Your payment is protected. The seller\'s payout is on hold while we review the case.',
    'dispute.status': 'Dispute status',
    'dispute.accept_return': 'Accept return',
    'dispute.reject': 'Reject dispute',
    'dispute.ship_back': 'Ship item back',
    'dispute.resolved_refund': 'Full refund issued',
    'dispute.waiting': 'Waiting for response...',

    // Sell
    'sell.title': 'Sell an item',
    'sell.photos': 'Upload photos',
    'sell.photos_hint': 'Add up to 20 photos',
    'sell.item_title': 'Title',
    'sell.item_title_hint': 'e.g. White cotton T-shirt',
    'sell.describe': 'Describe your item',
    'sell.describe_hint': 'e.g. Only worn once, in perfect condition',
    'sell.category': 'Category',
    'sell.select_category': 'Select category',
    'sell.brand': 'Brand',
    'sell.brand_hint': 'e.g. Nike, Zara',
    'sell.condition': 'Condition',
    'sell.size': 'Size',
    'sell.price': 'Price',
    'sell.price_hint': 'Enter price',
    'sell.submit': 'Upload',
    'sell.fee_note': 'A 5% seller fee will be deducted from the sale price.',

    // Conditions
    'condition.new_with_tags': 'New with tags',
    'condition.new_without_tags': 'New without tags',
    'condition.very_good': 'Very good',
    'condition.good': 'Good',
    'condition.satisfactory': 'Satisfactory',

    // Profile
    'profile.listings': 'Items',
    'profile.reviews': 'Reviews',
    'profile.member_since': 'Member since',
    'profile.no_listings': 'No items yet',



    // Auth
    'auth.login': 'Log in',
    'auth.register': 'Sign up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Full name',
    'auth.region': 'Region',
    'auth.no_account': 'Don\'t have an account?',
    'auth.has_account': 'Already have an account?',
    'auth.demo': 'Quick login',

    // Footer
    'footer.about': 'About us',
    'footer.how': 'How it works',
    'footer.help': 'Help Center',
    'footer.selling': 'Selling',
    'footer.buying': 'Buying',
    'footer.safety': 'Trust and Safety',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms & Conditions',
    'footer.cookies': 'Cookie Policy',

    // Admin
    'admin.title': 'Platform Dashboard',
    'admin.revenue': 'Platform Revenue',
    'admin.gmv': 'Total GMV',
    'admin.orders': 'Total Orders',
    'admin.listings': 'Total Listings',
    'admin.breakdown': 'Revenue Breakdown',
    'admin.seller_fees': 'Seller Fees (5%)',
    'admin.buyer_fees': 'Buyer Protection Fees',
    'admin.recent': 'Recent Orders',

    // General
    'general.browse': 'Browse',
    'general.back': 'Back',
    'general.save': 'Save',
    'general.delete': 'Delete',
    'general.search': 'Search',
    'general.filter': 'Filter',
    'general.sort': 'Sort',
    'general.newest': 'Newest first',
    'general.price_low': 'Price: Low to High',
    'general.price_high': 'Price: High to Low',
    'general.no_results': 'No results found',
    'general.all': 'All',

    // Help Center
    'help.title': 'Help Center',
    'help.subtitle': 'Everything you need to know about ReUz',
    'help.search': 'Search articles...',
    'help.buying': 'Buying',
    'help.selling': 'Selling',
    'help.back': 'Help Center',
    'help.related': 'Related Articles',
    'help.not_found': 'Article not found',

    // Category Browser
    'catbrowser.title': 'Categories',
    'catbrowser.search': 'Search categories...',
    'catbrowser.select': 'Select category...',

    // Buyer Confirmation
    'confirm.window': 'Buyer Confirmation Window',
    'confirm.auto_release': 'Funds will auto-release if no issue is reported',
  },

  uz: {
    // Navbar
    'nav.search': 'Buyumlarni qidirish',
    'nav.sell': 'Sotish',
    'nav.catalog': 'Katalog',
    'nav.inbox': 'Xabarlar',
    'nav.favorites': 'Sevimlilar',
    'nav.profile': 'Mening profilim',
    'nav.orders': 'Mening buyurtmalarim',

    'nav.admin': 'Admin panel',
    'nav.logout': 'Chiqish',
    'nav.login': 'Kirish',
    'nav.signup': 'Ro\'yxatdan o\'tish',
    'nav.language': 'UZ',

    // Categories bar
    'cat.women': 'Ayollar',
    'cat.men': 'Erkaklar',
    'cat.kids': 'Bolalar',
    'cat.home': 'Uy',
    'cat.electronics': 'Elektronika',
    'cat.entertainment': 'Ko\'ngilochar',
    'cat.sports': 'Sport',
    'cat.about': 'Biz haqimizda',

    // Home
    'home.hero.title': 'Shkafingizni tartibga keltirishga tayyormisiz?',
    'home.hero.sell': 'Sotish',
    'home.hero.how': 'Qanday ishlashini bilish',
    'home.feed.title': 'Yangiliklar',
    'home.feed.popular': 'Mashhur buyumlar',
    'home.feed.recent': 'Yaqinda qo\'shilgan',
    'home.items_count': '{count} ta buyum',

    // Product detail
    'product.buy': 'Sotib olish',
    'product.message': 'Sotuvchiga yozish',
    'product.description': 'Tavsif',
    'product.condition': 'Holati',
    'product.brand': 'Brend',
    'product.size': 'O\'lcham',
    'product.category': 'Kategoriya',
    'product.color': 'Rang',
    'product.views': 'Ko\'rishlar',
    'product.uploaded': 'Yuklangan',
    'product.protection': 'Xaridor himoyasi',
    'product.protection.desc': 'Buyurtma qilgan narsangizni oling yoki pulingizni qaytaring.',
    'product.seller': 'A\'zo buyumlari',
    'product.shipping': 'Yetkazib berish',
    'product.price': 'Narx',

    // Checkout
    'checkout.title': 'Buyurtmani rasmiylashtirish',
    'checkout.item': 'Buyum',
    'checkout.buyer_protection': 'Xaridor himoyasi to\'lovi',
    'checkout.shipping': 'Yetkazib berish',
    'checkout.total': 'Jami',
    'checkout.pay': 'To\'lash',
    'checkout.card_number': 'Karta raqami',
    'checkout.expiry': 'Amal qilish muddati',
    'checkout.cvv': 'Xavfsizlik kodi',
    'checkout.card_name': 'Kartadagi ism',
    'checkout.processing': 'To\'lov amalga oshirilmoqda...',
    'checkout.success': 'To\'lov muvaffaqiyatli',
    'checkout.success_desc': 'Buyurtmangiz yaratildi.',

    // Orders
    'orders.title': 'Mening buyurtmalarim',
    'orders.buying': 'Xaridlar',
    'orders.selling': 'Sotuvlar',
    'orders.empty_buy': 'Hali xarid yo\'q',
    'orders.empty_sell': 'Hali sotuv yo\'q',
    'orders.empty_buy_desc': 'Ajoyib narxlarni topish uchun ko\'rib chiqishni boshlang!',
    'orders.empty_sell_desc': 'Sotishni boshlash uchun buyum joylashtiring!',

    // Order detail
    'order.back': 'Buyurtmalarga qaytish',
    'order.status': 'Buyurtma holati',
    'order.actions': 'Harakatlar',
    'order.cancel': 'Buyurtmani bekor qilish',
    'order.confirm': 'Hammasi yaxshi',
    'order.issue': 'Muammo bor',
    'order.confirm_window': '30 daqiqa ichida tasdiqlang yoki mablag\' avtomatik ravishda chiqariladi',
    'order.payment': 'To\'lov tafsilotlari',
    'order.seller_gets': 'Sotuvchi oladi',
    'order.platform_rev': 'Platforma daromadi',
    'order.completed': 'Buyurtma bajarildi',

    // Statuses
    'status.paid': 'To\'langan',
    'status.shipped': 'Jo\'natilgan',
    'status.delivered': 'Yetkazilgan',
    'status.completed': 'Bajarilgan',
    'status.cancelled': 'Bekor qilingan',
    'status.disputed': 'Nizo ochilgan',
    'status.refunded': 'Qaytarilgan',

    // Dispute
    'dispute.title': 'Muammo bor',
    'dispute.select_reason': 'Muammo nima?',
    'dispute.not_received': 'Olinmagan',
    'dispute.not_received_desc': 'Buyumni olmadim',
    'dispute.damaged': 'Shikastlangan',
    'dispute.damaged_desc': 'Buyum shikastlangan holda keldi',
    'dispute.not_as_described': 'Tavsifga mos kelmaydi',
    'dispute.not_as_described_desc': 'Buyum e\'londan sezilarli farq qiladi',
    'dispute.counterfeit': 'Soxta',
    'dispute.counterfeit_desc': 'Buyum soxta ko\'rinadi',
    'dispute.describe': 'Muammoni tasvirlang',
    'dispute.submit': 'Yuborish',
    'dispute.protection_note': 'To\'lovingiz himoyalangan. Ishni ko\'rib chiqayotganimizda sotuvchining to\'lovi to\'xtatilgan.',
    'dispute.status': 'Nizo holati',
    'dispute.accept_return': 'Qaytarishni qabul qilish',
    'dispute.reject': 'Nizoni rad etish',
    'dispute.ship_back': 'Buyumni qaytarish',
    'dispute.resolved_refund': 'To\'liq qaytarish amalga oshirildi',
    'dispute.waiting': 'Javob kutilmoqda...',

    // Sell
    'sell.title': 'Buyum sotish',
    'sell.photos': 'Rasmlar yuklash',
    'sell.photos_hint': '20 tagacha rasm qo\'shing',
    'sell.item_title': 'Sarlavha',
    'sell.item_title_hint': 'masalan, Oq paxta futbolka',
    'sell.describe': 'Buyumingizni tasvirlang',
    'sell.describe_hint': 'masalan, Faqat bir marta kiyilgan, mukammal holatda',
    'sell.category': 'Kategoriya',
    'sell.select_category': 'Kategoriyani tanlang',
    'sell.brand': 'Brend',
    'sell.brand_hint': 'masalan, Nike, Zara',
    'sell.condition': 'Holat',
    'sell.size': 'O\'lcham',
    'sell.price': 'Narx',
    'sell.price_hint': 'Narxni kiriting',
    'sell.submit': 'Yuklash',
    'sell.fee_note': 'Sotuv narxidan 5% sotuvchi to\'lovi ushlab qolinadi.',

    // Conditions
    'condition.new_with_tags': 'Yangi, yorliqli',
    'condition.new_without_tags': 'Yangi, yorliqsiz',
    'condition.very_good': 'Juda yaxshi',
    'condition.good': 'Yaxshi',
    'condition.satisfactory': 'Qoniqarli',

    // Profile
    'profile.listings': 'Buyumlar',
    'profile.reviews': 'Sharhlar',
    'profile.member_since': 'A\'zo bo\'lgan sana',
    'profile.no_listings': 'Hali buyum yo\'q',



    // Auth
    'auth.login': 'Kirish',
    'auth.register': 'Ro\'yxatdan o\'tish',
    'auth.email': 'Email',
    'auth.password': 'Parol',
    'auth.name': 'To\'liq ism',
    'auth.region': 'Viloyat',
    'auth.no_account': 'Hisobingiz yo\'qmi?',
    'auth.has_account': 'Hisobingiz bormi?',
    'auth.demo': 'Tezkor kirish',

    // Footer
    'footer.about': 'Biz haqimizda',
    'footer.how': 'Qanday ishlaydi',
    'footer.help': 'Yordam markazi',
    'footer.selling': 'Sotish',
    'footer.buying': 'Sotib olish',
    'footer.safety': 'Ishonch va xavfsizlik',
    'footer.privacy': 'Maxfiylik',
    'footer.terms': 'Foydalanish shartlari',
    'footer.cookies': 'Cookie siyosati',

    // Admin
    'admin.title': 'Platforma boshqaruv paneli',
    'admin.revenue': 'Platforma daromadi',
    'admin.gmv': 'Umumiy GMV',
    'admin.orders': 'Jami buyurtmalar',
    'admin.listings': 'Jami e\'lonlar',
    'admin.breakdown': 'Daromad taqsimoti',
    'admin.seller_fees': 'Sotuvchi to\'lovlari (5%)',
    'admin.buyer_fees': 'Xaridor himoyasi to\'lovlari',
    'admin.recent': 'So\'nggi buyurtmalar',

    // General
    'general.browse': 'Ko\'rish',
    'general.back': 'Orqaga',
    'general.save': 'Saqlash',
    'general.delete': 'O\'chirish',
    'general.search': 'Qidirish',
    'general.filter': 'Filtrlash',
    'general.sort': 'Saralamoq',
    'general.newest': 'Eng yangi',
    'general.price_low': 'Narx: pastdan yuqoriga',
    'general.price_high': 'Narx: yuqoridan pastga',
    'general.no_results': 'Natija topilmadi',
    'general.all': 'Hammasi',

    // Help Center
    'help.title': 'Yordam Markazi',
    'help.subtitle': 'ReUz haqida bilishingiz kerak bo\'lgan hamma narsa',
    'help.search': 'Maqolalarni qidirish...',
    'help.buying': 'Sotib olish',
    'help.selling': 'Sotish',
    'help.back': 'Yordam Markazi',
    'help.related': 'Bog\'liq maqolalar',
    'help.not_found': 'Maqola topilmadi',

    // Category Browser
    'catbrowser.title': 'Kategoriyalar',
    'catbrowser.search': 'Kategoriyalarni qidirish...',
    'catbrowser.select': 'Kategoriyani tanlang...',

    // Buyer Confirmation
    'confirm.window': 'Xaridor tasdiqlash oynasi',
    'confirm.auto_release': 'Agar muammo xabar qilinmasa, mablag\'lar avtomatik chiqariladi',
  }
};

let currentLang = localStorage.getItem('reuz_lang') || 'en';

export function t(key, params = {}) {
  let text = translations[currentLang]?.[key] || translations.en[key] || key;
  Object.entries(params).forEach(([k, v]) => {
    text = text.replace(`{${k}}`, v);
  });
  return text;
}

export function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('reuz_lang', lang);
  // Trigger re-render
  window.dispatchEvent(new CustomEvent('lang-change', { detail: lang }));
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}

export function getLanguage() {
  return currentLang;
}

export function toggleLanguage() {
  setLanguage(currentLang === 'en' ? 'uz' : 'en');
}
