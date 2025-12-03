import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings, hotels, flights, taxis, session, user } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Extract and validate ID from path parameter
    const { id } = context.params;
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid booking ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    const bookingId = parseInt(id);

    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          error: 'Authentication required. Please provide a valid Bearer token',
          code: 'MISSING_AUTH_TOKEN',
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Validate session
    const sessionResult = await db
      .select()
      .from(session)
      .where(eq(session.token, token))
      .limit(1);

    if (sessionResult.length === 0) {
      return NextResponse.json(
        {
          error: 'Invalid authentication token',
          code: 'INVALID_TOKEN',
        },
        { status: 401 }
      );
    }

    const userSession = sessionResult[0];

    // Check if session is expired
    const currentTime = new Date();
    if (userSession.expiresAt < currentTime) {
      return NextResponse.json(
        {
          error: 'Authentication token has expired',
          code: 'TOKEN_EXPIRED',
        },
        { status: 401 }
      );
    }

    // Get user information
    const userResult = await db
      .select()
      .from(user)
      .where(eq(user.id, userSession.userId))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json(
        {
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        },
        { status: 401 }
      );
    }

    const currentUser = userResult[0];

    // Query booking with left joins to related tables
    const bookingResult = await db
      .select({
        booking: bookings,
        hotel: hotels,
        flight: flights,
        taxi: taxis,
      })
      .from(bookings)
      .leftJoin(hotels, eq(bookings.hotelId, hotels.id))
      .leftJoin(flights, eq(bookings.flightId, flights.id))
      .leftJoin(taxis, eq(bookings.taxiId, taxis.id))
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (bookingResult.length === 0) {
      return NextResponse.json(
        {
          error: 'Booking not found',
          code: 'BOOKING_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    const result = bookingResult[0];

    // Check authorization: user must own the booking or be an admin
    const isOwner = result.booking.userId === currentUser.id;
    const isAdmin = currentUser.role === 'admin';

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        {
          error: 'You do not have permission to access this booking',
          code: 'FORBIDDEN',
        },
        { status: 403 }
      );
    }

    // Construct response object with booking and related data
    const response = {
      ...result.booking,
      hotel: result.hotel,
      flight: result.flight,
      taxi: result.taxi,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('GET booking error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}