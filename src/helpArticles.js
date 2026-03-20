// ==========================================
// ReUz — Help Center Articles Data (EN / UZ)
// Cross-links use <a href="#/help/SLUG"> format
// ==========================================

export const HELP_ARTICLES = [
  // ─── 1. Buyer Protection Fee ───────────────────────
  {
    id: 'buyer-protection',
    slug: 'buyer-protection-fee',
    icon: '',
    category: 'buying',
    en: {
      title: 'Buyer Protection Fee on ReUz',
      sections: [
        {
          heading: null,
          body: `Our goal is to provide buyers with a secure purchasing experience by applying a Buyer Protection fee. This fee is mandatory for every order made through ReUz and is added automatically at checkout.`
        },
        {
          heading: 'How the fee is calculated',
          body: `The calculation of this fee varies based on several factors, such as:`,
          bullets: [
            'Item characteristics',
            'Order value',
            'Order type (a single item versus a bundle)'
          ]
        },
        {
          heading: null,
          body: `The Buyer Protection fee typically includes a percentage of the item's or bundle's price, as well as a fixed fee — usually <strong>2% + $0.50</strong>.`
        },
        {
          heading: 'Where the fee appears',
          body: `As you browse items, the fee is included in the price breakdown for each listing and reflected in the total price for the item or bundle. At checkout, the total Buyer Protection fee, which includes VAT, will be added to your order's final price and clearly displayed in the order summary.`
        },
        {
          heading: null,
          body: `Learn more about the benefits that you get from our <a href="#/help/refund-policy" class="help-link">Buyer Protection and Refund Policy</a>.`
        }
      ]
    },
    uz: {
      title: 'ReUz\'da Xaridor Himoyasi To\'lovi',
      sections: [
        {
          heading: null,
          body: `Bizning maqsadimiz xaridorlarga Xaridor Himoyasi to'lovini qo'llash orqali xavfsiz xarid tajribasini taqdim etishdir. Bu to'lov ReUz orqali berilgan har bir buyurtma uchun majburiy bo'lib, to'lov sahifasida avtomatik ravishda qo'shiladi.`
        },
        {
          heading: 'To\'lov qanday hisoblanadi',
          body: `Ushbu to'lovning hisobi bir qancha omillarga asoslanadi, masalan:`,
          bullets: [
            'Buyum xususiyatlari',
            'Buyurtma qiymati',
            'Buyurtma turi (bitta buyum yoki to\'plam)'
          ]
        },
        {
          heading: null,
          body: `Xaridor Himoyasi to'lovi odatda buyum yoki to'plam narxining foizini, shuningdek belgilangan to'lovni o'z ichiga oladi — odatda <strong>2% + $0.50</strong>.`
        },
        {
          heading: 'To\'lov qayerda ko\'rsatiladi',
          body: `Buyumlarni ko'rib chiqayotganingizda, to'lov har bir e'lonning narx tarkibiga kiritilgan va buyum yoki to'plamning umumiy narxida aks ettirilgan. To'lov sahifasida QQS ni o'z ichiga olgan umumiy Xaridor Himoyasi to'lovi buyurtmangizning yakuniy narxiga qo'shiladi va buyurtma xulosasida aniq ko'rsatiladi.`
        },
        {
          heading: null,
          body: `Bizning <a href="#/help/refund-policy" class="help-link">Xaridor Himoyasi va Qaytarish Siyosati</a>dan oladigan imtiyozlar haqida ko'proq bilib oling.`
        }
      ]
    }
  },

  // ─── 2. Packing an Item ────────────────────────────
  {
    id: 'packing-item',
    slug: 'packing-an-item',
    icon: '',
    category: 'selling',
    en: {
      title: 'Packing an Item',
      sections: [
        {
          heading: null,
          body: `When sending items with the prepaid ReUz-generated shipping label, make sure they are packed properly and comply with our Catalog Rules and the prohibited items list.`
        },
        {
          heading: null,
          body: `<strong>You may not receive a refund or compensation if you ignore these rules and the package gets damaged in transit.</strong>`
        },
        {
          heading: 'To pack an item',
          body: null,
          bullets: [
            '<strong>Use sturdy outer packaging</strong> that snugly fits the item. For example, a cardboard box to protect the item from dirt and moisture, or carrier-provided packaging, such as a padded waterproof envelope or bag, if available. Don\'t use bags without padding inside.',
            '<strong>Fill the empty space</strong> inside with bubble wrap, paper, foam, or similar material to prevent movement and contact with the outer packaging during transit.',
            '<strong>Seal the package</strong> with strong tape to provide extra protection and prevent the item from falling out.',
            '<strong>Stick the shipping label</strong> flat on the largest side of the package, ensuring the barcode is fully visible. Secure the label\'s edges with strong tape. Remove any old labels.',
            '<strong>For fragile items</strong>, always use a sturdy box, not a plastic bag. Stick a "Fragile" label on the package. Separate each fragile item with bubble wrap or other cushioning material.',
            '<strong>For bundles</strong>, place all items in one package (no more than two electronic devices with batteries). Make sure each item is securely wrapped and not moving inside.',
            'If unsure, always follow your carrier\'s packaging requirements.'
          ]
        },
        {
          heading: 'Note',
          body: `We recommend taking photos of the item and the packed package (inside and outside) before shipping. If the buyer reports any issues during transit, these photos may help resolve the issue faster.`
        }
      ]
    },
    uz: {
      title: 'Buyumni Qadoqlash',
      sections: [
        {
          heading: null,
          body: `ReUz tomonidan yaratilgan oldindan to'langan jo'natish yorlig'i bilan buyumlarni jo'natayotganda, ularning to'g'ri qadoqlanganligiga va Katalog Qoidalari hamda taqiqlangan buyumlar ro'yxatiga muvofiqligiga ishonch hosil qiling.`
        },
        {
          heading: null,
          body: `<strong>Agar ushbu qoidalarga e'tibor bermasangiz va paket jo'natish paytida shikastlansa, qaytarish yoki kompensatsiya olmaysiz.</strong>`
        },
        {
          heading: 'Buyumni qadoqlash',
          body: null,
          bullets: [
            '<strong>Mustahkam tashqi qadoqlashdan foydalaning</strong> — buyumga mos keladigan. Masalan, buyumni kir va namlikdan himoya qilish uchun karton quti, yoki mavjud bo\'lsa, tashuvchi tomonidan taqdim etilgan qadoqlash, masalan, yumshoq suv o\'tkazmaydigan konvert yoki sumka. Ichida to\'ldiruvchisi yo\'q sumkalardan foydalanmang.',
            '<strong>Bo\'sh joyni to\'ldiring</strong> — pufakcham, qog\'oz, ko\'pik yoki shunga o\'xshash material bilan harakatlanishni va tashqi qadoqlash bilan aloqani oldini olish uchun.',
            '<strong>Paketni muhriang</strong> — mustahkam lenta bilan qo\'shimcha himoya ta\'minlash va buyumning tushib ketishini oldini olish uchun.',
            '<strong>Jo\'natish yorlig\'ini yopishtiring</strong> — paketning eng katta tomoniga tekis holda, shtrix-kod to\'liq ko\'rinib turishiga ishonch hosil qiling. Yorliq chetlarini mustahkam lenta bilan mahkamlang. Eski yorliqlarni olib tashlang.',
            '<strong>Mo\'rt buyumlar uchun</strong> — har doim mustahkam qutidan foydalaning, polietilen paketdan emas. Paketga "Mo\'rt" yorlig\'ini yopishtiring. Har bir mo\'rt buyumni pufakcham yoki boshqa to\'ldiruvchi material bilan ajrating.',
            '<strong>To\'plamlar uchun</strong> — barcha buyumlarni bitta paketga joylashtiring (batareyali ikki ta elektronik qurilmadan ko\'p emas). Har bir buyum xavfsiz o\'ralgan va ichida harakatlanmasligiga ishonch hosil qiling.',
            'Agar ishonchingiz komil bo\'lmasa, har doim tashuvchingizning qadoqlash talablariga rioya qiling.'
          ]
        },
        {
          heading: 'Eslatma',
          body: `Jo'natishdan oldin buyum va qadoqlangan paketning (ichkaridan va tashqaridan) rasmlarini olishni tavsiya qilamiz. Agar xaridor jo'natish paytida biror muammo haqida xabar bersa, bu rasmlar muammoni tezroq hal qilishga yordam berishi mumkin.`
        }
      ]
    }
  },

  // ─── 3. Returning an Item ─────────────────────────
  {
    id: 'returning-item',
    slug: 'returning-an-item',
    icon: '',
    category: 'buying',
    en: {
      title: 'Returning an Item',
      sections: [
        {
          heading: null,
          body: `When you make a purchase using the "Buy now" button, you're covered by our <a href="#/help/buyer-protection-fee" class="help-link">Buyer Protection</a> and <a href="#/help/refund-policy" class="help-link">Refund Policy</a>.`
        },
        {
          heading: null,
          body: `This means we can help you return an item for a refund if it's <a href="#/help/significantly-not-as-described" class="help-link">significantly not as described (SNAD)</a>. If an item doesn't fit you or you don't like it, you can only return it if your seller agrees to refund you.`
        },
        {
          heading: null,
          body: `If you don't use the "Buy now" button to make a purchase, you'll need to discuss the return and refund options directly with your seller as Buyer Protection won't apply.`
        },
        {
          heading: 'Press "I have an issue" & submit a refund request',
          body: `<strong>1. Press "I have an issue"</strong> in your conversation screen with the seller within 2 days from being notified by ReUz that the item should have been delivered.`,
        },
        {
          heading: null,
          body: `If you don't report any issues within this time (or if you press "Everything is OK"), the order will be completed automatically and your payment sent to the seller.`
        },
        {
          heading: null,
          body: `<strong>2. Provide proof</strong><br><br>Attach photos of the item and explain your issue to the seller. This should include:`,
          bullets: [
            'The item with the damaged parts visible',
            'The item\'s packaging showing its damaged parts',
            'The item\'s parts that do not match the item description'
          ]
        },
        {
          heading: null,
          body: `When ready, press "Send to seller" to submit a refund request. Once you submit a refund request, your order will be suspended to keep your money safe until the issue is resolved.`
        },
        {
          heading: null,
          body: `<strong>3. Talk to the seller — find a resolution</strong><br><br>Discuss the return and refund options with the seller. The seller can:`,
          bullets: [
            '<strong>Offer you a partial refund</strong> (not available for bundles): The seller offers an amount to resolve the issue — you can choose to accept or decline it. If you accept the offer, you will keep the item and receive a partial refund of the item\'s price, the Buyer Protection fee, and sales tax, along with a full refund of any applicable customs tax.',
            '<strong>Offer you a full refund:</strong> You\'ll keep the order and get a full refund of the above-mentioned fees and taxes.',
            '<strong>Ask you for a return:</strong> You\'ll need to return any reported items in time to get a refund for them.'
          ]
        },
        {
          heading: 'Return the item for a refund',
          body: `If the seller requests a return, press "Return the order" to check your options. You can either:`,
          bullets: [
            'Use an integrated shipping option on ReUz for the return (if available for your order)',
            'Select a shipping provider for the return and get a ReUz-generated shipping label or code',
            'Arrange your own tracked return and pay for shipping separately (please note that this option is only available for local shipping)'
          ]
        },
        {
          heading: null,
          body: `Use a shipping provider with tracked shipping and share the following with the seller:`,
          bullets: [
            'A valid tracking number of the package',
            'A photo of the item in the packaging',
            'A photo of the shipping label (with visible tracking number, and both sender and recipient names and addresses)'
          ]
        },
        {
          heading: null,
          body: `The buyer usually covers the cost of return shipping. However, you can discuss it with the seller and they can offer to pay for it when requesting a return. Ask the seller for their contact details if your shipping provider requires them.`
        },
        {
          heading: null,
          body: `If you can't find an agreement with the seller or they're not communicating, you can contact us to help find a solution. Once you've confirmed the return option, you must proceed with the return — you can't change your selection or cancel the refund request.`
        },
        {
          heading: 'Pack the return',
          body: `Pack the package securely so it returns safely. Make sure to return everything in the same condition as you received it (i.e. you shouldn't wash or use the item). Include all contents from the original package (e.g. receipts, labels, dust bags). See our guide on <a href="#/help/packing-an-item" class="help-link">packing an item</a>.`
        },
        {
          heading: 'Time limit to return an order',
          body: `Once the seller requests a return, you'll have <strong>5 business days</strong> to send the package. If you don't send it in time, your refund request will be closed and your payment will be released to the seller.`
        },
        {
          heading: 'Bundles',
          body: `If all the items in a bundle are SNAD, you'll need to return the whole order. If only part of the bundle is SNAD, you'll only need to return the items you reported (unless they're confirmed as counterfeit).`
        },
        {
          heading: 'Electronic devices',
          body: `If you find that your electronic item is still linked to the seller's account, you may need to raise an issue following the steps described above. If you purchased an electronic device and have used it, make sure to delete any personal data and disconnect your personal accounts (such as Samsung, Google, or Apple accounts). Check if there's a "factory reset" option to return the device to its original state.`
        },
        {
          heading: 'Get your refund',
          body: `When the seller receives the package, they will have <strong>2 days</strong> to confirm whether everything's OK with the item. Once they press "Everything is OK" (or the 2-day deadline ends), you'll <a href="#/help/receiving-a-refund" class="help-link">receive a refund</a>. The refund is made up of:`,
          bullets: [
            'The price of any returned items',
            'The Buyer Protection fee for any returned items',
            'The initial shipping fee you paid to get the order',
            'Sales tax',
            'Customs tax (for international shipping only)'
          ]
        },
        {
          heading: null,
          body: `The refunded Buyer Protection fee is calculated based on the items that you keep, and we'll refund you the difference. Also, any offers, discounts, and vouchers used during purchase are subtracted from your refund. The amount subtracted is proportional to the price of any refunded items.`
        },
        {
          heading: 'Returning an item for other reasons',
          body: `If you want to return an item and get a refund because it doesn't fit or you don't like it, you'll need to discuss this with your seller. It's the seller's choice to accept returns or not.`
        },
        {
          heading: 'Return the order',
          body: `If the seller agrees to a return, you can use any shipping option available to send it back. We recommend using an integrated shipping option. Ask the seller for their contact details if your shipping provider requires them. If you can't find an agreement with the seller or they're not communicating, you can contact us to help find a solution. You should pay for any applicable shipping costs (unless agreed otherwise).`
        },
        {
          heading: 'Pack the return',
          body: `Pack the package securely so it returns safely. Make sure to return everything in the same condition as you received it (i.e. you shouldn't wash or use the item). Include all contents from the original package (e.g. receipts, labels, dust bags). See our guide on <a href="#/help/packing-an-item" class="help-link">packing an item</a>.`
        },
        {
          heading: 'Time limit to return an order',
          body: `Once the seller provides their return address and contact details, you'll have <strong>5 business days</strong> to send the package.`
        }
      ]
    },
    uz: {
      title: 'Buyumni Qaytarish',
      sections: [
        {
          heading: null,
          body: `"Sotib olish" tugmasidan foydalanib xarid qilganingizda, siz bizning <a href="#/help/buyer-protection-fee" class="help-link">Xaridor Himoyasi</a> va <a href="#/help/refund-policy" class="help-link">Qaytarish Siyosati</a> bilan himoyalangansiz.`
        },
        {
          heading: null,
          body: `Bu siz <a href="#/help/significantly-not-as-described" class="help-link">tavsifga sezilarli mos kelmaydigan (SNAD)</a> buyumni qaytarish uchun pul qaytarib olishingizga yordam berishimiz mumkinligini anglatadi. Agar buyum sizga mos kelmasa yoki yoqmasa, uni faqat sotuvchi qaytarishga rozi bo'lsagina qaytarishingiz mumkin.`
        },
        {
          heading: null,
          body: `Agar xarid qilish uchun "Sotib olish" tugmasidan foydalanmasangiz, qaytarish va pul qaytarish variantlarini bevosita sotuvchingiz bilan muhokama qilishingiz kerak bo'ladi, chunki Xaridor Himoyasi qo'llanilmaydi.`
        },
        {
          heading: '"Muammo bor" tugmasini bosing va qaytarish so\'rovini yuboring',
          body: `<strong>1. "Muammo bor" tugmasini bosing</strong> — sotuvchi bilan suhbat ekranida, ReUz tomonidan buyum yetkazilishi kerakligi haqida xabar berilganidan 2 kun ichida.`
        },
        {
          heading: null,
          body: `Agar shu vaqt ichida biror muammo haqida xabar bermasangiz (yoki "Hammasi yaxshi" tugmasini bossangiz), buyurtma avtomatik bajariladi va to'lovingiz sotuvchiga yuboriladi.`
        },
        {
          heading: null,
          body: `<strong>2. Dalil taqdim eting</strong><br><br>Buyumning rasmlarini biriktiring va muammoingizni sotuvchiga tushuntiring. Bu quyidagilarni o'z ichiga olishi kerak:`,
          bullets: [
            'Shikastlangan qismlari ko\'rinib turgan buyum',
            'Shikastlangan qismlarini ko\'rsatuvchi buyum qadoqlashi',
            'Buyum tavsifiga mos kelmaydigan buyum qismlari'
          ]
        },
        {
          heading: null,
          body: `Tayyor bo'lgach, qaytarish so'rovini yuborish uchun "Sotuvchiga yuborish" tugmasini bosing. Qaytarish so'rovini yuborganingizdan so'ng, muammo hal qilinguncha pulingizni himoya qilish uchun buyurtmangiz to'xtatiladi.`
        },
        {
          heading: null,
          body: `<strong>3. Sotuvchi bilan gaplashing — yechim toping</strong><br><br>Qaytarish va pul qaytarish variantlarini sotuvchi bilan muhokama qiling. Sotuvchi:`,
          bullets: [
            '<strong>Qisman qaytarish taklif qilishi mumkin</strong> (to\'plamlar uchun mavjud emas): Sotuvchi muammoni hal qilish uchun summa taklif qiladi — siz qabul qilishingiz yoki rad etishingiz mumkin.',
            '<strong>To\'liq qaytarish taklif qilishi mumkin:</strong> Siz buyurtmani saqlaysiz va yuqorida aytilgan to\'lovlar va soliqlarning to\'liq qaytarilishini olasiz.',
            '<strong>Qaytarishni so\'rashi mumkin:</strong> Pul qaytarib olish uchun xabar berilgan buyumlarni o\'z vaqtida qaytarishingiz kerak bo\'ladi.'
          ]
        },
        {
          heading: 'Pul qaytarib olish uchun buyumni qaytaring',
          body: `Agar sotuvchi qaytarishni so'rasa, variantlaringizni tekshirish uchun "Buyurtmani qaytarish" tugmasini bosing. Siz:`,
          bullets: [
            'Qaytarish uchun ReUz\'dagi integratsiyalangan jo\'natish variantidan foydalanishingiz mumkin (buyurtmangiz uchun mavjud bo\'lsa)',
            'Qaytarish uchun jo\'natish provayderini tanlang va ReUz tomonidan yaratilgan jo\'natish yorlig\'i yoki kodini oling',
            'O\'zingizning kuzatiladigan qaytarishingizni tashkil qiling va jo\'natish uchun alohida to\'lang (iltimos, bu variant faqat mahalliy jo\'natish uchun mavjud ekanligini yodda tuting)'
          ]
        },
        {
          heading: null,
          body: `Kuzatiladigan jo'natish bilan jo'natish provayderidan foydalaning va sotuvchi bilan quyidagilarni ulashing:`,
          bullets: [
            'Paketning amaldagi kuzatuv raqami',
            'Qadoqlashdagi buyumning rasmi',
            'Jo\'natish yorlig\'ining rasmi (ko\'rinadigan kuzatuv raqami va jo\'natuvchi hamda qabul qiluvchining ismlari va manzillari bilan)'
          ]
        },
        {
          heading: null,
          body: `Qaytarish jo'natish xarajatlarini odatda xaridor o'z zimmasiga oladi. Biroq, siz buni sotuvchi bilan muhokama qilishingiz mumkin va ular qaytarishni so'raganda to'lashni taklif qilishlari mumkin.`
        },
        {
          heading: null,
          body: `Agar sotuvchi bilan kelishuv topa olmasangiz yoki ular bog'lanmasa, yechim topishga yordam berish uchun biz bilan bog'lanishingiz mumkin. Qaytarish variantini tasdiqlaganingizdan so'ng, qaytarishni davom ettirishingiz kerak — tanlovingizni o'zgartira olmaysiz yoki qaytarish so'rovini bekor qila olmaysiz.`
        },
        {
          heading: 'Qaytarishni qadoqlang',
          body: `Paketni xavfsiz qaytarilishi uchun puxta qadoqlang. Hamma narsani olganingizdek qaytarishga ishonch hosil qiling (ya'ni buyumni yuvmasligingiz yoki ishlatmasligingiz kerak). Asl paketdagi barcha tarkibni o'z ichiga oling. <a href="#/help/packing-an-item" class="help-link">Buyumni qadoqlash</a> bo'yicha qo'llanmamizni ko'ring.`
        },
        {
          heading: 'Buyurtmani qaytarish uchun muddat',
          body: `Sotuvchi qaytarishni so'raganidan so'ng, paketni jo'natish uchun <strong>5 ish kuningiz</strong> bor. Agar o'z vaqtida jo'natmasangiz, qaytarish so'rovingiz yopiladi va to'lovingiz sotuvchiga chiqariladi.`
        },
        {
          heading: 'To\'plamlar',
          body: `To'plamdagi barcha buyumlar SNAD bo'lsa, butun buyurtmani qaytarishingiz kerak bo'ladi. Agar to'plamning faqat bir qismi SNAD bo'lsa, faqat xabar bergan buyumlaringizni qaytarishingiz kerak bo'ladi (agar ular soxta deb tasdiqlangan bo'lmasa).`
        },
        {
          heading: 'Elektron qurilmalar',
          body: `Agar elektron buyumingiz hali ham sotuvchining hisobiga ulangan bo'lsa, yuqorida tasvirlangan qadamlarni bajarib muammo ko'tarishingiz kerak bo'lishi mumkin. Agar elektron qurilma sotib olib ishlatgan bo'lsangiz, shaxsiy ma'lumotlarni o'chirib, shaxsiy hisoblaringizni uzishga ishonch hosil qiling.`
        },
        {
          heading: 'Pulingizni qaytarib oling',
          body: `Sotuvchi paketni olganida, buyum bilan hammasi yaxshimi tekshirish uchun <strong>2 kun</strong> muddati bor. "Hammasi yaxshi" tugmasini bosgach (yoki 2 kunlik muddat tugagach), siz <a href="#/help/receiving-a-refund" class="help-link">pul qaytarib olasiz</a>. Qaytarish quyidagilardan iborat:`,
          bullets: [
            'Qaytarilgan buyumlarning narxi',
            'Qaytarilgan buyumlar uchun Xaridor Himoyasi to\'lovi',
            'Buyurtmani olish uchun to\'lagan dastlabki jo\'natish to\'lovi',
            'Sotuv solig\'i',
            'Bojxona solig\'i (faqat xalqaro jo\'natish uchun)'
          ]
        },
        {
          heading: null,
          body: `Qaytarilgan Xaridor Himoyasi to'lovi siz saqlab qolgan buyumlar asosida hisoblanadi va biz sizga farqni qaytaramiz. Shuningdek, xarid paytida ishlatilgan takliflar, chegirmalar va vaucherlar qaytarishingizdan chegiriladi.`
        },
        {
          heading: 'Boshqa sabablarga ko\'ra buyumni qaytarish',
          body: `Agar buyumni mos kelmagani yoki yoqmagani uchun qaytarmoqchi bo'lsangiz, buni sotuvchingiz bilan muhokama qilishingiz kerak bo'ladi. Qaytarishni qabul qilish yoki qilmaslik sotuvchining tanlovidir.`
        },
        {
          heading: 'Buyurtmani qaytaring',
          body: `Agar sotuvchi qaytarishga rozi bo'lsa, qaytarish uchun mavjud bo'lgan har qanday jo'natish variantidan foydalanishingiz mumkin. Integratsiyalangan jo'natish variantidan foydalanishni tavsiya qilamiz. Agar kelishuv topa olmasangiz, yechim topish uchun biz bilan bog'laning. Tegishli jo'natish xarajatlarini to'lashingiz kerak (boshqacha kelishilmagan bo'lsa).`
        },
        {
          heading: 'Qaytarishni qadoqlang',
          body: `Paketni xavfsiz qaytarilishi uchun puxta qadoqlang. Hamma narsani olganingizdek qaytarishga ishonch hosil qiling. <a href="#/help/packing-an-item" class="help-link">Buyumni qadoqlash</a> bo'yicha qo'llanmamizni ko'ring.`
        },
        {
          heading: 'Buyurtmani qaytarish uchun muddat',
          body: `Sotuvchi qaytarish manzili va aloqa ma'lumotlarini taqdim etganidan so'ng, paketni jo'natish uchun <strong>5 ish kuningiz</strong> bor.`
        }
      ]
    }
  },

  // ─── 4. Significantly Not as Described ─────────────
  {
    id: 'snad-items',
    slug: 'significantly-not-as-described',
    icon: '',
    category: 'buying',
    en: {
      title: '"Significantly Not as Described" Items at ReUz',
      sections: [
        {
          heading: null,
          body: `Items that don't match their listing description or photos are considered "significantly not as described" (or SNAD).`
        },
        {
          heading: 'What is considered SNAD?',
          body: `Here are the main cases that would be considered SNAD:`,
          bullets: [
            'Wrong colour',
            'Incorrect size',
            'Missing item parts and/or accessories that weren\'t detailed in the listing description or photos',
            'Bundles with missing items',
            'A damaged item (stained, ripped, broken or damaged in any other way) that wasn\'t detailed in the description or photos',
            'Different main materials from the listing (if at least one is inaccurate)',
            'Counterfeit',
            'Any other visible flaw that wasn\'t detailed in the listing',
            'Functionality not as described (e.g. console not connecting to the TV, accessory not pairing, device not charging, buttons or touchscreen not working)'
          ]
        },
        {
          heading: 'What is not SNAD?',
          body: null,
          bullets: [
            'Items that you don\'t like or that don\'t fit you',
            'Minor differences to an item that don\'t affect its use or look (slight colour differences due to lighting; in case of multi-material items, differences in the additional materials not listed among the main 3 in the description, etc.)'
          ]
        },
        {
          heading: null,
          body: `See how to <a href="#/help/returning-an-item" class="help-link">return an item</a> for a refund if it's significantly not as described (SNAD).`
        }
      ]
    },
    uz: {
      title: 'ReUz\'da "Tavsifga Sezilarli Mos Kelmaydigan" Buyumlar',
      sections: [
        {
          heading: null,
          body: `E'lon tavsifi yoki rasmlariga mos kelmaydigan buyumlar "tavsifga sezilarli mos kelmaydi" (yoki SNAD) hisoblanadi.`
        },
        {
          heading: 'SNAD deb nima hisoblanadi?',
          body: `SNAD deb hisoblanadiigan asosiy holatlar:`,
          bullets: [
            'Noto\'g\'ri rang',
            'Noto\'g\'ri o\'lcham',
            'E\'lon tavsifi yoki rasmlarida batafsil ko\'rsatilmagan buyum qismlari va/yoki aksessuarlar yo\'qligi',
            'Buyumlari yetishmaydigan to\'plamlar',
            'Tavsif yoki rasmlarda batafsil ko\'rsatilmagan shikastlangan buyum (dog\'li, yirtilgan, singan yoki boshqa tarzda shikastlangan)',
            'E\'londagi asosiy materiallardan farq qiladigan materiallar (kamida bittasi noto\'g\'ri bo\'lsa)',
            'Soxta',
            'E\'londa batafsil ko\'rsatilmagan boshqa har qanday ko\'rinadigan nuqson',
            'Funksionallik tavsifga mos kelmaydi (masalan, konsol televizorga ulanmaydi, aksessuar juftlanmaydi, qurilma zaryadlanmaydi, tugmalar yoki sensorli ekran ishlamaydi)'
          ]
        },
        {
          heading: 'SNAD deb nima HISOBLANMAYDI?',
          body: null,
          bullets: [
            'Yoqmagan yoki mos kelmaydigan buyumlar',
            'Buyumning foydalanishi yoki ko\'rinishiga ta\'sir qilmaydigan kichik farqlar (yoritish tufayli rang farqlari; ko\'p materialli buyumlarda tavsifda ko\'rsatilmagan qo\'shimcha materiallardagi farqlar va boshqalar)'
          ]
        },
        {
          heading: null,
          body: `Tavsifga sezilarli mos kelmasa pul qaytarib olish uchun <a href="#/help/returning-an-item" class="help-link">buyumni qanday qaytarish</a> mumkinligini ko'ring.`
        }
      ]
    }
  },

  // ─── 5. Canceling an Order ─────────────────────────
  {
    id: 'canceling-order',
    slug: 'canceling-an-order',
    icon: '',
    category: 'buying',
    en: {
      title: 'Canceling an Order',
      sections: [
        {
          heading: null,
          body: `An order can only be cancelled (by either the buyer or the seller) if the item hasn't been shipped yet.`
        },
        {
          heading: 'To cancel an order',
          body: null,
          bullets: [
            'Open your conversation with the other member',
            'Press the ⓘ symbol in the top-right corner',
            'Choose <strong>Cancel order</strong> and select a reason from the list, or choose <strong>Other</strong> and give more details'
          ]
        },
        {
          heading: null,
          body: `The seller might have to confirm the cancellation if they've already sent the order, but the tracking information hasn't been updated yet. If they don't confirm the cancellation, please wait until the order is cancelled automatically.`
        },
        {
          heading: 'Note',
          body: `If you cancel an order manually, you might receive automatic negative feedback. To avoid it, inform the other member before canceling the order and reach a mutual agreement. Then they will be able to edit or delete the feedback. Additionally, buyers can wait until the order is cancelled automatically instead of canceling it themselves.`
        },
        {
          heading: 'Good to know',
          body: `After an order is cancelled, sellers can press <strong>Re-upload item</strong> in their conversation screen to put the item on sale again. In certain cases, we may cancel an order too.`
        },
        {
          heading: 'Order was canceled. What happened?',
          body: `There are several possible reasons why an order may get cancelled. It can happen either if we receive no tracking details or due to issues after the item is sent.`
        },
        {
          heading: 'No tracking details',
          body: `The order will get cancelled if the seller:`,
          bullets: [
            'Doesn\'t download the shipping label in 4 business days',
            'Doesn\'t send the item or doesn\'t press the "Item sent" button in 5 business days',
            'Uses a ReUz-generated shipping label and marks the item as sent, but no package location info appears on ReUz for 4 business days. This can happen for various reasons, such as: seller choosing a wrong shipping method (not what the buyer paid for) or seller not shipping the package'
          ]
        },
        {
          heading: null,
          body: `The cancellation might not occur immediately, but within a week after the time frames stated above are missed. However, sending an item after the indicated deadline will not avoid the eventual cancellation. The buyer will then <a href="#/help/receiving-a-refund" class="help-link">receive a refund</a>. After the cancellation, the seller can re-upload the same item and sell it again, assuming it hasn't been sent yet.`
        },
        {
          heading: null,
          body: `As long as the item isn't sent, the buyer and the seller can cancel an order too.`
        },
        {
          heading: 'When the item is sent',
          body: `We may cancel an order if the item is:`,
          bullets: [
            'Lost in transit, or returned to seller',
            'Damaged in transit',
            '<a href="#/help/significantly-not-as-described" class="help-link">Significantly not as described</a> in the listing'
          ]
        },
        {
          heading: null,
          body: `The buyer may also cancel the order if the package is lost, assuming they've chosen a tracked shipping method.`
        }
      ]
    },
    uz: {
      title: 'Buyurtmani Bekor Qilish',
      sections: [
        {
          heading: null,
          body: `Buyurtma faqat buyum hali jo'natilmagan bo'lsa (xaridor yoki sotuvchi tomonidan) bekor qilinishi mumkin.`
        },
        {
          heading: 'Buyurtmani bekor qilish',
          body: null,
          bullets: [
            'Boshqa a\'zo bilan suhbatingizni oching',
            'Yuqori o\'ng burchakdagi ⓘ belgisini bosing',
            '<strong>Buyurtmani bekor qilish</strong> ni tanlang va ro\'yxatdan sabab tanlang, yoki <strong>Boshqa</strong> ni tanlang va batafsil ma\'lumot bering'
          ]
        },
        {
          heading: null,
          body: `Agar sotuvchi buyurtmani allaqachon jo'natgan bo'lsa, lekin kuzatuv ma'lumotlari yangilanmagan bo'lsa, bekor qilishni tasdiqlashi kerak bo'lishi mumkin. Agar ular bekor qilishni tasdiqlamasa, buyurtma avtomatik bekor qilinguncha kuting.`
        },
        {
          heading: 'Eslatma',
          body: `Agar buyurtmani qo'lda bekor qilsangiz, avtomatik salbiy fikr olishingiz mumkin. Bundan qochish uchun buyurtmani bekor qilishdan oldin boshqa a'zoni xabardor qiling va o'zaro kelishuvga keling. Shuningdek, xaridorlar o'zlari bekor qilish o'rniga buyurtma avtomatik bekor qilinguncha kutishlari mumkin.`
        },
        {
          heading: 'Bilish foydali',
          body: `Buyurtma bekor qilinganidan so'ng, sotuvchilar buyumni qayta sotuvga qo'yish uchun suhbat ekranida <strong>Buyumni qayta yuklash</strong> tugmasini bosishlari mumkin. Ba'zi hollarda biz ham buyurtmani bekor qilishimiz mumkin.`
        },
        {
          heading: 'Buyurtma bekor qilindi. Nima bo\'ldi?',
          body: `Buyurtma bekor qilinishining bir nechta mumkin sabablari bor. Bu kuzatuv tafsilotlarini olmasak yoki buyum jo'natilganidan keyingi muammolar tufayli sodir bo'lishi mumkin.`
        },
        {
          heading: 'Kuzatuv tafsilotlari yo\'q',
          body: `Agar sotuvchi quyidagilarni bajarsa, buyurtma bekor qilinadi:`,
          bullets: [
            'Jo\'natish yorlig\'ini 4 ish kuni ichida yuklab olmasa',
            'Buyumni jo\'natmasa yoki "Buyum jo\'natildi" tugmasini 5 ish kuni ichida bosmasa',
            'ReUz tomonidan yaratilgan jo\'natish yorlig\'idan foydalansa va buyumni jo\'natilgan deb belgilasa, lekin 4 ish kuni davomida ReUz\'da paket joylashuvi ma\'lumotlari ko\'rinmasa'
          ]
        },
        {
          heading: null,
          body: `Bekor qilish darhol sodir bo'lmasligi mumkin, lekin yuqorida ko'rsatilgan muddatlar o'tkazib yuborilganidan keyin bir hafta ichida. Xaridor keyin <a href="#/help/receiving-a-refund" class="help-link">pul qaytarib oladi</a>. Bekor qilganidan so'ng, sotuvchi buyum hali jo'natilmagan bo'lsa, xuddi shu buyumni qayta yuklashi va sotishi mumkin.`
        },
        {
          heading: null,
          body: `Buyum jo'natilmagan ekan, xaridor ham, sotuvchi ham buyurtmani bekor qilishi mumkin.`
        },
        {
          heading: 'Buyum jo\'natilganda',
          body: `Agar buyum quyidagi bo'lsa, biz buyurtmani bekor qilishimiz mumkin:`,
          bullets: [
            'Yo\'lda yo\'qolgan yoki sotuvchiga qaytarilgan',
            'Yo\'lda shikastlangan',
            'E\'londa <a href="#/help/significantly-not-as-described" class="help-link">tavsifga sezilarli mos kelmaydi</a>'
          ]
        },
        {
          heading: null,
          body: `Agar paket yo'qolgan bo'lsa va kuzatiladigan jo'natish usulini tanlagan bo'lsa, xaridor buyurtmani bekor qilishi mumkin.`
        }
      ]
    }
  },

  // ─── 6. Receiving a Refund ─────────────────────────
  {
    id: 'receiving-refund',
    slug: 'receiving-a-refund',
    icon: '',
    category: 'buying',
    en: {
      title: 'Receiving a Refund',
      sections: [
        {
          heading: 'Note',
          body: `A refund is issued after the order is canceled. If the seller hasn't shipped the item yet, you can <a href="#/help/canceling-an-order" class="help-link">cancel the order yourself</a>. Otherwise, please check the <a href="#/help/refund-policy" class="help-link">ReUz Refund Policy</a>.`
        },
        {
          heading: null,
          body: `Refunds are issued to the same e-wallet or account that you used to pay for the order. The refund processing time and where it will appear is also determined by the payment method you used.`
        },
        {
          heading: 'Refund time by payment method',
          body: null,
          bullets: [
            '<strong>ReUz Wallet:</strong> Instant',
            '<strong>Credit or debit card:</strong> 3–5 business days',
            '<strong>Apple Pay:</strong> 3–5 business days',
            '<strong>Google Pay:</strong> 3–5 business days'
          ]
        },
        {
          heading: 'Refunds frequently asked questions',
          body: null
        },
        {
          heading: null,
          body: `<strong>"I only see part of my refund. Where is the rest?"</strong><br><br>This typically happens when two payment methods were used to pay for the item, such as your ReUz Wallet and a credit or debit card. Try checking both your ReUz Wallet and the other payment method used to see if the missing funds were issued in both places. Keep in mind that refunds issued to your bank account will take longer to transfer.`
        },
        {
          heading: null,
          body: `<strong>"Will I get a refund for a pending payment?"</strong><br><br>If your payment fails, your account may still be charged (or the amount may be held as a pending payment). If this happens you will always be fully refunded. Even if you accidentally pay twice, we'll refund the second payment.`
        },
        {
          heading: null,
          body: `<strong>"How do I request a refund?"</strong><br><br>Learn more about <a href="#/help/returning-an-item" class="help-link">how to get a refund here</a>. You can also go to the Help Center homepage and select a recent order from the top of the page to get order-specific information.`
        },
        {
          heading: 'Good to know',
          body: `Your refund will fully cover your expenses. This includes the item's price, shipping cost, and the <a href="#/help/buyer-protection-fee" class="help-link">Buyer Protection fee</a>. Business days are Monday to Friday, excluding public holidays.`
        }
      ]
    },
    uz: {
      title: 'Pul Qaytarib Olish',
      sections: [
        {
          heading: 'Eslatma',
          body: `Buyurtma bekor qilinganidan so'ng pul qaytariladi. Agar sotuvchi buyumni hali jo'natmagan bo'lsa, <a href="#/help/canceling-an-order" class="help-link">buyurtmani o'zingiz bekor qilishingiz mumkin</a>. Aks holda, <a href="#/help/refund-policy" class="help-link">ReUz Qaytarish Siyosati</a>ni tekshiring.`
        },
        {
          heading: null,
          body: `Qaytarishlar buyurtma uchun to'lash uchun foydalangan o'sha elektron hamyon yoki hisobga beriladi. Qaytarish vaqti va u qayerda paydo bo'lishi ham siz foydalangan to'lov usuli bilan belgilanadi.`
        },
        {
          heading: 'To\'lov usuli bo\'yicha qaytarish vaqti',
          body: null,
          bullets: [
            '<strong>ReUz Hamyon:</strong> Darhol',
            '<strong>Kredit yoki debet karta:</strong> 3–5 ish kuni',
            '<strong>Apple Pay:</strong> 3–5 ish kuni',
            '<strong>Google Pay:</strong> 3–5 ish kuni'
          ]
        },
        {
          heading: 'Qaytarish bo\'yicha tez-tez so\'raladigan savollar',
          body: null
        },
        {
          heading: null,
          body: `<strong>"Men qaytarishning faqat bir qismini ko'ryapman. Qolgani qayerda?"</strong><br><br>Bu odatda buyum uchun ikkita to'lov usuli ishlatilganda sodir bo'ladi, masalan, ReUz Hamyoningiz va kredit yoki debet karta. Yetishmayotgan mablag'lar ikkala joyda ham berilganligini tekshirish uchun ReUz Hamyoningizni va boshqa ishlatilgan to'lov usulini tekshirib ko'ring.`
        },
        {
          heading: null,
          body: `<strong>"Kutilayotgan to'lov uchun pul qaytariladimi?"</strong><br><br>Agar to'lovingiz muvaffaqiyatsiz bo'lsa, hisobingiz baribir yechilishi mumkin (yoki summa kutilayotgan to'lov sifatida ushlab turilishi mumkin). Agar bu sodir bo'lsa, sizga har doim to'liq pul qaytariladi. Hatto tasodifan ikki marta to'lasangiz ham, ikkinchi to'lovni qaytaramiz.`
        },
        {
          heading: null,
          body: `<strong>"Pul qaytarishni qanday so'rash mumkin?"</strong><br><br><a href="#/help/returning-an-item" class="help-link">Bu yerda pul qaytarib olish</a> haqida ko'proq bilib oling. Shuningdek, buyurtmaga xos ma'lumot olish uchun Yordam Markazi bosh sahifasiga o'tishingiz va sahifa yuqorisidagi so'nggi buyurtmani tanlashingiz mumkin.`
        },
        {
          heading: 'Bilish foydali',
          body: `Qaytarishingiz xarajatlaringizni to'liq qoplaydi. Bu buyum narxi, jo'natish xarajati va <a href="#/help/buyer-protection-fee" class="help-link">Xaridor Himoyasi to'lovi</a>ni o'z ichiga oladi. Ish kunlari — dushanbadan jumaga, davlat bayramlari bundan mustasno.`
        }
      ]
    }
  },

  // ─── 7. ReUz Refund Policy ─────────────────────────
  {
    id: 'refund-policy',
    slug: 'refund-policy',
    icon: '',
    category: 'buying',
    en: {
      title: 'The ReUz Refund Policy',
      sections: [
        {
          heading: 'Overview',
          body: `At ReUz, we want every transaction to be smooth and fair. Our refund policy is designed to protect both buyers and sellers. When you use the "Buy now" button, your purchase is covered by <a href="#/help/buyer-protection-fee" class="help-link">Buyer Protection</a>.`
        },
        {
          heading: 'When can you get a refund?',
          body: `You may be eligible for a refund in the following situations:`,
          bullets: [
            'The item you received is <a href="#/help/significantly-not-as-described" class="help-link">significantly not as described</a> in the listing',
            'The item arrived damaged or defective',
            'You never received your item and the tracking shows it was not delivered',
            'The item is counterfeit or not authentic when it was listed as genuine',
            'The seller cancels the order before shipping'
          ]
        },
        {
          heading: 'How the refund process works',
          body: `When you report an issue with your order, here is what happens:`,
          bullets: [
            'You open a dispute through the order detail page within the confirmation window',
            'The seller\'s payout is placed on hold while the issue is reviewed',
            'The seller has a chance to respond — they can offer a partial refund, a full refund, or request a <a href="#/help/returning-an-item" class="help-link">return</a>',
            'If a return is agreed upon, you ship the item back to the seller',
            'Once the return is confirmed, a full refund is issued to your original payment method'
          ]
        },
        {
          heading: 'When refunds are not available',
          body: `Please note that refunds are generally not available in these cases:`,
          bullets: [
            'You simply changed your mind about the purchase',
            'The item matches the description but does not fit as expected',
            'You confirmed the order and the funds have already been released to the seller',
            'The confirmation window has expired without a dispute being opened',
            'Minor differences that do not significantly affect the item\'s value or usability'
          ]
        },
        {
          heading: 'Refund timeline',
          body: `Once a refund is approved, the processing time depends on the payment method used. Learn more about <a href="#/help/receiving-a-refund" class="help-link">receiving a refund</a> and expected timelines. Your refund will fully cover your expenses — this includes the item's price, shipping cost, and the Buyer Protection fee.`
        },
        {
          heading: 'Canceling an order',
          body: `If the item hasn't been shipped yet, both buyers and sellers can <a href="#/help/canceling-an-order" class="help-link">cancel the order</a>. A full refund is issued automatically when an order is cancelled.`
        }
      ]
    },
    uz: {
      title: 'ReUz Qaytarish Siyosati',
      sections: [
        {
          heading: 'Umumiy ma\'lumot',
          body: `ReUz\'da biz har bir tranzaksiyaning silliq va adolatli bo'lishini xohlaymiz. Bizning qaytarish siyosatimiz xaridorlarni ham, sotuvchilarni ham himoya qilish uchun mo'ljallangan. "Sotib olish" tugmasidan foydalanganingizda, xaridingiz <a href="#/help/buyer-protection-fee" class="help-link">Xaridor Himoyasi</a> bilan himoyalangan.`
        },
        {
          heading: 'Qachon pul qaytarib olish mumkin?',
          body: `Quyidagi hollarda pul qaytarib olish huquqiga ega bo'lishingiz mumkin:`,
          bullets: [
            'Qabul qilgan buyumingiz e\'londa <a href="#/help/significantly-not-as-described" class="help-link">tavsifga sezilarli mos kelmaydi</a>',
            'Buyum shikastlangan yoki nuqsonli holda yetib keldi',
            'Buyumingizni hech qachon olmadingiz va kuzatuv yetkazilmaganligini ko\'rsatadi',
            'Buyum haqiqiy deb ko\'rsatilgan bo\'lsa-da, soxta yoki asl emas',
            'Sotuvchi jo\'natishdan oldin buyurtmani bekor qiladi'
          ]
        },
        {
          heading: 'Qaytarish jarayoni qanday ishlaydi',
          body: `Buyurtmangiz bilan muammo haqida xabar berganingizda, quyidagilar sodir bo'ladi:`,
          bullets: [
            'Tasdiqlash oynasi ichida buyurtma tafsilotlari sahifasi orqali nizo ochasiz',
            'Muammo ko\'rib chiqilayotganda sotuvchining to\'lovi to\'xtatiladi',
            'Sotuvchi javob berishi mumkin — qisman qaytarish, to\'liq qaytarish taklif qilishi yoki <a href="#/help/returning-an-item" class="help-link">qaytarish</a> so\'rashi mumkin',
            'Qaytarish kelishilsa, buyumni sotuvchiga qaytarib jo\'natasiz',
            'Qaytarish tasdiqlangach, asl to\'lov usulingizga to\'liq pul qaytariladi'
          ]
        },
        {
          heading: 'Qaytarish mumkin bo\'lmagan holatlar',
          body: `Quyidagi hollarda qaytarish odatda mavjud emasligini yodda tuting:`,
          bullets: [
            'Xarid qilish haqidagi fikringizni o\'zgartirdingiz',
            'Buyum tavsifga mos keladi, lekin kutilganidek mos kelmaydi',
            'Buyurtmani tasdiqladingiz va mablag\'lar allaqachon sotuvchiga chiqarilgan',
            'Tasdiqlash oynasi nizo ochilmasdan tugagan',
            'Buyumning qiymatiga yoki foydalanilishiga sezilarli ta\'sir qilmaydigan kichik farqlar'
          ]
        },
        {
          heading: 'Qaytarish muddati',
          body: `Qaytarish tasdiqlangandan so'ng, qayta ishlash vaqti foydalangan to'lov usuliga bog'liq. <a href="#/help/receiving-a-refund" class="help-link">Pul qaytarib olish</a> va kutilayotgan muddatlar haqida ko'proq bilib oling. Qaytarishingiz xarajatlaringizni to'liq qoplaydi — bu buyum narxi, jo'natish xarajati va Xaridor Himoyasi to'lovini o'z ichiga oladi.`
        },
        {
          heading: 'Buyurtmani bekor qilish',
          body: `Agar buyum hali jo'natilmagan bo'lsa, xaridorlar ham, sotuvchilar ham <a href="#/help/canceling-an-order" class="help-link">buyurtmani bekor qilishi</a> mumkin. Buyurtma bekor qilinganda avtomatik ravishda to'liq pul qaytariladi.`
        }
      ]
    }
  }
];

export function getArticleBySlug(slug) {
  return HELP_ARTICLES.find(a => a.slug === slug);
}

export function getArticlesByCategory(category) {
  return HELP_ARTICLES.filter(a => a.category === category);
}
