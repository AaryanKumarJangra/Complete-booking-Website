import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { taxis } from '@/db/schema';
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

    const taxiId = parseInt(id);

    // Query single taxi by ID
    const taxi = await db
      .select()
      .from(taxis)
      .where(eq(taxis.id, taxiId))
      .limit(1);

    // Return 404 if taxi not found
    if (taxi.length === 0) {
      return NextResponse.json(
        {
          error: 'Taxi not found',
          code: 'TAXI_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Return taxi object
    return NextResponse.json(taxi[0], { status: 200 });
  } catch (error) {
    console.error('GET taxi error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}