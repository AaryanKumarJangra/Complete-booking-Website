import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { taxis, user, session } from '@/db/schema';
import { eq, and, gte, lte, asc, desc } from 'drizzle-orm';

async function verifyAdmin(request: NextRequest): Promise<{ error?: string; status?: number; userId?: string }> {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Authentication required', status: 401 };
  }

  const token = authHeader.substring(7);

  try {
    const sessionResult = await db.select()
      .from(session)
      .where(eq(session.token, token))
      .limit(1);

    if (sessionResult.length === 0) {
      return { error: 'Invalid or expired token', status: 401 };
    }

    const userSession = sessionResult[0];
    const now = new Date();
    
    if (userSession.expiresAt < now) {
      return { error: 'Token expired', status: 401 };
    }

    const userResult = await db.select()
      .from(user)
      .where(eq(user.id, userSession.userId))
      .limit(1);

    if (userResult.length === 0) {
      return { error: 'User not found', status: 401 };
    }

    const userData = userResult[0];

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
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (id) {
      const taxiId = parseInt(id);
      if (isNaN(taxiId)) {
        return NextResponse.json({ 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        }, { status: 400 });
      }

      const taxi = await db.select()
        .from(taxis)
        .where(eq(taxis.id, taxiId))
        .limit(1);

      if (taxi.length === 0) {
        return NextResponse.json({ 
          error: 'Taxi not found',
          code: 'TAXI_NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(taxi[0], { status: 200 });
    }

    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const type = searchParams.get('type');
    const minCapacity = searchParams.get('minCapacity');
    const sortBy = searchParams.get('sortBy') || 'recommended';
    const availableParam = searchParams.get('available');

    let query = db.select().from(taxis);
    const conditions = [];

    if (minPrice) {
      const minPriceInt = parseInt(minPrice);
      if (!isNaN(minPriceInt)) {
        conditions.push(gte(taxis.pricePerKm, minPriceInt));
      }
    }

    if (maxPrice) {
      const maxPriceInt = parseInt(maxPrice);
      if (!isNaN(maxPriceInt)) {
        conditions.push(lte(taxis.pricePerKm, maxPriceInt));
      }
    }

    if (type) {
      conditions.push(eq(taxis.type, type));
    }

    if (minCapacity) {
      const minCapacityInt = parseInt(minCapacity);
      if (!isNaN(minCapacityInt)) {
        conditions.push(gte(taxis.capacity, minCapacityInt));
      }
    }

    if (availableParam !== null) {
      const availableBool = availableParam === 'true';
      conditions.push(eq(taxis.available, availableBool));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    switch (sortBy) {
      case 'price-low':
        query = query.orderBy(asc(taxis.pricePerKm));
        break;
      case 'price-high':
        query = query.orderBy(desc(taxis.pricePerKm));
        break;
      case 'rating':
        query = query.orderBy(desc(taxis.rating));
        break;
      case 'recommended':
      default:
        query = query.orderBy(desc(taxis.rating), asc(taxis.pricePerKm));
        break;
    }

    const results = await query;

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
        code: adminCheck.status === 401 ? 'UNAUTHORIZED' : 'FORBIDDEN' 
      }, { status: adminCheck.status });
    }

    const body = await request.json();
    const { type, model, capacity, luggage, pricePerKm, features, rating, totalTrips, available } = body;

    if (!type || typeof type !== 'string' || type.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Type is required and must be a non-empty string',
        code: 'INVALID_TYPE' 
      }, { status: 400 });
    }

    if (!model || typeof model !== 'string' || model.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Model is required and must be a non-empty string',
        code: 'INVALID_MODEL' 
      }, { status: 400 });
    }

    if (!capacity || typeof capacity !== 'number' || capacity <= 0 || !Number.isInteger(capacity)) {
      return NextResponse.json({ 
        error: 'Capacity is required and must be a positive integer',
        code: 'INVALID_CAPACITY' 
      }, { status: 400 });
    }

    if (!luggage || typeof luggage !== 'number' || luggage <= 0 || !Number.isInteger(luggage)) {
      return NextResponse.json({ 
        error: 'Luggage is required and must be a positive integer',
        code: 'INVALID_LUGGAGE' 
      }, { status: 400 });
    }

    if (!pricePerKm || typeof pricePerKm !== 'number' || pricePerKm <= 0 || !Number.isInteger(pricePerKm)) {
      return NextResponse.json({ 
        error: 'Price per km is required and must be a positive integer',
        code: 'INVALID_PRICE_PER_KM' 
      }, { status: 400 });
    }

    if (!features || !Array.isArray(features)) {
      return NextResponse.json({ 
        error: 'Features is required and must be an array',
        code: 'INVALID_FEATURES' 
      }, { status: 400 });
    }

    if (rating === undefined || typeof rating !== 'number' || rating < 0 || rating > 5) {
      return NextResponse.json({ 
        error: 'Rating is required and must be a number between 0 and 5',
        code: 'INVALID_RATING' 
      }, { status: 400 });
    }

    if (totalTrips !== undefined && (typeof totalTrips !== 'number' || totalTrips < 0 || !Number.isInteger(totalTrips))) {
      return NextResponse.json({ 
        error: 'Total trips must be a non-negative integer',
        code: 'INVALID_TOTAL_TRIPS' 
      }, { status: 400 });
    }

    if (available !== undefined && typeof available !== 'boolean') {
      return NextResponse.json({ 
        error: 'Available must be a boolean',
        code: 'INVALID_AVAILABLE' 
      }, { status: 400 });
    }

    const newTaxi = await db.insert(taxis)
      .values({
        type: type.trim(),
        model: model.trim(),
        capacity,
        luggage,
        pricePerKm,
        features: JSON.stringify(features),
        rating,
        totalTrips: totalTrips ?? 0,
        available: available ?? true,
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newTaxi[0], { status: 201 });
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
        code: adminCheck.status === 401 ? 'UNAUTHORIZED' : 'FORBIDDEN' 
      }, { status: adminCheck.status });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: 'Valid ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    const taxiId = parseInt(id);

    const existing = await db.select()
      .from(taxis)
      .where(eq(taxis.id, taxiId))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Taxi not found',
        code: 'TAXI_NOT_FOUND' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { type, model, capacity, luggage, pricePerKm, features, rating, totalTrips, available } = body;

    if (type !== undefined && (typeof type !== 'string' || type.trim().length === 0)) {
      return NextResponse.json({ 
        error: 'Type must be a non-empty string',
        code: 'INVALID_TYPE' 
      }, { status: 400 });
    }

    if (model !== undefined && (typeof model !== 'string' || model.trim().length === 0)) {
      return NextResponse.json({ 
        error: 'Model must be a non-empty string',
        code: 'INVALID_MODEL' 
      }, { status: 400 });
    }

    if (capacity !== undefined && (typeof capacity !== 'number' || capacity <= 0 || !Number.isInteger(capacity))) {
      return NextResponse.json({ 
        error: 'Capacity must be a positive integer',
        code: 'INVALID_CAPACITY' 
      }, { status: 400 });
    }

    if (luggage !== undefined && (typeof luggage !== 'number' || luggage <= 0 || !Number.isInteger(luggage))) {
      return NextResponse.json({ 
        error: 'Luggage must be a positive integer',
        code: 'INVALID_LUGGAGE' 
      }, { status: 400 });
    }

    if (pricePerKm !== undefined && (typeof pricePerKm !== 'number' || pricePerKm <= 0 || !Number.isInteger(pricePerKm))) {
      return NextResponse.json({ 
        error: 'Price per km must be a positive integer',
        code: 'INVALID_PRICE_PER_KM' 
      }, { status: 400 });
    }

    if (features !== undefined && !Array.isArray(features)) {
      return NextResponse.json({ 
        error: 'Features must be an array',
        code: 'INVALID_FEATURES' 
      }, { status: 400 });
    }

    if (rating !== undefined && (typeof rating !== 'number' || rating < 0 || rating > 5)) {
      return NextResponse.json({ 
        error: 'Rating must be a number between 0 and 5',
        code: 'INVALID_RATING' 
      }, { status: 400 });
    }

    if (totalTrips !== undefined && (typeof totalTrips !== 'number' || totalTrips < 0 || !Number.isInteger(totalTrips))) {
      return NextResponse.json({ 
        error: 'Total trips must be a non-negative integer',
        code: 'INVALID_TOTAL_TRIPS' 
      }, { status: 400 });
    }

    if (available !== undefined && typeof available !== 'boolean') {
      return NextResponse.json({ 
        error: 'Available must be a boolean',
        code: 'INVALID_AVAILABLE' 
      }, { status: 400 });
    }

    const updates: any = {};

    if (type !== undefined) updates.type = type.trim();
    if (model !== undefined) updates.model = model.trim();
    if (capacity !== undefined) updates.capacity = capacity;
    if (luggage !== undefined) updates.luggage = luggage;
    if (pricePerKm !== undefined) updates.pricePerKm = pricePerKm;
    if (features !== undefined) updates.features = JSON.stringify(features);
    if (rating !== undefined) updates.rating = rating;
    if (totalTrips !== undefined) updates.totalTrips = totalTrips;
    if (available !== undefined) updates.available = available;

    const updatedTaxi = await db.update(taxis)
      .set(updates)
      .where(eq(taxis.id, taxiId))
      .returning();

    return NextResponse.json(updatedTaxi[0], { status: 200 });
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
        code: adminCheck.status === 401 ? 'UNAUTHORIZED' : 'FORBIDDEN' 
      }, { status: adminCheck.status });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: 'Valid ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    const taxiId = parseInt(id);

    const existing = await db.select()
      .from(taxis)
      .where(eq(taxis.id, taxiId))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Taxi not found',
        code: 'TAXI_NOT_FOUND' 
      }, { status: 404 });
    }

    const deleted = await db.delete(taxis)
      .where(eq(taxis.id, taxiId))
      .returning();

    return NextResponse.json({ 
      message: 'Taxi deleted successfully',
      taxi: deleted[0] 
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}