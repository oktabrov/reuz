// ==========================================
// ReUz — Deep Nested Category Tree
// ==========================================

export const CATEGORY_TREE = [
  {
    id: 'women', icon: '',
    children: [
      {
        id: 'w_clothing', 
        children: [
          { id: 'w_dresses', children: [
            { id: 'w_mini_dresses' }, { id: 'w_midi_dresses' }, { id: 'w_maxi_dresses' },
            { id: 'w_evening_dresses' }, { id: 'w_casual_dresses' }, { id: 'w_shirt_dresses' }
          ]},
          { id: 'w_tops', children: [
            { id: 'w_tshirts' }, { id: 'w_blouses' }, { id: 'w_tanks' },
            { id: 'w_crop_tops' }, { id: 'w_bodysuits' }, { id: 'w_sweaters' }
          ]},
          { id: 'w_bottoms', children: [
            { id: 'w_jeans' }, { id: 'w_trousers' }, { id: 'w_skirts' },
            { id: 'w_shorts' }, { id: 'w_leggings' }
          ]},
          { id: 'w_outerwear', children: [
            { id: 'w_coats' }, { id: 'w_jackets' }, { id: 'w_blazers' },
            { id: 'w_vests' }, { id: 'w_puffers' }
          ]},
          { id: 'w_activewear', children: [
            { id: 'w_sports_bras' }, { id: 'w_sports_tops' }, { id: 'w_sports_leggings' }
          ]},
          { id: 'w_swimwear' },
          { id: 'w_lingerie' },
          { id: 'w_maternity' }
        ]
      },
      {
        id: 'w_shoes',
        children: [
          { id: 'w_sneakers' }, { id: 'w_heels' }, { id: 'w_boots' },
          { id: 'w_sandals' }, { id: 'w_flats' }, { id: 'w_loafers' },
          { id: 'w_platforms' }, { id: 'w_slippers' }
        ]
      },
      {
        id: 'w_bags',
        children: [
          { id: 'w_handbags' }, { id: 'w_shoulder_bags' }, { id: 'w_crossbody' },
          { id: 'w_tote_bags' }, { id: 'w_clutches' }, { id: 'w_backpacks' },
          { id: 'w_wallets_w' }
        ]
      },
      {
        id: 'w_accessories',
        children: [
          { id: 'w_jewelry' }, { id: 'w_watches_w' }, { id: 'w_sunglasses_w' },
          { id: 'w_scarves' }, { id: 'w_hats' }, { id: 'w_belts_w' }
        ]
      },
      { id: 'w_beauty' }
    ]
  },
  {
    id: 'men', icon: '',
    children: [
      {
        id: 'm_clothing',
        children: [
          { id: 'm_tshirts', children: [
            { id: 'm_graphic_tees' }, { id: 'm_plain_tees' }, { id: 'm_polo_shirts' },
            { id: 'm_long_sleeve' }
          ]},
          { id: 'm_shirts', children: [
            { id: 'm_casual_shirts' }, { id: 'm_dress_shirts' }, { id: 'm_flannel' }
          ]},
          { id: 'm_bottoms', children: [
            { id: 'm_jeans' }, { id: 'm_chinos' }, { id: 'm_joggers' },
            { id: 'm_shorts' }, { id: 'm_trousers' }
          ]},
          { id: 'm_outerwear', children: [
            { id: 'm_jackets' }, { id: 'm_coats' }, { id: 'm_hoodies' },
            { id: 'm_blazers' }, { id: 'm_puffers' }, { id: 'm_bombers' }
          ]},
          { id: 'm_suits', children: [
            { id: 'm_suit_jackets' }, { id: 'm_suit_trousers' }, { id: 'm_full_suits' }
          ]},
          { id: 'm_activewear' },
          { id: 'm_swimwear' },
          { id: 'm_underwear' }
        ]
      },
      {
        id: 'm_shoes',
        children: [
          { id: 'm_sneakers' }, { id: 'm_boots' }, { id: 'm_dress_shoes' },
          { id: 'm_sandals' }, { id: 'm_loafers' }, { id: 'm_sports_shoes' }
        ]
      },
      {
        id: 'm_accessories',
        children: [
          { id: 'm_watches' }, { id: 'm_sunglasses' }, { id: 'm_bags_m' },
          { id: 'm_wallets' }, { id: 'm_belts' }, { id: 'm_hats' },
          { id: 'm_ties' }
        ]
      }
    ]
  },
  {
    id: 'kids', icon: '',
    children: [
      {
        id: 'k_girls',
        children: [
          { id: 'k_g_clothing', children: [
            { id: 'k_g_dresses' }, { id: 'k_g_tops' }, { id: 'k_g_bottoms' },
            { id: 'k_g_outerwear' }
          ]},
          { id: 'k_g_shoes' }, { id: 'k_g_accessories' }
        ]
      },
      {
        id: 'k_boys',
        children: [
          { id: 'k_b_clothing', children: [
            { id: 'k_b_tops' }, { id: 'k_b_bottoms' }, { id: 'k_b_outerwear' }
          ]},
          { id: 'k_b_shoes' }, { id: 'k_b_accessories' }
        ]
      },
      { id: 'k_baby', children: [
        { id: 'k_baby_clothing' }, { id: 'k_baby_shoes' }, { id: 'k_baby_gear' }
      ]},
      { id: 'k_toys' }
    ]
  }
];

