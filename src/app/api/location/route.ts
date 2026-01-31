import { NextRequest, NextResponse } from 'next/server';
import { getUserLocation } from '@/lib/geolocation';

/**
 * GET /api/location
 * Detect user's location via IP geolocation
 */
export async function GET(request: NextRequest) {
  try {
    // Get IP from headers (works with Vercel, Cloudflare, etc.)
    const forwarded = request.headers.get('x-forwarded-for');
    let ip = forwarded ? forwarded.split(',')[0] : 
               request.headers.get('x-real-ip') || 
               undefined;

    // Skip localhost IPs (::1, 127.0.0.1, etc.) - let API detect public IP
    if (ip === '::1' || ip === '127.0.0.1' || ip?.startsWith('::ffff:127.')) {
      console.log('[Location API] Localhost detected, using public IP detection');
      ip = undefined;
    }

    const location = await getUserLocation(ip);

    return NextResponse.json({
      success: true,
      location,
    });
  } catch (error) {
    console.error('Error detecting location:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to detect location',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/location
 * Override user location
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate location data
    if (!body.country || !body.city) {
      return NextResponse.json(
        {
          success: false,
          error: 'Country and city are required',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      location: {
        ...body,
        isOverridden: true,
      },
    });
  } catch (error) {
    console.error('Error updating location:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update location',
      },
      { status: 500 }
    );
  }
}
