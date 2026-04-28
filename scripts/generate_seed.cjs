const fs = require('fs');

const COLLECTION_ID = 'col_edition_01';

const COLLECTION = {
  id: COLLECTION_ID,
  slug: 'edition-01',
  name: 'Édition N°01',
  description: 'The inaugural collection — four fragrances rooted in Indian materials and rituals.',
};

const PRODUCTS = [
  {
    id: 'prod_mogra_noir',
    slug: 'mogra-noir',
    name: 'Mogra Noir',
    tagline: 'A monsoon evening, jasmine in bloom.',
    description: 'Picked at dawn from gardens outside Madurai, mogra opens with quiet intensity — sweet, narcotic, alive. We pair it with smoked amber for the hours after sunset.',
    story: 'Picked at dawn from gardens outside Madurai, mogra opens with quiet intensity — sweet, narcotic, alive. We pair it with smoked amber for the hours after sunset.',
    price: 480000,
    stock: 50,
    active: 1,
    scentFamily: 'Floral · Warm',
    scentNotes: JSON.stringify({ top: ['Bergamot', 'Pink Pepper'], heart: ['Mogra (Indian Jasmine)', 'Tuberose'], base: ['Amber', 'White Musk'] }),
    concentration: 'EDP',
    size: '50ml',
    hue: '#C4622D',
    index: '01',
    collectionId: COLLECTION_ID,
    isDiscoverySet: 0,
  },
  {
    id: 'prod_oud_vara',
    slug: 'oud-vara',
    name: 'Oud Vārā',
    tagline: 'Smoke, leather, and the patience of wood.',
    description: 'Vārā means circle, the slow turning of seasons. Aged oud from Assam meets Bulgarian rose — a fragrance that deepens, hour by hour, into something quietly devotional.',
    story: 'Vārā means circle, the slow turning of seasons. Aged oud from Assam meets Bulgarian rose — a fragrance that deepens, hour by hour, into something quietly devotional.',
    price: 680000,
    stock: 30,
    active: 1,
    scentFamily: 'Woody · Resinous',
    scentNotes: JSON.stringify({ top: ['Saffron', 'Cardamom'], heart: ['Assam Oud', 'Damask Rose'], base: ['Sandalwood', 'Tobacco'] }),
    concentration: 'EDP',
    size: '50ml',
    hue: '#7A3B1F',
    index: '02',
    collectionId: COLLECTION_ID,
    isDiscoverySet: 0,
  },
  {
    id: 'prod_sandal_velvet',
    slug: 'sandal-velvet',
    name: 'Sandal Velvet',
    tagline: 'Mysore sandalwood, rendered into stillness.',
    description: 'Sandalwood is the scent of meditation halls and grandmother\'s wardrobes. Soft, warm, intimate — a fragrance that listens before it speaks.',
    story: 'Sandalwood is the scent of meditation halls and grandmother\'s wardrobes. Soft, warm, intimate — a fragrance that listens before it speaks.',
    price: 540000,
    stock: 40,
    active: 1,
    scentFamily: 'Woody · Creamy',
    scentNotes: JSON.stringify({ top: ['Coriander', 'Iris'], heart: ['Mysore Sandalwood', 'Vetiver'], base: ['Cashmeran', 'Vanilla Bourbon'] }),
    concentration: 'EDP',
    size: '50ml',
    hue: '#A98F6F',
    index: '03',
    collectionId: COLLECTION_ID,
    isDiscoverySet: 0,
  },
  {
    id: 'prod_chai_atelier',
    slug: 'chai-atelier',
    name: 'Chai Atelier',
    tagline: 'A morning ritual, bottled.',
    description: 'The first cup of chai at a roadside stall in Varanasi — steam, spice, and the hush before the city wakes. Equal parts comfort and curiosity.',
    story: 'The first cup of chai at a roadside stall in Varanasi — steam, spice, and the hush before the city wakes. Equal parts comfort and curiosity.',
    price: 420000,
    stock: 45,
    active: 1,
    scentFamily: 'Gourmand · Spiced',
    scentNotes: JSON.stringify({ top: ['Black Cardamom', 'Cinnamon Bark'], heart: ['Assam Tea Leaf', 'Ginger'], base: ['Tonka Bean', 'Brown Sugar'] }),
    concentration: 'EDP',
    size: '50ml',
    hue: '#A06A2D',
    index: '04',
    collectionId: COLLECTION_ID,
    isDiscoverySet: 0,
  },
  {
    id: 'prod_discovery_set',
    slug: 'discovery-set',
    name: 'Discovery Set',
    tagline: 'All four fragrances. 2ml each.',
    description: 'Begin here. Four 2ml vials of every fragrance in the YUN collection — Mogra Noir, Oud Vārā, Sandal Velvet, and Chai Atelier. Hand-packed in a linen pouch.',
    story: 'Begin here. The best way to find your fragrance is to wear it for a full day.',
    price: 149900,
    stock: 100,
    active: 1,
    scentFamily: 'Sampler',
    scentNotes: null,
    concentration: null,
    size: '4 × 2ml',
    hue: '#4a6fa5',
    index: '00',
    collectionId: COLLECTION_ID,
    isDiscoverySet: 1,
  },
];

const ADMIN_USER = {
  id: 'user_admin_yun',
  email: 'atelier@yun.in',
  name: 'YUN Admin',
  role: 'ADMIN',
};

const escapeStr = (s) => (s == null ? 'NULL' : "'" + String(s).replace(/'/g, "''") + "'");

const sql = [
  `INSERT OR IGNORE INTO collections (id, slug, name, description) VALUES (${escapeStr(COLLECTION.id)}, ${escapeStr(COLLECTION.slug)}, ${escapeStr(COLLECTION.name)}, ${escapeStr(COLLECTION.description)});`,
  ...PRODUCTS.map(p => `INSERT OR IGNORE INTO products (id, slug, name, tagline, description, story, price, stock, active, scent_family, scent_notes, concentration, size, hue, "index", collection_id, is_discovery_set) VALUES (${escapeStr(p.id)}, ${escapeStr(p.slug)}, ${escapeStr(p.name)}, ${escapeStr(p.tagline)}, ${escapeStr(p.description)}, ${escapeStr(p.story)}, ${p.price}, ${p.stock}, ${p.active}, ${escapeStr(p.scentFamily)}, ${escapeStr(p.scentNotes)}, ${escapeStr(p.concentration)}, ${escapeStr(p.size)}, ${escapeStr(p.hue)}, ${escapeStr(p.index)}, ${escapeStr(p.collectionId)}, ${p.isDiscoverySet});`),
  `INSERT OR IGNORE INTO users (id, email, name, role) VALUES (${escapeStr(ADMIN_USER.id)}, ${escapeStr(ADMIN_USER.email)}, ${escapeStr(ADMIN_USER.name)}, ${escapeStr(ADMIN_USER.role)});`,
].join('\n');

fs.writeFileSync('seed.sql', sql);
console.log('Generated seed.sql');
