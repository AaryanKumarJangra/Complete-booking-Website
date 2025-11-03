import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { hotels } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid hotel ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Query hotel by ID
    const hotel = await db
      .select()
      .from(hotels)
      .where(eq(hotels.id, parseInt(id)))
      .limit(1);

    // Check if hotel exists
    if (hotel.length === 0) {
      return NextResponse.json(
        { error: 'Hotel not found', code: 'HOTEL_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Return single hotel object
    return NextResponse.json(hotel[0], { status: 200 });
  } catch (error) {
    console.error('GET hotel by ID error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}