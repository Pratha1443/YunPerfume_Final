import { getDb, users, orders, orderItems } from './src/db/schema';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { nanoid } from 'nanoid';

// This script injects test data into the local SQLite database used by miniflare/next-on-pages
// It creates an Admin user and a mock order.
const fs = require('fs');
const path = require('path');

async function main() {
  // Find the local D1 sqlite file
  const dir = path.join(process.cwd(), '.wrangler/state/v3/d1/miniflare-D1DatabaseObject');
  if (!fs.existsSync(dir)) {
    console.log("Local D1 database not found. Please load the website at least once in your browser at http://localhost:3000 to initialize it.");
    return;
  }

  const files = fs.readdirSync(dir);
  const sqliteFile = files.find(f => f.endsWith('.sqlite'));
  if (!sqliteFile) {
    console.log("No sqlite file found in", dir);
    return;
  }

  const dbPath = path.join(dir, sqliteFile);
  console.log("Connecting to local DB:", dbPath);

  const client = createClient({ url: `file:${dbPath}` });
  const db = drizzle(client);

  const adminEmail = "admin@yunperfume.com";
  
  try {
    // 1. Create an admin user
    await db.insert(users).values({
      id: nanoid(),
      email: adminEmail,
      name: "Yun Admin",
      role: "ADMIN"
    }).onConflictDoUpdate({
      target: users.email,
      set: { role: "ADMIN" }
    });
    console.log(`✅ Admin user ensured: ${adminEmail}`);

    // 2. Create a mock order
    const orderId = `ord_${nanoid(12)}`;
    await db.insert(orders).values({
      id: orderId,
      email: adminEmail,
      totalAmount: 1450000, // Rs 14,500
      status: 'PAID',
      shippingAddress: JSON.stringify({
        name: "Test Customer",
        phone: "+91 9876543210",
        line1: "123 Mock Street",
        city: "Mumbai",
        state: "MH",
        pin: "400001"
      }),
    });
    
    await db.insert(orderItems).values({
      id: `oi_${nanoid(10)}`,
      orderId,
      productId: "prod_mock", // Doesn't matter if it's strict FK unless enforced by sqlite
      productName: "Sandal Velvet",
      productSize: "50 ml",
      quantity: 2,
      unitPrice: 725000 // Rs 7,250
    });

    console.log(`✅ Mock order created: ${orderId}`);
    console.log("\n🎉 Test data injected successfully!");
    console.log("\nTo test the app locally:");
    console.log("1. Open http://localhost:3000/login");
    console.log("2. Enter email: admin@yunperfume.com");
    console.log("3. Check the terminal for the Magic Link (Resend logs it in dev mode) or click it if email goes through.");
    console.log("4. Once logged in, visit http://localhost:3000/admin/orders to see the order.");

  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();
