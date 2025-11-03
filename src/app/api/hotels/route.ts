import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { hotels } from '@/db/schema';
import { eq, and, gte, lte, asc, desc } from 'drizzle-orm';

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
        query = query.orderBy(asc(hotels.id));
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