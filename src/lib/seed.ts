import { db } from "./db";
import { fragrances } from "./fragrances";

async function main() {
  console.log("Seeding products...");

  for (const f of fragrances) {
    await db.product.upsert({
      where: { slug: f.slug },
      update: {
        name: f.name,
        tagline: f.tagline,
        description: f.story,
        price: f.price * 100, // Storing in paise (lowest unit)
        active: true,
      },
      create: {
        slug: f.slug,
        name: f.name,
        tagline: f.tagline,
        description: f.story,
        price: f.price * 100,
        active: true,
      },
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
