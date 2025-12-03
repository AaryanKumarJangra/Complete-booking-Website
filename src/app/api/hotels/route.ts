import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { hotels, user, session } from '@/db/schema';
import { eq, and, gte, lte, asc, desc, like } from 'drizzle-orm';

// Helper function to verify admin token
async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Unauthorized', status: 401 };
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
  
  // Get user and check role
  const userRecord = await db.select()
    .from(user)
    .where(eq(user.id, sessionRecord[0].userId))
    .limit(1);
  
  if (userRecord.length === 0 || userRecord[0].role !== 'admin') {
    return { error: 'Forbidden: Admin access required', status: 403 };
  }
  
  return { userId: userRecord[0].id };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single hotel fetch by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const hotel = await db.select()
        .from(hotels)
        .where(eq(hotels.id, parseInt(id)))
        .limit(1);

      if (hotel.length === 0) {
        return NextResponse.json({ 
          error: 'Hotel not found',
          code: 'NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(hotel[0]);
    }

    // List hotels with filtering and sorting
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minRating = searchParams.get('minRating');
    const amenitiesParam = searchParams.get('amenities');
    const roomType = searchParams.get('roomType');
    const location = searchParams.get('location');
    const sortBy = searchParams.get('sortBy') || 'recommended';

    // Build where conditions
    const conditions = [];

    if (minPrice) {
      const minPriceValue = parseInt(minPrice);
      if (!isNaN(minPriceValue)) {
        conditions.push(gte(hotels.price, minPriceValue));
      }
    }

    if (maxPrice) {
      const maxPriceValue = parseInt(maxPrice);
      if (!isNaN(maxPriceValue)) {
        conditions.push(lte(hotels.price, maxPriceValue));
      }
    }

    if (minRating) {
      const minRatingValue = parseFloat(minRating);
      if (!isNaN(minRatingValue)) {
        conditions.push(gte(hotels.rating, minRatingValue));
      }
    }

    if (roomType) {
      conditions.push(eq(hotels.roomType, roomType));
    }

    if (location) {
      conditions.push(like(hotels.location, `%${location}%`));
    }

    // Build query with filters
    let query = db.select().from(hotels);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        query = query.orderBy(asc(hotels.price));
        break;
      case 'price-high':
        query = query.orderBy(desc(hotels.price));
        break;
      case 'rating':
        query = query.orderBy(desc(hotels.rating));
        break;
      case 'recommended':
      default:
        query = query.orderBy(desc(hotels.rating), asc(hotels.price));
        break;
    }

    let results = await query;

    // Filter by amenities (client-side filtering for JSON array)
    if (amenitiesParam) {
      const amenitiesArray = amenitiesParam.split(',').map(a => a.trim()).filter(a => a.length > 0);
      
      if (amenitiesArray.length > 0) {
        results = results.filter(hotel => {
          const hotelAmenities = Array.isArray(hotel.amenities) ? hotel.amenities : [];
          return amenitiesArray.every(amenity => 
            hotelAmenities.some(ha => 
              typeof ha === 'string' && ha.toLowerCase() === amenity.toLowerCase()
            )
          );
        });
      }
    }

    return NextResponse.json(results);

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin
    const authResult = await verifyAdmin(request);
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'location', 'address', 'rating', 'reviews', 'price', 'images', 'amenities', 'roomType', 'description'];
    const missingFields = requiredFields.filter(field => !(field in body));

    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}`,
        code: 'MISSING_REQUIRED_FIELDS' 
      }, { status: 400 });
    }

    const { name, location, address, rating, reviews, price, images, amenities, roomType, description } = body;

    // Validate rating range
    if (typeof rating !== 'number' || rating < 0 || rating > 5) {
      return NextResponse.json({ 
        error: 'Rating must be a number between 0 and 5',
        code: 'INVALID_RATING' 
      }, { status: 400 });
    }

    // Validate price
    if (typeof price !== 'number' || price <= 0 || !Number.isInteger(price)) {
      return NextResponse.json({ 
        error: 'Price must be a positive integer',
        code: 'INVALID_PRICE' 
      }, { status: 400 });
    }

    // Validate reviews
    if (typeof reviews !== 'number' || reviews < 0 || !Number.isInteger(reviews)) {
      return NextResponse.json({ 
        error: 'Reviews must be a non-negative integer',
        code: 'INVALID_REVIEWS' 
      }, { status: 400 });
    }

    // Validate images is an array
    if (!Array.isArray(images)) {
      return NextResponse.json({ 
        error: 'Images must be a valid JSON array',
        code: 'INVALID_IMAGES' 
      }, { status: 400 });
    }

    // Validate amenities is an array
    if (!Array.isArray(amenities)) {
      return NextResponse.json({ 
        error: 'Amenities must be a valid JSON array',
        code: 'INVALID_AMENITIES' 
      }, { status: 400 });
    }

    // Validate text fields
    if (typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Name must be a non-empty string',
        code: 'INVALID_NAME' 
      }, { status: 400 });
    }

    if (typeof location !== 'string' || location.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Location must be a non-empty string',
        code: 'INVALID_LOCATION' 
      }, { status: 400 });
    }

    if (typeof address !== 'string' || address.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Address must be a non-empty string',
        code: 'INVALID_ADDRESS' 
      }, { status: 400 });
    }

    if (typeof roomType !== 'string' || roomType.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Room type must be a non-empty string',
        code: 'INVALID_ROOM_TYPE' 
      }, { status: 400 });
    }

    if (typeof description !== 'string' || description.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Description must be a non-empty string',
        code: 'INVALID_DESCRIPTION' 
      }, { status: 400 });
    }

    // Create new hotel
    const newHotel = await db.insert(hotels)
      .values({
        name: name.trim(),
        location: location.trim(),
        address: address.trim(),
        rating,
        reviews,
        price,
        images,
        amenities,
        roomType: roomType.trim(),
        description: description.trim(),
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newHotel[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
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

    // Validate optional fields if provided
    if (body.rating !== undefined && (typeof body.rating !== 'number' || body.rating < 0 || body.rating > 5)) {
      return NextResponse.json({ 
        error: 'Rating must be a number between 0 and 5',
        code: 'INVALID_RATING' 
      }, { status: 400 });
    }

    if (body.price !== undefined && (typeof body.price !== 'number' || body.price <= 0 || !Number.isInteger(body.price))) {
      return NextResponse.json({ 
        error: 'Price must be a positive integer',
        code: 'INVALID_PRICE' 
      }, { status: 400 });
    }

    if (body.reviews !== undefined && (typeof body.reviews !== 'number' || body.reviews < 0 || !Number.isInteger(body.reviews))) {
      return NextResponse.json({ 
        error: 'Reviews must be a non-negative integer',
        code: 'INVALID_REVIEWS' 
      }, { status: 400 });
    }

    if (body.images !== undefined && !Array.isArray(body.images)) {
      return NextResponse.json({ 
        error: 'Images must be a valid JSON array',
        code: 'INVALID_IMAGES' 
      }, { status: 400 });
    }

    if (body.amenities !== undefined && !Array.isArray(body.amenities)) {
      return NextResponse.json({ 
        error: 'Amenities must be a valid JSON array',
        code: 'INVALID_AMENITIES' 
      }, { status: 400 });
    }

    const updatedHotel = await db.update(hotels)
      .set(body)
      .where(eq(hotels.id, parseInt(id)))
      .returning();

    if (updatedHotel.length === 0) {
      return NextResponse.json({ 
        error: 'Hotel not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    return NextResponse.json(updatedHotel[0]);

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
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

    const deletedHotel = await db.delete(hotels)
      .where(eq(hotels.id, parseInt(id)))
      .returning();

    if (deletedHotel.length === 0) {
      return NextResponse.json({ 
        error: 'Hotel not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Hotel deleted successfully',
      hotel: deletedHotel[0] 
    });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}