/**
 * Site Configuration for Vernika Enterprises
 * Single source of truth for brand identity, contact info, shipping rules, and policies.
 * Never hardcode these values in UI components.
 */

const rawCity = process.env.NEXT_PUBLIC_SELLER_CITY?.trim() || 'Patna';
const rawState = process.env.NEXT_PUBLIC_SELLER_STATE?.trim() || 'Bihar';
const rawPincode = process.env.NEXT_PUBLIC_SELLER_PINCODE?.trim() || '800001';

if (process.env.NODE_ENV === 'production') {
  if (rawCity.startsWith('[')) {
    throw new Error(
      'FATAL: NEXT_PUBLIC_SELLER_CITY is set to placeholder. Configure a real city in environment variables before building for production.'
    );
  }
}

const activeCity = rawCity || 'Patna';
const activeState = rawState;

export const siteConfig = {
  name: "Vernika Enterprises",
  shortName: "Vernika",
  artist: "Natasha Gupta",
  tagline: "Madhubani art, handpainted by Natasha Gupta",
  description:
    "Original, handpainted Madhubani (Mithila) art directly from the artist Natasha Gupta. Heritage art on framed canvases, pure cotton dupattas, and handcrafted lifestyle bags.",
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://vernikaenterprises.com',
  origin: `${activeCity}, ${activeState}, India`,
  sellerCity: activeCity,
  sellerState: activeState,
  isSellerCityConfigured: Boolean(rawCity && !rawCity.startsWith('[')),
  artHeritage: "Traditional folk art of the Mithila region",

  contact: {
    phone: "7870909889",
    displayPhone: "+91 78709 09889",
    whatsapp: "917870909889",
    whatsappLink: "https://wa.me/917870909889",
    email: "vernikaenterprises14@gmail.com",
    address: {
      street: "Studio Vernika",
      city: activeCity,
      state: activeState,
      pincode: rawPincode,
      country: "India",
    },
    grievanceOfficer: {
      name: "Natasha Gupta",
      designation: "Grievance Officer & Founder",
      email: "vernikaenterprises14@gmail.com",
      phone: "+91 78709 09889",
      address: `${activeCity}, ${activeState}, India`,
    },
  },

  social: {
    instagram: "https://instagram.com/vernikaenterprises",
    facebook: "https://facebook.com/vernikaenterprises",
    whatsapp: "https://wa.me/917870909889",
  },

  business: {
    gstin: "DRAFT_REVIEW_PENDING", // Confirmed with CA
    pan: "DRAFT_PENDING",
    currency: "INR",
    currencySymbol: "₹",
  },

  shipping: {
    standardShippingFeePaise: 7900, // ₹79 flat
    freeShippingThresholdPaise: 149900, // Free above ₹1,499
    paintingsFreeShipping: true,
    codAvailable: true,
    codConvenienceFeePaise: 4900, // ₹49 COD fee
    codMaxThresholdPaise: 300000, // COD allowed up to ₹3,000
    giftWrappingFeePaise: 9900, // ₹99
    defaultLeadTimeDays: 7,
  },

  categories: [
    {
      id: "paintings",
      name: "Madhubani Paintings",
      slug: "paintings",
      description: "Original handpainted framed art on handmade paper",
      subCategories: [
        { id: "fish", name: "Fish & Aquatic Mandalas", slug: "fish" },
        { id: "peacock_and_birds", name: "Peacock & Sacred Birds", slug: "peacock-and-birds" },
        { id: "tree_of_life", name: "Tree of Life (Kalpavriksha)", slug: "tree-of-life" },
        { id: "figures_and_deities", name: "Figures & Sacred Deities", slug: "figures-and-deities" },
        { id: "elephants", name: "Elephants & Folk Animals", slug: "elephants" },
        { id: "strips_and_sets", name: "Strips & Triptych Sets", slug: "strips-and-sets" },
      ],
    },
    {
      id: "dupattas",
      name: "Dupattas & Angvastras",
      slug: "dupattas",
      description: "Wearable heritage handpainted on breathable cotton and tussar silks",
      subCategories: [
        { id: "womens_dupattas", name: "Women's Dupattas", slug: "womens-dupattas" },
        { id: "mens_angvastra", name: "Men's Angvastra / Stoles", slug: "mens-angvastra" },
      ],
    },
    {
      id: "bags_and_files",
      name: "Bags & Files",
      slug: "bags-and-files",
      description: "Artisan canvas totes, handbags, laptop sleeves, folders & organizers",
      subCategories: [
        { id: "tote_bags", name: "Tote Bags", slug: "tote-bags" },
        { id: "hand_purses_and_handbags", name: "Hand Purses & Handbags", slug: "hand-purses-and-handbags" },
        { id: "sling_and_zip_pouches", name: "Sling & Zip Pouches", slug: "sling-and-zip-pouches" },
        { id: "laptop_bags", name: "Laptop Bags", slug: "laptop-bags" },
        { id: "file_folders", name: "File Folders", slug: "file-folders" },
        { id: "wall_hangings", name: "Wall Hanging Organizers", slug: "wall-hangings" },
      ],
    },
  ],
};
