import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { flights } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    // Validate ID is a valid integer
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    // Query single flight by ID
    const flight = await db
      .select()
      .from(flights)
      .where(eq(flights.id, parseInt(id)))
      .limit(1);

    // Return 404 if flight not found
    if (flight.length === 0) {
      return NextResponse.json(
        {
          error: 'Flight not found',
          code: 'FLIGHT_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Return the flight object
    return NextResponse.json(flight[0], { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_SERVER_ERROR',
      },
      { status: 500 }
    );
  }
}