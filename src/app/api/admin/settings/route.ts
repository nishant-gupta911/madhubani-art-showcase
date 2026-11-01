import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Settings } from '@/models/Settings';
import { verifyAdminRequest } from '@/lib/auth';
import { DEFAULT_SETTINGS } from '@/lib/settings';

export async function GET(req: NextRequest) {
  try {
    const isAdmin = await verifyAdminRequest(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
    }

    await connectToDatabase();
    let settingsDoc = await Settings.findOne().lean();
    if (!settingsDoc) {
      settingsDoc = await Settings.create(DEFAULT_SETTINGS);
    }

    return NextResponse.json({ settings: settingsDoc });
  } catch (err: any) {
    console.error('Admin GET settings error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const isAdmin = await verifyAdminRequest(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
    }

    const body = await req.json();
    await connectToDatabase();

    let settingsDoc = await Settings.findOne();
    if (!settingsDoc) {
      settingsDoc = new Settings(DEFAULT_SETTINGS);
    }

    if (body.announcement) {
      settingsDoc.announcement = {
        ...settingsDoc.announcement,
        ...body.announcement,
      };
    }

    if (body.shipping) {
      settingsDoc.shipping = {
        ...settingsDoc.shipping,
        ...body.shipping,
      };
    }

    if (body.contact) {
      settingsDoc.contact = {
        ...settingsDoc.contact,
        ...body.contact,
      };
    }

    await settingsDoc.save();

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings: settingsDoc,
    });
  } catch (err: any) {
    console.error('Admin PUT settings error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
