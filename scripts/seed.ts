import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../src/lib/db';
import { Product } from '../src/models/Product';
import { Settings } from '../src/models/Settings';
import { User } from '../src/models/User';

// Load .env.local or .env
dotenv.config({ path: '.env.local' });
dotenv.config();

async function seed() {
  console.log('--- Starting MongoDB Seed for Vernika Enterprises ---');
  
  if (!process.env.MONGODB_URI) {
    console.error('ERROR: MONGODB_URI is not set. Please set it in .env.local');
    process.exit(1);
  }

  try {
    await connectToDatabase();
    console.log(' Connected to MongoDB Atlas.');

    // 1. Read seed file
    const seedPath = path.resolve('scripts/products.seed.json');
    if (!fs.existsSync(seedPath)) {
      throw new Error(`Seed file not found at ${seedPath}`);
    }
    const seedProducts = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
    console.log(`Found ${seedProducts.length} products to seed.`);

    // 2. Upsert products
    let created = 0;
    let updated = 0;

    for (const item of seedProducts) {
      const heroImg = item.images.find((img: any) => img.isHero) || item.images[0];
      const baseName = path.parse(heroImg.filename).name;

      const productData = {
        ref: item.ref,
        name: item.name,
        slug: item.slug,
        category: item.category,
        subCategory: item.subCategory,
        type: item.type,
        stock: item.stock,
        leadTimeDays: item.leadTimeDays || 0,
        price: item.price,
        compareAtPrice: item.compareAtPrice || null,
        dimensions: item.dimensions,
        technique: item.technique || 'handpainted',
        paintMedium: item.paintMedium || null,
        material: item.material,
        isFramed: item.isFramed ?? false,
        description: item.description,
        story: item.story,
        tags: item.tags || [],
        featured: item.featured ?? false,
        status: item.status || 'published',
        images: item.images.map((img: any) => {
          const bName = path.parse(img.filename).name;
          return {
            url: `/products/${bName}.webp`,
            cardUrl: `/products/${bName}-card.webp`,
            filename: img.filename,
            alt: img.alt || item.name,
            isHero: img.isHero ?? false,
            shotType: img.shotType,
          };
        }),
      };

      const existing = await Product.findOne({ slug: item.slug });
      if (existing) {
        await Product.updateOne({ slug: item.slug }, { $set: productData });
        updated++;
      } else {
        await Product.create(productData);
        created++;
      }
    }

    console.log(` Products seeded: ${created} created, ${updated} updated.`);

    // 3. Ensure indexes
    await Product.createIndexes();
    console.log(' Product indexes built.');

    // 4. Seed Settings
    const existingSettings = await Settings.findOne();
    if (!existingSettings) {
      await Settings.create({
        announcement: {
          enabled: true,
          text: 'Free shipping across India on orders above ₹1,499 · All framed paintings ship free · Handpainted by Natasha Gupta',
        },
        shipping: {
          standardFeePaise: 7900,
          freeShippingThresholdPaise: 149900,
          paintingsFreeShipping: true,
          codAvailable: true,
          codConvenienceFeePaise: 4900,
          codMaxThresholdPaise: 300000,
          giftWrappingFeePaise: 9900,
          defaultLeadTimeDays: 7,
        },
        contact: {
          phone: '7870909889',
          whatsapp: '917870909889',
          email: 'vernikaenterprises14@gmail.com',
          sellerCity: process.env.NEXT_PUBLIC_SELLER_CITY || '[YOUR CITY]',
          state: 'Bihar',
          pincode: '[PINCODE]',
          grievanceOfficerName: 'Natasha Gupta',
          grievanceOfficerEmail: 'vernikaenterprises14@gmail.com',
        },
      });
      console.log(' Default site settings initialized.');
    }

    // 5. Seed Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'vernikaenterprises14@gmail.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const passwordHash = process.env.ADMIN_PASSWORD_HASH || 
        (process.env.ADMIN_INITIAL_PASSWORD ? await bcrypt.hash(process.env.ADMIN_INITIAL_PASSWORD, 12) : null);
      if (passwordHash) {
        await User.create({
          email: adminEmail,
          passwordHash,
          name: 'Natasha Gupta',
          role: 'admin',
        });
        console.log(` Admin user created: ${adminEmail}`);
      } else {
        console.log(`⚠️ ADMIN_PASSWORD_HASH and ADMIN_INITIAL_PASSWORD are unset. Admin account omitted from seed. Run "npm run admin:create" to set credentials.`);
      }
    }

    console.log('--- MongoDB Seeding Completed Successfully ---');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed with error:', err);
    process.exit(1);
  }
}

seed();