// Category labels (multilingual)
export const CATEGORY_LABELS = {
  en: {
    women: 'Women', men: 'Men', kids: 'Kids',
    // Women
    w_clothing: 'Clothing', w_dresses: 'Dresses', w_mini_dresses: 'Mini dresses', w_midi_dresses: 'Midi dresses',
    w_maxi_dresses: 'Maxi dresses', w_evening_dresses: 'Evening dresses', w_casual_dresses: 'Casual dresses',
    w_shirt_dresses: 'Shirt dresses', w_tops: 'Tops', w_tshirts: 'T-shirts', w_blouses: 'Blouses',
    w_tanks: 'Tank tops', w_crop_tops: 'Crop tops', w_bodysuits: 'Bodysuits', w_sweaters: 'Sweaters & Knitwear',
    w_bottoms: 'Bottoms', w_jeans: 'Jeans', w_trousers: 'Trousers', w_skirts: 'Skirts', w_shorts: 'Shorts',
    w_leggings: 'Leggings', w_outerwear: 'Outerwear', w_coats: 'Coats', w_jackets: 'Jackets',
    w_blazers: 'Blazers', w_vests: 'Vests', w_puffers: 'Puffer jackets', w_activewear: 'Activewear',
    w_sports_bras: 'Sports bras', w_sports_tops: 'Sports tops', w_sports_leggings: 'Sports leggings',
    w_swimwear: 'Swimwear', w_lingerie: 'Lingerie', w_maternity: 'Maternity',
    w_shoes: 'Shoes', w_sneakers: 'Sneakers', w_heels: 'Heels', w_boots: 'Boots', w_sandals: 'Sandals',
    w_flats: 'Flats', w_loafers: 'Loafers', w_platforms: 'Platforms', w_slippers: 'Slippers',
    w_bags: 'Bags', w_handbags: 'Handbags', w_shoulder_bags: 'Shoulder bags', w_crossbody: 'Crossbody bags',
    w_tote_bags: 'Tote bags', w_clutches: 'Clutches', w_backpacks: 'Backpacks', w_wallets_w: 'Wallets',
    w_accessories: 'Accessories', w_jewelry: 'Jewellery', w_watches_w: 'Watches', w_sunglasses_w: 'Sunglasses',
    w_scarves: 'Scarves', w_hats: 'Hats', w_belts_w: 'Belts', w_beauty: 'Beauty',
    // Men
    m_clothing: 'Clothing', m_tshirts: 'T-shirts & Vests', m_graphic_tees: 'Graphic tees', m_plain_tees: 'Plain tees',
    m_polo_shirts: 'Polo shirts', m_long_sleeve: 'Long sleeve', m_shirts: 'Shirts', m_casual_shirts: 'Casual shirts',
    m_dress_shirts: 'Dress shirts', m_flannel: 'Flannel shirts', m_bottoms: 'Trousers & Shorts', m_jeans: 'Jeans',
    m_chinos: 'Chinos', m_joggers: 'Joggers', m_shorts: 'Shorts', m_trousers: 'Trousers',
    m_outerwear: 'Outerwear', m_jackets: 'Jackets', m_coats: 'Coats', m_hoodies: 'Hoodies & Sweatshirts',
    m_blazers: 'Blazers', m_puffers: 'Puffer jackets', m_bombers: 'Bomber jackets',
    m_suits: 'Suits', m_suit_jackets: 'Suit jackets', m_suit_trousers: 'Suit trousers', m_full_suits: 'Full suits',
    m_activewear: 'Activewear', m_swimwear: 'Swimwear', m_underwear: 'Underwear',
    m_shoes: 'Shoes', m_sneakers: 'Sneakers', m_boots: 'Boots', m_dress_shoes: 'Dress shoes',
    m_sandals: 'Sandals', m_loafers: 'Loafers', m_sports_shoes: 'Sports shoes',
    m_accessories: 'Accessories', m_watches: 'Watches', m_sunglasses: 'Sunglasses', m_bags_m: 'Bags',
    m_wallets: 'Wallets', m_belts: 'Belts', m_hats: 'Hats & Caps', m_ties: 'Ties & Bow ties',
    // Kids
    k_girls: 'Girls', k_boys: 'Boys', k_baby: 'Baby', k_toys: 'Toys',
    k_g_clothing: 'Clothing', k_g_dresses: 'Dresses', k_g_tops: 'Tops', k_g_bottoms: 'Bottoms',
    k_g_outerwear: 'Outerwear', k_g_shoes: 'Shoes', k_g_accessories: 'Accessories',
    k_b_clothing: 'Clothing', k_b_tops: 'Tops', k_b_bottoms: 'Bottoms', k_b_outerwear: 'Outerwear',
    k_b_shoes: 'Shoes', k_b_accessories: 'Accessories',
    k_baby_clothing: 'Baby clothing', k_baby_shoes: 'Baby shoes', k_baby_gear: 'Baby gear'
  },
  uz: {
    women: 'Ayollar', men: 'Erkaklar', kids: 'Bolalar',
    w_clothing: 'Kiyim', w_dresses: 'Ko\'ylaklar', w_mini_dresses: 'Mini ko\'ylaklar', w_midi_dresses: 'Midi ko\'ylaklar',
    w_maxi_dresses: 'Maxi ko\'ylaklar', w_evening_dresses: 'Kechki ko\'ylaklar', w_casual_dresses: 'Kundalik ko\'ylaklar',
    w_shirt_dresses: 'Ko\'ylak-liboslar', w_tops: 'Ustki kiyim', w_tshirts: 'Futbolkalar', w_blouses: 'Bluzalar',
    w_tanks: 'Maykachar', w_crop_tops: 'Krop-toplar', w_bodysuits: 'Bodysuitlar', w_sweaters: 'Sviterlar',
    w_bottoms: 'Pastki kiyim', w_jeans: 'Jinsi shimlar', w_trousers: 'Shimlar', w_skirts: 'Yubkalar',
    w_shorts: 'Shortlar', w_leggings: 'Legginslar', w_outerwear: 'Ustki kiyim', w_coats: 'Paltolar',
    w_jackets: 'Kurtkajar', w_blazers: 'Blazerlar', w_vests: 'Jiletlar', w_puffers: 'Pufer kurtkalar',
    w_activewear: 'Sport kiyim', w_sports_bras: 'Sport sutiyenlar', w_sports_tops: 'Sport toplar',
    w_sports_leggings: 'Sport legginslar', w_swimwear: 'Suzish kiyimi', w_lingerie: 'Ichki kiyim',
    w_maternity: 'Homilador ayollar uchun',
    w_shoes: 'Poyabzal', w_sneakers: 'Krossovkalar', w_heels: 'Poshnali', w_boots: 'Etiklar',
    w_sandals: 'Sandallar', w_flats: 'Yassi poyabzal', w_loafers: 'Loferlar', w_platforms: 'Platformalar',
    w_slippers: 'Shippaklar',
    w_bags: 'Sumkalar', w_handbags: 'Qo\'l sumkalar', w_shoulder_bags: 'Yelka sumkalar',
    w_crossbody: 'Krossbodi sumkalar', w_tote_bags: 'Tote sumkalar', w_clutches: 'Klatchlar',
    w_backpacks: 'Ryukzaklar', w_wallets_w: 'Hamyonlar',
    w_accessories: 'Aksessuarlar', w_jewelry: 'Zargarlik', w_watches_w: 'Soatlar', w_sunglasses_w: 'Quyosh ko\'zoynagi',
    w_scarves: 'Sharf va ro\'mollar', w_hats: 'Shlyapalar', w_belts_w: 'Kamarlar', w_beauty: 'Go\'zallik',
    m_clothing: 'Kiyim', m_tshirts: 'Futbolkalar', m_graphic_tees: 'Grafik futbolkalar',
    m_plain_tees: 'Oddiy futbolkalar', m_polo_shirts: 'Polo futbolkalar', m_long_sleeve: 'Uzun yengli',
    m_shirts: 'Ko\'ylaklar', m_casual_shirts: 'Kundalik ko\'ylaklar', m_dress_shirts: 'Rasmiy ko\'ylaklar',
    m_flannel: 'Flanel ko\'ylaklar', m_bottoms: 'Shimlar', m_jeans: 'Jinsi shimlar',
    m_chinos: 'Chinolar', m_joggers: 'Joggerlar', m_shorts: 'Shortlar', m_trousers: 'Shimlar',
    m_outerwear: 'Ustki kiyim', m_jackets: 'Kurtkalar', m_coats: 'Paltolar',
    m_hoodies: 'Xudi va svitshortlar', m_blazers: 'Blazerlar', m_puffers: 'Pufer kurtkalar',
    m_bombers: 'Bomber kurtkalar', m_suits: 'Kostumlar', m_suit_jackets: 'Kostum kurtkalari',
    m_suit_trousers: 'Kostum shimlari', m_full_suits: 'To\'liq kostumlar',
    m_activewear: 'Sport kiyim', m_swimwear: 'Suzish kiyimi', m_underwear: 'Ichki kiyim',
    m_shoes: 'Poyabzal', m_sneakers: 'Krossovkalar', m_boots: 'Etiklar', m_dress_shoes: 'Rasmiy poyabzal',
    m_sandals: 'Sandallar', m_loafers: 'Loferlar', m_sports_shoes: 'Sport poyabzal',
    m_accessories: 'Aksessuarlar', m_watches: 'Soatlar', m_sunglasses: 'Quyosh ko\'zoynagi',
    m_bags_m: 'Sumkalar', m_wallets: 'Hamyonlar', m_belts: 'Kamarlar', m_hats: 'Shlyapalar',
    m_ties: 'Galstuklar',
    k_girls: 'Qizlar', k_boys: 'O\'g\'il bolalar', k_baby: 'Chaqaloqlar', k_toys: 'O\'yinchoqlar',
    k_g_clothing: 'Kiyim', k_g_dresses: 'Ko\'ylaklar', k_g_tops: 'Ustki kiyim', k_g_bottoms: 'Pastki kiyim',
    k_g_outerwear: 'Ustki kiyim', k_g_shoes: 'Poyabzal', k_g_accessories: 'Aksessuarlar',
    k_b_clothing: 'Kiyim', k_b_tops: 'Ustki kiyim', k_b_bottoms: 'Pastki kiyim', k_b_outerwear: 'Ustki kiyim',
    k_b_shoes: 'Poyabzal', k_b_accessories: 'Aksessuarlar',
    k_baby_clothing: 'Chaqaloq kiyimi', k_baby_shoes: 'Chaqaloq poyabzali', k_baby_gear: 'Chaqaloq jihozlari'
  }
};

