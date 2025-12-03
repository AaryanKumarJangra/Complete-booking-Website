import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings, hotels, flights, taxis, user, session } from '@/db/schema';
import { eq, like } from 'drizzle-orm';

// Helper function to verify token and get user
async function verifyUser(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Authorization token is required', status: 401 };
  }
  
  const token = authHeader.substring(7);
  
  // Verify token exists in session table
  const sessionRecord = await db.select()
    .from(session)
    .where(eq(session.token, token))
    .limit(1);
  
  if (sessionRecord.length === 0) {
    return { error: 'Invalid token', status: 401 };
  }
  
  // Check if session is expired
  const now = new Date();
  if (sessionRecord[0].expiresAt < now) {
    return { error: 'Token expired', status: 401 };
  }
  
  // Get user
  const userRecord = await db.select()
    .from(user)
    .where(eq(user.id, sessionRecord[0].userId))
    .limit(1);
  
  if (userRecord.length === 0) {
    return { error: 'User not found', status: 401 };
  }
  
  return { userId: userRecord[0].id, role: userRecord[0].role };
}

// Helper function to verify admin
async function verifyAdmin(request: NextRequest) {
  const userResult = await verifyUser(request);
  if ('error' in userResult) {
    return userResult;
  }
  
  if (userResult.role !== 'admin') {
    return { error: 'Forbidden: Admin access required', status: 403 };
  }
  
  return { userId: userResult.userId, role: userResult.role };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Verify user authentication
    const authResult = await verifyUser(request);
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    // Single booking fetch by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const booking = await db.select().from(bookings)
        .leftJoin(hotels, eq(bookings.hotelId, hotels.id))
        .leftJoin(flights, eq(bookings.flightId, flights.id))
        .leftJoin(taxis, eq(bookings.taxiId, taxis.id))
        .where(eq(bookings.id, parseInt(id)))
        .limit(1);

      if (booking.length === 0) {
        return NextResponse.json({ 
          error: 'Booking not found',
          code: 'NOT_FOUND' 
        }, { status: 404 });
      }

      // Check if user owns this booking or is admin
      if (authResult.role !== 'admin' && booking[0].bookings.userId !== authResult.userId) {
        return NextResponse.json({ 
          error: 'Forbidden: Cannot access other users bookings',
          code: 'FORBIDDEN' 
        }, { status: 403 });
      }

      const result = {
        ...booking[0].bookings,
        hotel: booking[0].hotels,
        flight: booking[0].flights,
        taxi: booking[0].taxis
      };

      return NextResponse.json(result);
    }

    // List bookings
    let query = db.select().from(bookings)
      .leftJoin(hotels, eq(bookings.hotelId, hotels.id))
      .leftJoin(flights, eq(bookings.flightId, flights.id))
      .leftJoin(taxis, eq(bookings.taxiId, taxis.id));

    // If not admin, filter by userId
    if (authResult.role !== 'admin') {
      query = query.where(eq(bookings.userId, authResult.userId));
    }

    const results = await query;

    const formattedResults = results.map(row => ({
      ...row.bookings,
      hotel: row.hotels,
      flight: row.flights,
      taxi: row.taxis
    }));

    return NextResponse.json(formattedResults, { status: 200 });
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const authResult = await verifyUser(request);
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const body = await request.json();
    const {
      booking_type,
      hotel_id,
      flight_id,
      taxi_id,
      check_in,
      check_out,
      guests,
      passengers,
      pickup_location,
      drop_location,
      distance,
      full_name,
      email,
      phone,
      special_requests,
      subtotal,
      taxes,
      total_price,
      status
    } = body;

    // Validate booking_type
    if (!booking_type || !['hotel', 'flight', 'taxi'].includes(booking_type)) {
      return NextResponse.json({ 
        error: "booking_type is required and must be 'hotel', 'flight', or 'taxi'",
        code: "INVALID_BOOKING_TYPE" 
      }, { status: 400 });
    }

    // Validate required fields
    if (!full_name) {
      return NextResponse.json({ 
        error: "full_name is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ 
        error: "email is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    if (!phone) {
      return NextResponse.json({ 
        error: "phone is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    if (subtotal === undefined || subtotal === null) {
      return NextResponse.json({ 
        error: "subtotal is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    if (taxes === undefined || taxes === null) {
      return NextResponse.json({ 
        error: "taxes is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    if (total_price === undefined || total_price === null) {
      return NextResponse.json({ 
        error: "total_price is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    // Validate booking type specific fields
    if (booking_type === 'hotel') {
      if (!hotel_id) {
        return NextResponse.json({ 
          error: "hotel_id is required for hotel bookings",
          code: "MISSING_HOTEL_ID" 
        }, { status: 400 });
      }
      if (!check_in || !check_out) {
        return NextResponse.json({ 
          error: "check_in and check_out are required for hotel bookings",
          code: "MISSING_DATES" 
        }, { status: 400 });
      }
      if (!guests) {
        return NextResponse.json({ 
          error: "guests is required for hotel bookings",
          code: "MISSING_GUESTS" 
        }, { status: 400 });
      }

      // Verify hotel exists
      const hotelExists = await db.select()
        .from(hotels)
        .where(eq(hotels.id, parseInt(hotel_id)))
        .limit(1);

      if (hotelExists.length === 0) {
        return NextResponse.json({ 
          error: "Hotel not found with the provided hotel_id",
          code: "INVALID_HOTEL_ID" 
        }, { status: 400 });
      }
    }

    if (booking_type === 'flight') {
      if (!flight_id) {
        return NextResponse.json({ 
          error: "flight_id is required for flight bookings",
          code: "MISSING_FLIGHT_ID" 
        }, { status: 400 });
      }
      if (!passengers) {
        return NextResponse.json({ 
          error: "passengers is required for flight bookings",
          code: "MISSING_PASSENGERS" 
        }, { status: 400 });
      }

      // Verify flight exists
      const flightExists = await db.select()
        .from(flights)
        .where(eq(flights.id, parseInt(flight_id)))
        .limit(1);

      if (flightExists.length === 0) {
        return NextResponse.json({ 
          error: "Flight not found with the provided flight_id",
          code: "INVALID_FLIGHT_ID" 
        }, { status: 400 });
      }
    }

    if (booking_type === 'taxi') {
      if (!taxi_id) {
        return NextResponse.json({ 
          error: "taxi_id is required for taxi bookings",
          code: "MISSING_TAXI_ID" 
        }, { status: 400 });
      }
      if (!pickup_location || !drop_location) {
        return NextResponse.json({ 
          error: "pickup_location and drop_location are required for taxi bookings",
          code: "MISSING_LOCATIONS" 
        }, { status: 400 });
      }
      if (!distance) {
        return NextResponse.json({ 
          error: "distance is required for taxi bookings",
          code: "MISSING_DISTANCE" 
        }, { status: 400 });
      }

      // Verify taxi exists
      const taxiExists = await db.select()
        .from(taxis)
        .where(eq(taxis.id, parseInt(taxi_id)))
        .limit(1);

      if (taxiExists.length === 0) {
        return NextResponse.json({ 
          error: "Taxi not found with the provided taxi_id",
          code: "INVALID_TAXI_ID" 
        }, { status: 400 });
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: "Invalid email format",
        code: "INVALID_EMAIL" 
      }, { status: 400 });
    }

    // Validate numeric fields
    const subtotalNum = parseFloat(subtotal);
    const taxesNum = parseFloat(taxes);
    const totalPriceNum = parseFloat(total_price);

    if (isNaN(subtotalNum) || subtotalNum < 0) {
      return NextResponse.json({ 
        error: "subtotal must be a positive number",
        code: "INVALID_SUBTOTAL" 
      }, { status: 400 });
    }

    if (isNaN(taxesNum) || taxesNum < 0) {
      return NextResponse.json({ 
        error: "taxes must be a positive number",
        code: "INVALID_TAXES" 
      }, { status: 400 });
    }

    if (isNaN(totalPriceNum) || totalPriceNum < 0) {
      return NextResponse.json({ 
        error: "total_price must be a positive number",
        code: "INVALID_TOTAL_PRICE" 
      }, { status: 400 });
    }

    // Prepare insert data
    const insertData: any = {
      bookingType: booking_type,
      userId: authResult.userId,
      fullName: full_name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      specialRequests: special_requests ? special_requests.trim() : null,
      status: status || 'confirmed',
      subtotal: subtotalNum,
      taxes: taxesNum,
      totalPrice: totalPriceNum,
      createdAt: new Date().toISOString()
    };

    // Add type-specific fields
    if (booking_type === 'hotel') {
      insertData.hotelId = parseInt(hotel_id);
      insertData.checkIn = check_in.trim();
      insertData.checkOut = check_out.trim();
      insertData.guests = parseInt(guests);
    } else if (booking_type === 'flight') {
      insertData.flightId = parseInt(flight_id);
      insertData.passengers = parseInt(passengers);
    } else if (booking_type === 'taxi') {
      insertData.taxiId = parseInt(taxi_id);
      insertData.pickupLocation = pickup_location.trim();
      insertData.dropLocation = drop_location.trim();
      insertData.distance = parseInt(distance);
    }

    const newBooking = await db.insert(bookings)
      .values(insertData)
      .returning();

    return NextResponse.json(newBooking[0], { status: 201 });
  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify admin
    const authResult = await verifyAdmin(request);
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const body = await request.json();

    const updatedBooking = await db.update(bookings)
      .set(body)
      .where(eq(bookings.id, parseInt(id)))
      .returning();

    if (updatedBooking.length === 0) {
      return NextResponse.json({ 
        error: 'Booking not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    return NextResponse.json(updatedBooking[0]);

  } catch (error: any) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify user authentication
    const authResult = await verifyUser(request);
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Get booking to check ownership
    const bookingRecord = await db.select()
      .from(bookings)
      .where(eq(bookings.id, parseInt(id)))
      .limit(1);

    if (bookingRecord.length === 0) {
      return NextResponse.json({ 
        error: 'Booking not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    // Check if user owns this booking or is admin
    if (authResult.role !== 'admin' && bookingRecord[0].userId !== authResult.userId) {
      return NextResponse.json({ 
        error: 'Forbidden: Cannot cancel other users bookings',
        code: 'FORBIDDEN' 
      }, { status: 403 });
    }

    const deletedBooking = await db.delete(bookings)
      .where(eq(bookings.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Booking cancelled successfully',
      booking: deletedBooking[0] 
    });

  } catch (error: any) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}