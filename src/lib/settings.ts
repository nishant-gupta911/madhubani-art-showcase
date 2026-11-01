import { connectToDatabase } from '@/lib/db';
import { Settings, ISettings } from '@/models/Settings';

export interface SiteSettingsData {
  announcement: {
    enabled: boolean;
    text: string;
    link?: string;
  };
  shipping: {
    standardFeePaise: number;
    freeShippingThresholdPaise: number;
    paintingsFreeShipping: boolean;
    codAvailable: boolean;
    codConvenienceFeePaise: number;
    codMaxThresholdPaise: number;
    giftWrappingFeePaise: number;
    defaultLeadTimeDays: number;
  };
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    sellerCity: string;
    state: string;
    pincode: string;
    grievanceOfficerName: string;
    grievanceOfficerEmail: string;
    gstin?: string;
  };
}

export const DEFAULT_SETTINGS: SiteSettingsData = {
  announcement: {
    enabled: true,
    text: 'Free shipping across India on orders above ₹1,499 · All framed paintings ship free',
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
    sellerCity: process.env.NEXT_PUBLIC_SELLER_CITY || 'Patna',
    state: process.env.NEXT_PUBLIC_SELLER_STATE || 'Bihar',
    pincode: process.env.NEXT_PUBLIC_SELLER_PINCODE || '800001',
    grievanceOfficerName: 'Natasha Gupta',
    grievanceOfficerEmail: 'vernikaenterprises14@gmail.com',
    gstin: '',
  },
};

export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    await connectToDatabase();
    const settingsDoc = await Settings.findOne().lean();
    if (settingsDoc) {
      return {
        announcement: {
          enabled: settingsDoc.announcement?.enabled ?? DEFAULT_SETTINGS.announcement.enabled,
          text: settingsDoc.announcement?.text || DEFAULT_SETTINGS.announcement.text,
          link: settingsDoc.announcement?.link,
        },
        shipping: {
          standardFeePaise: settingsDoc.shipping?.standardFeePaise ?? DEFAULT_SETTINGS.shipping.standardFeePaise,
          freeShippingThresholdPaise: settingsDoc.shipping?.freeShippingThresholdPaise ?? DEFAULT_SETTINGS.shipping.freeShippingThresholdPaise,
          paintingsFreeShipping: settingsDoc.shipping?.paintingsFreeShipping ?? DEFAULT_SETTINGS.shipping.paintingsFreeShipping,
          codAvailable: settingsDoc.shipping?.codAvailable ?? DEFAULT_SETTINGS.shipping.codAvailable,
          codConvenienceFeePaise: settingsDoc.shipping?.codConvenienceFeePaise ?? DEFAULT_SETTINGS.shipping.codConvenienceFeePaise,
          codMaxThresholdPaise: settingsDoc.shipping?.codMaxThresholdPaise ?? DEFAULT_SETTINGS.shipping.codMaxThresholdPaise,
          giftWrappingFeePaise: settingsDoc.shipping?.giftWrappingFeePaise ?? DEFAULT_SETTINGS.shipping.giftWrappingFeePaise,
          defaultLeadTimeDays: settingsDoc.shipping?.defaultLeadTimeDays ?? DEFAULT_SETTINGS.shipping.defaultLeadTimeDays,
        },
        contact: {
          phone: settingsDoc.contact?.phone || DEFAULT_SETTINGS.contact.phone,
          whatsapp: settingsDoc.contact?.whatsapp || DEFAULT_SETTINGS.contact.whatsapp,
          email: settingsDoc.contact?.email || DEFAULT_SETTINGS.contact.email,
          sellerCity: settingsDoc.contact?.sellerCity || DEFAULT_SETTINGS.contact.sellerCity,
          state: settingsDoc.contact?.state || DEFAULT_SETTINGS.contact.state,
          pincode: settingsDoc.contact?.pincode || DEFAULT_SETTINGS.contact.pincode,
          grievanceOfficerName: settingsDoc.contact?.grievanceOfficerName || DEFAULT_SETTINGS.contact.grievanceOfficerName,
          grievanceOfficerEmail: settingsDoc.contact?.grievanceOfficerEmail || DEFAULT_SETTINGS.contact.grievanceOfficerEmail,
          gstin: settingsDoc.contact?.gstin || DEFAULT_SETTINGS.contact.gstin,
        },
      };
    }
  } catch (err) {
    console.error('Error fetching site settings from DB:', err);
  }
  return DEFAULT_SETTINGS;
}