import { getLanguage } from './i18n.js';

export function getCategoryLabel(id) {
  const lang = getLanguage();
  return CATEGORY_LABELS[lang]?.[id] || CATEGORY_LABELS.en[id] || id;
}

export function findCategoryPath(targetId, tree = CATEGORY_TREE, path = []) {
  for (const node of tree) {
    const currentPath = [...path, node.id];
    if (node.id === targetId) return currentPath;
    if (node.children) {
      const found = findCategoryPath(targetId, node.children, currentPath);
      if (found) return found;
    }
  }
  return null;
}

export function getAllCategoryIds(tree = CATEGORY_TREE) {
  let ids = [];
  for (const node of tree) {
    ids.push(node.id);
    if (node.children) {
      ids = ids.concat(getAllCategoryIds(node.children));
    }
  }
  return ids;
}

export function findNode(id, tree = CATEGORY_TREE) {
  for (const node of tree) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(id, node.children);
      if (found) return found;
    }
  }
  return null;
}

// Get all leaf descendant IDs for filtering
export function getDescendantIds(id) {
  const node = findNode(id);
  if (!node) return [id];
  if (!node.children) return [id];
  let ids = [id];
  for (const child of node.children) {
    ids = ids.concat(getDescendantIds(child.id));
  }
  return ids;
}
