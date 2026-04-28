/**
 * YUN Perfume — D1 Seed Script
 * Run: npm run db:seed
 *
 * Seeds: 1 collection, 4 products, 1 ADMIN user
 * Data mirrors src/lib/fragrances.ts exactly.
 */

import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../src/db/schema';

// ─── Local D1 SQLite path (created by wrangler d1 migrations apply --local) ───
const DB_PATH = '.wrangler/state/v3/d1/miniflare-D1DatabaseObject';

// Find the .sqlite file in the wrangler local state
import { readdirSync } from 'fs';
import { join } from 'path';

function findSqliteFile(dir: string): string {
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        const found = findSqliteFile(fullPath);
        if (found) return found;
      } else if (entry.name.endsWith('.sqlite')) {
        return fullPath;
      }
    }
  } catch {
    // directory doesn't exist yet
  }
  return '';
}

const sqlitePath = findSqliteFile(DB_PATH);
if (!sqlitePath) {
  console.error('❌ Could not find local D1 SQLite file.');
  console.error('   Run: npm run db:migrate:local  first.');
  process.exit(1);
}

console.log(`📂 Using SQLite: ${sqlitePath}`);

const sqlite = new Database(sqlitePath);
const db = drizzle(sqlite, { schema });

// ─── Seed Data ────────────────────────────────────────────────────────────────

const COLLECTION_ID = 'col_edition_01';

const COLLECTION = {
  id: COLLECTION_ID,
  slug: 'edition-01',
  name: 'Édition N°01',
  description: 'The inaugural collection — four fragrances rooted in Indian materials and rituals.',
};

const PRODUCTS: schema.NewProduct[] = [
  {
    id: 'prod_mogra_noir',
    slug: 'mogra-noir',
    name: 'Mogra Noir',
    tagline: 'A monsoon evening, jasmine in bloom.',
    description: 'Picked at dawn from gardens outside Madurai, mogra opens with quiet intensity — sweet, narcotic, alive. We pair it with smoked amber for the hours after sunset.',
    story: 'Picked at dawn from gardens outside Madurai, mogra opens with quiet intensity — sweet, narcotic, alive. We pair it with smoked amber for the hours after sunset.',
    price: 480000,           // ₹4,800 in paise
    stock: 50,
    active: true,
    scentFamily: 'Floral · Warm',
    scentNotes: JSON.stringify({ top: ['Bergamot', 'Pink Pepper'], heart: ['Mogra (Indian Jasmine)', 'Tuberose'], base: ['Amber', 'White Musk'] }),
    concentration: 'EDP',
    size: '50ml',
    hue: '#C4622D',
    index: '01',
    collectionId: COLLECTION_ID,
    isDiscoverySet: false,
  },
  {
    id: 'prod_oud_vara',
    slug: 'oud-vara',
    name: 'Oud Vārā',
    tagline: 'Smoke, leather, and the patience of wood.',
    description: 'Vārā means circle, the slow turning of seasons. Aged oud from Assam meets Bulgarian rose — a fragrance that deepens, hour by hour, into something quietly devotional.',
    story: 'Vārā means circle, the slow turning of seasons. Aged oud from Assam meets Bulgarian rose — a fragrance that deepens, hour by hour, into something quietly devotional.',
    price: 680000,           // ₹6,800 in paise
    stock: 30,
    active: true,
    scentFamily: 'Woody · Resinous',
    scentNotes: JSON.stringify({ top: ['Saffron', 'Cardamom'], heart: ['Assam Oud', 'Damask Rose'], base: ['Sandalwood', 'Tobacco'] }),
    concentration: 'EDP',
    size: '50ml',
    hue: '#7A3B1F',
    index: '02',
    collectionId: COLLECTION_ID,
    isDiscoverySet: false,
  },
  {
    id: 'prod_sandal_velvet',
    slug: 'sandal-velvet',
    name: 'Sandal Velvet',
    tagline: 'Mysore sandalwood, rendered into stillness.',
    description: 'Sandalwood is the scent of meditation halls and grandmother\'s wardrobes. Soft, warm, intimate — a fragrance that listens before it speaks.',
    story: 'Sandalwood is the scent of meditation halls and grandmother\'s wardrobes. Soft, warm, intimate — a fragrance that listens before it speaks.',
    price: 540000,           // ₹5,400 in paise
    stock: 40,
    active: true,
    scentFamily: 'Woody · Creamy',
    scentNotes: JSON.stringify({ top: ['Coriander', 'Iris'], heart: ['Mysore Sandalwood', 'Vetiver'], base: ['Cashmeran', 'Vanilla Bourbon'] }),
    concentration: 'EDP',
    size: '50ml',
    hue: '#A98F6F',
    index: '03',
    collectionId: COLLECTION_ID,
    isDiscoverySet: false,
  },
  {
    id: 'prod_chai_atelier',
    slug: 'chai-atelier',
    name: 'Chai Atelier',
    tagline: 'A morning ritual, bottled.',
    description: 'The first cup of chai at a roadside stall in Varanasi — steam, spice, and the hush before the city wakes. Equal parts comfort and curiosity.',
    story: 'The first cup of chai at a roadside stall in Varanasi — steam, spice, and the hush before the city wakes. Equal parts comfort and curiosity.',
    price: 420000,           // ₹4,200 in paise
    stock: 45,
    active: true,
    scentFamily: 'Gourmand · Spiced',
    scentNotes: JSON.stringify({ top: ['Black Cardamom', 'Cinnamon Bark'], heart: ['Assam Tea Leaf', 'Ginger'], base: ['Tonka Bean', 'Brown Sugar'] }),
    concentration: 'EDP',
    size: '50ml',
    hue: '#A06A2D',
    index: '04',
    collectionId: COLLECTION_ID,
    isDiscoverySet: false,
  },
  {
    id: 'prod_discovery_set',
    slug: 'discovery-set',
    name: 'Discovery Set',
    tagline: 'All four fragrances. 2ml each.',
    description: 'Begin here. Four 2ml vials of every fragrance in the YUN collection — Mogra Noir, Oud Vārā, Sandal Velvet, and Chai Atelier. Hand-packed in a linen pouch.',
    story: 'Begin here. The best way to find your fragrance is to wear it for a full day.',
    price: 149900,           // ₹1,499 in paise
    stock: 100,
    active: true,
    scentFamily: 'Sampler',
    scentNotes: null,
    concentration: null,
    size: '4 × 2ml',
    hue: '#4a6fa5',
    index: '00',
    collectionId: COLLECTION_ID,
    isDiscoverySet: true,
  },
];

const ADMIN_USER: schema.NewUser = {
  id: 'user_admin_yun',
  email: 'atelier@yun.in',    // ← change to your real email
  name: 'YUN Admin',
  role: 'ADMIN',
};

// ─── Run seed ─────────────────────────────────────────────────────────────────

async function seed() {
  console.log('🌱 Seeding YUN Perfume database...\n');

  // Collection
  await db.insert(schema.collections).values(COLLECTION).onConflictDoNothing();
  console.log(`✅ Collection: ${COLLECTION.name}`);

  // Products
  for (const product of PRODUCTS) {
    await db.insert(schema.products).values(product).onConflictDoNothing();
    console.log(`✅ Product: ${product.name} (${product.slug}) — ₹${product.price / 100}`);
  }

  // Admin user
  await db.insert(schema.users).values(ADMIN_USER).onConflictDoNothing();
  console.log(`✅ Admin user: ${ADMIN_USER.email}`);

  console.log('\n✨ Seed complete!');
  sqlite.close();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  sqlite.close();
  process.exit(1);
});
