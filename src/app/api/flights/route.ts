import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { flights, user, session } from '@/db/schema';
import { eq, and, gte, lte, like, asc, desc } from 'drizzle-orm';

async function verifyAdmin(request: NextRequest): Promise<{ error?: string; status?: number; userId?: string }> {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Authorization token is required', status: 401 };
  }

  const token = authHeader.substring(7);

  try {
    const sessionRecord = await db.select()
      .from(session)
      .where(eq(session.token, token))
      .limit(1);

    if (sessionRecord.length === 0) {
      return { error: 'Invalid or expired token', status: 401 };
    }

    const sessionData = sessionRecord[0];
    const now = new Date();

    if (sessionData.expiresAt < now) {
      return { error: 'Token has expired', status: 401 };
    }

    const userRecord = await db.select()
      .from(user)
      .where(eq(user.id, sessionData.userId))
      .limit(1);

    if (userRecord.length === 0) {
      return { error: 'User not found', status: 401 };
    }

    const userData = userRecord[0];

    if (userData.role !== 'admin') {
      return { error: 'Admin access required', status: 403 };
    }

    return { userId: userData.id };
  } catch (error) {
    console.error('Admin verification error:', error);
    return { error: 'Authentication failed', status: 500 };
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        }, { status: 400 });
      }

      const flight = await db.select()
        .from(flights)
        .where(eq(flights.id, parseInt(id)))
        .limit(1);

      if (flight.length === 0) {
        return NextResponse.json({ 
          error: 'Flight not found',
          code: 'FLIGHT_NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(flight[0], { status: 200 });
    }

    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const date = searchParams.get('date');
    const flightClass = searchParams.get('class');
    const stops = searchParams.get('stops');
    const sortBy = searchParams.get('sortBy') || 'recommended';

    let query = db.select().from(flights);

    const conditions = [];

    if (minPrice) {
      conditions.push(gte(flights.price, parseInt(minPrice)));
    }

    if (maxPrice) {
      conditions.push(lte(flights.price, parseInt(maxPrice)));
    }

    if (from) {
      conditions.push(like(flights.fromLocation, `%${from}%`));
    }

    if (to) {
      conditions.push(like(flights.toLocation, `%${to}%`));
    }

    if (date) {
      conditions.push(eq(flights.date, date));
    }

    if (flightClass) {
      conditions.push(eq(flights.class, flightClass));
    }

    if (stops) {
      conditions.push(eq(flights.stops, stops));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    let results;

    switch (sortBy) {
      case 'price-low':
        results = await query.orderBy(asc(flights.price));
        break;
      case 'price-high':
        results = await query.orderBy(desc(flights.price));
        break;
      case 'duration':
        results = await query.orderBy(asc(flights.duration));
        break;
      case 'recommended':
      default:
        results = await query.orderBy(desc(flights.availableSeats), asc(flights.price));
        break;
    }

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(request);
    if (adminCheck.error) {
      return NextResponse.json({ 
        error: adminCheck.error,
        code: adminCheck.status === 403 ? 'FORBIDDEN' : 'UNAUTHORIZED' 
      }, { status: adminCheck.status });
    }

    const body = await request.json();
    const { 
      airline, 
      flightNumber, 
      fromLocation, 
      toLocation, 
      departure, 
      arrival, 
      duration, 
      stops, 
      price, 
      class: flightClass, 
      date,
      availableSeats 
    } = body;

    if (!airline || !airline.trim()) {
      return NextResponse.json({ 
        error: 'Airline is required',
        code: 'MISSING_AIRLINE' 
      }, { status: 400 });
    }

    if (!flightNumber || !flightNumber.trim()) {
      return NextResponse.json({ 
        error: 'Flight number is required',
        code: 'MISSING_FLIGHT_NUMBER' 
      }, { status: 400 });
    }

    if (!fromLocation || !fromLocation.trim()) {
      return NextResponse.json({ 
        error: 'From location is required',
        code: 'MISSING_FROM_LOCATION' 
      }, { status: 400 });
    }

    if (!toLocation || !toLocation.trim()) {
      return NextResponse.json({ 
        error: 'To location is required',
        code: 'MISSING_TO_LOCATION' 
      }, { status: 400 });
    }

    if (!departure || !departure.trim()) {
      return NextResponse.json({ 
        error: 'Departure time is required',
        code: 'MISSING_DEPARTURE' 
      }, { status: 400 });
    }

    if (!arrival || !arrival.trim()) {
      return NextResponse.json({ 
        error: 'Arrival time is required',
        code: 'MISSING_ARRIVAL' 
      }, { status: 400 });
    }

    if (!duration || !duration.trim()) {
      return NextResponse.json({ 
        error: 'Duration is required',
        code: 'MISSING_DURATION' 
      }, { status: 400 });
    }

    if (!stops || !stops.trim()) {
      return NextResponse.json({ 
        error: 'Stops information is required',
        code: 'MISSING_STOPS' 
      }, { status: 400 });
    }

    if (!flightClass || !flightClass.trim()) {
      return NextResponse.json({ 
        error: 'Class is required',
        code: 'MISSING_CLASS' 
      }, { status: 400 });
    }

    if (!date || !date.trim()) {
      return NextResponse.json({ 
        error: 'Date is required',
        code: 'MISSING_DATE' 
      }, { status: 400 });
    }

    if (price === undefined || price === null || typeof price !== 'number' || price <= 0) {
      return NextResponse.json({ 
        error: 'Price must be a positive integer',
        code: 'INVALID_PRICE' 
      }, { status: 400 });
    }

    const seats = availableSeats !== undefined ? availableSeats : 150;

    if (typeof seats !== 'number' || seats < 0) {
      return NextResponse.json({ 
        error: 'Available seats must be a non-negative integer',
        code: 'INVALID_AVAILABLE_SEATS' 
      }, { status: 400 });
    }

    const newFlight = await db.insert(flights)
      .values({
        airline: airline.trim(),
        flightNumber: flightNumber.trim(),
        fromLocation: fromLocation.trim(),
        toLocation: toLocation.trim(),
        departure: departure.trim(),
        arrival: arrival.trim(),
        duration: duration.trim(),
        stops: stops.trim(),
        price: price,
        class: flightClass.trim(),
        date: date.trim(),
        availableSeats: seats,
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newFlight[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(request);
    if (adminCheck.error) {
      return NextResponse.json({ 
        error: adminCheck.error,
        code: adminCheck.status === 403 ? 'FORBIDDEN' : 'UNAUTHORIZED' 
      }, { status: adminCheck.status });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: 'Valid ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    const existingFlight = await db.select()
      .from(flights)
      .where(eq(flights.id, parseInt(id)))
      .limit(1);

    if (existingFlight.length === 0) {
      return NextResponse.json({ 
        error: 'Flight not found',
        code: 'FLIGHT_NOT_FOUND' 
      }, { status: 404 });
    }

    const body = await request.json();
    const updates: any = {};

    if (body.airline !== undefined) {
      updates.airline = body.airline.trim();
    }

    if (body.flightNumber !== undefined) {
      updates.flightNumber = body.flightNumber.trim();
    }

    if (body.fromLocation !== undefined) {
      updates.fromLocation = body.fromLocation.trim();
    }

    if (body.toLocation !== undefined) {
      updates.toLocation = body.toLocation.trim();
    }

    if (body.departure !== undefined) {
      updates.departure = body.departure.trim();
    }

    if (body.arrival !== undefined) {
      updates.arrival = body.arrival.trim();
    }

    if (body.duration !== undefined) {
      updates.duration = body.duration.trim();
    }

    if (body.stops !== undefined) {
      updates.stops = body.stops.trim();
    }

    if (body.class !== undefined) {
      updates.class = body.class.trim();
    }

    if (body.date !== undefined) {
      updates.date = body.date.trim();
    }

    if (body.price !== undefined) {
      if (typeof body.price !== 'number' || body.price <= 0) {
        return NextResponse.json({ 
          error: 'Price must be a positive integer',
          code: 'INVALID_PRICE' 
        }, { status: 400 });
      }
      updates.price = body.price;
    }

    if (body.availableSeats !== undefined) {
      if (typeof body.availableSeats !== 'number' || body.availableSeats < 0) {
        return NextResponse.json({ 
          error: 'Available seats must be a non-negative integer',
          code: 'INVALID_AVAILABLE_SEATS' 
        }, { status: 400 });
      }
      updates.availableSeats = body.availableSeats;
    }

    const updatedFlight = await db.update(flights)
      .set(updates)
      .where(eq(flights.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedFlight[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(request);
    if (adminCheck.error) {
      return NextResponse.json({ 
        error: adminCheck.error,
        code: adminCheck.status === 403 ? 'FORBIDDEN' : 'UNAUTHORIZED' 
      }, { status: adminCheck.status });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: 'Valid ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    const existingFlight = await db.select()
      .from(flights)
      .where(eq(flights.id, parseInt(id)))
      .limit(1);

    if (existingFlight.length === 0) {
      return NextResponse.json({ 
        error: 'Flight not found',
        code: 'FLIGHT_NOT_FOUND' 
      }, { status: 404 });
    }

    const deletedFlight = await db.delete(flights)
      .where(eq(flights.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Flight deleted successfully',
      flight: deletedFlight[0] 
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}