import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),                          // cuid generated in app
  email: text('email').notNull().unique(),
  name: text('name'),
  role: text('role', { enum: ['USER', 'ADMIN'] }).notNull().default('USER'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  lastLoginAt: text('last_login_at'),
});

// ─── Collections ──────────────────────────────────────────────────────────────

export const collections = sqliteTable('collections', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// ─── Products ─────────────────────────────────────────────────────────────────

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  tagline: text('tagline'),
  description: text('description').notNull().default(''),
  price: integer('price').notNull(),                    // paise: ₹4800 → 480000
  stock: integer('stock').notNull().default(0),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  imageUrl: text('image_url'),                          // primary R2 URL
  images: text('images'),                               // JSON array of R2 URLs
  collectionId: text('collection_id').references(() => collections.id),
  scentFamily: text('scent_family'),                    // e.g. "Floral · Warm"
  scentNotes: text('scent_notes'),                      // JSON: {top:[],heart:[],base:[]}
  concentration: text('concentration'),                 // e.g. "EDP"
  size: text('size').default('50ml'),
  hue: text('hue'),                                     // accent hex for UI e.g. "#C4622D"
  index: text('index'),                                 // "01", "02" etc
  story: text('story'),                                 // long-form narrative text
  isDiscoverySet: integer('is_discovery_set', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// ─── Magic Tokens (for passwordless auth) ─────────────────────────────────────

export const magicTokens = sqliteTable('magic_tokens', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  token: text('token').notNull().unique(),
  expiresAt: text('expires_at').notNull(),              // ISO string
  usedAt: text('used_at'),                              // ISO string, null = unused
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// ─── Orders ───────────────────────────────────────────────────────────────────

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),                          // YUN-{timestamp}-{nanoid}
  userId: text('user_id').references(() => users.id),  // null = guest checkout
  email: text('email').notNull(),
  status: text('status', {
    enum: ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'FAILED'],
  }).notNull().default('PENDING'),
  totalAmount: integer('total_amount').notNull(),       // paise
  razorpayOrderId: text('razorpay_order_id').unique(),
  razorpayPaymentId: text('razorpay_payment_id').unique(),
  shippingAddress: text('shipping_address'),            // JSON string
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  paidAt: text('paid_at'),
});

// ─── Order Items ──────────────────────────────────────────────────────────────

export const orderItems = sqliteTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id),
  productId: text('product_id').notNull().references(() => products.id),
  productName: text('product_name').notNull(),          // snapshot at purchase time
  productSize: text('product_size').notNull().default('50ml'),
  quantity: integer('quantity').notNull(),
  unitPrice: integer('unit_price').notNull(),           // paise at time of order
});

// ─── Type exports ─────────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
export type MagicToken = typeof magicTokens.$inferSelect;
export type Collection = typeof collections.$inferSelect;
