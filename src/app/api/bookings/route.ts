import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings, hotels } from '@/db/schema';
import { eq, like } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    let query = db.select().from(bookings).leftJoin(hotels, eq(bookings.hotelId, hotels.id));

    if (email) {
      const emailLower = email.toLowerCase();
      query = query.where(eq(bookings.email, emailLower));
    }

    const results = await query;

    const formattedResults = results.map(row => ({
      id: row.bookings.id,
      hotelId: row.bookings.hotelId,
      checkIn: row.bookings.checkIn,
      checkOut: row.bookings.checkOut,
      guests: row.bookings.guests,
      fullName: row.bookings.fullName,
      email: row.bookings.email,
      phone: row.bookings.phone,
      specialRequests: row.bookings.specialRequests,
      status: row.bookings.status,
      subtotal: row.bookings.subtotal,
      taxes: row.bookings.taxes,
      totalPrice: row.bookings.totalPrice,
      createdAt: row.bookings.createdAt,
      hotel: row.hotels
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
    const body = await request.json();
    const {
      hotel_id,
      check_in,
      check_out,
      guests,
      full_name,
      email,
      phone,
      special_requests,
      subtotal,
      taxes,
      total_price,
      status
    } = body;

    // Validate required fields
    if (!hotel_id) {
      return NextResponse.json({ 
        error: "hotel_id is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    if (!check_in) {
      return NextResponse.json({ 
        error: "check_in is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    if (!check_out) {
      return NextResponse.json({ 
        error: "check_out is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    if (!guests) {
      return NextResponse.json({ 
        error: "guests is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: "Invalid email format",
        code: "INVALID_EMAIL" 
      }, { status: 400 });
    }

    // Validate guests is positive integer
    const guestsNum = parseInt(guests);
    if (isNaN(guestsNum) || guestsNum <= 0) {
      return NextResponse.json({ 
        error: "guests must be a positive integer",
        code: "INVALID_GUESTS" 
      }, { status: 400 });
    }

    // Validate dates
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);

    if (isNaN(checkInDate.getTime())) {
      return NextResponse.json({ 
        error: "check_in must be a valid ISO date string",
        code: "INVALID_CHECK_IN" 
      }, { status: 400 });
    }

    if (isNaN(checkOutDate.getTime())) {
      return NextResponse.json({ 
        error: "check_out must be a valid ISO date string",
        code: "INVALID_CHECK_OUT" 
      }, { status: 400 });
    }

    if (checkOutDate <= checkInDate) {
      return NextResponse.json({ 
        error: "check_out must be after check_in",
        code: "INVALID_DATE_RANGE" 
      }, { status: 400 });
    }

    // Validate numeric fields are positive
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

    // Verify hotel exists
    const hotelId = parseInt(hotel_id);
    if (isNaN(hotelId)) {
      return NextResponse.json({ 
        error: "hotel_id must be a valid integer",
        code: "INVALID_HOTEL_ID" 
      }, { status: 400 });
    }

    const hotelExists = await db.select()
      .from(hotels)
      .where(eq(hotels.id, hotelId))
      .limit(1);

    if (hotelExists.length === 0) {
      return NextResponse.json({ 
        error: "Hotel not found with the provided hotel_id",
        code: "INVALID_HOTEL_ID" 
      }, { status: 400 });
    }

    // Prepare insert data
    const insertData = {
      hotelId: hotelId,
      checkIn: check_in.trim(),
      checkOut: check_out.trim(),
      guests: guestsNum,
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