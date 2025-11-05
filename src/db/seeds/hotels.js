import { db } from '../index.js';
import { hotels } from '../schema.js';

async function main() {
    const sampleHotels = [
        {
            name: 'Grand Plaza Hotel',
            location: 'New York USA',
            address: '123 Fifth Avenue NY 10001',
            rating: 4.8,
            reviews: 1284,
            price: 299,
            images: [
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'
            ],
            amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Room Service'],
            roomType: 'Deluxe Suite',
            description: 'Experience luxury at its finest at Grand Plaza Hotel. Located in New York USA, our hotel offers stunning city views and world-class amenities.',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Seaside Resort',
            location: 'Miami USA',
            address: '456 Ocean Drive Miami FL 33139',
            rating: 4.9,
            reviews: 892,
            price: 399,
            images: [
                'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop'
            ],
            amenities: ['Beach Access', 'Restaurant', 'Gym', 'Free WiFi', 'Bar'],
            roomType: 'Ocean View',
            description: 'Experience luxury at its finest at Seaside Resort. Located in Miami USA, our hotel offers stunning ocean views and world-class amenities.',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Mountain View Lodge',
            location: 'Colorado USA',
            address: '789 Alpine Road Aspen CO 81611',
            rating: 4.7,
            reviews: 654,
            price: 249,
            images: [
                'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop'
            ],
            amenities: ['Mountain View', 'Fireplace', 'Hiking', 'Free WiFi', 'Ski Storage'],
            roomType: 'Standard Room',
            description: 'Experience luxury at its finest at Mountain View Lodge. Located in Colorado USA, our hotel offers stunning mountain views and world-class amenities.',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'City Center Inn',
            location: 'Chicago USA',
            address: '321 Michigan Avenue Chicago IL 60601',
            rating: 4.5,
            reviews: 432,
            price: 199,
            images: [
                'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1590490359854-483d6dedc8f3?w=800&h=600&fit=crop'
            ],
            amenities: ['Free WiFi', 'Breakfast', 'Parking', 'Business Center'],
            roomType: 'Standard Room',
            description: 'Experience luxury at its finest at City Center Inn. Located in Chicago USA, our hotel offers stunning city views and world-class amenities.',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Luxury Palace Hotel',
            location: 'Las Vegas USA',
            address: '555 Las Vegas Blvd Las Vegas NV 89101',
            rating: 4.9,
            reviews: 2156,
            price: 499,
            images: [
                'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&h=600&fit=crop'
            ],
            amenities: ['Casino', 'Pool', 'Spa', 'Restaurant', 'Free WiFi', 'Gym', 'Night Club'],
            roomType: 'Presidential Suite',
            description: 'Experience luxury at its finest at Luxury Palace Hotel. Located in Las Vegas USA, our hotel offers stunning casino views and world-class amenities.',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Beachfront Paradise',
            location: 'California USA',
            address: '888 Pacific Coast Highway Malibu CA 90265',
            rating: 4.6,
            reviews: 765,
            price: 349,
            images: [
                'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1559599238-3272a7d36cf1?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop'
            ],
            amenities: ['Beach Access', 'Pool', 'Restaurant', 'Free WiFi', 'Surf Lessons'],
            roomType: 'Deluxe Suite',
            description: 'Experience luxury at its finest at Beachfront Paradise. Located in California USA, our hotel offers stunning beach views and world-class amenities.',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Historic Downtown Hotel',
            location: 'Boston USA',
            address: '234 Beacon Street Boston MA 02116',
            rating: 4.4,
            reviews: 543,
            price: 229,
            images: [
                'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=600&fit=crop'
            ],
            amenities: ['Free WiFi', 'Breakfast', 'Historic Building', 'Library'],
            roomType: 'Standard Room',
            description: 'Experience luxury at its finest at Historic Downtown Hotel. Located in Boston USA, our hotel offers stunning historic views and world-class amenities.',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Lakeside Resort',
            location: 'Minnesota USA',
            address: '777 Lake Shore Drive Duluth MN 55802',
            rating: 4.7,
            reviews: 421,
            price: 279,
            images: [
                'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop'
            ],
            amenities: ['Lake View', 'Restaurant', 'Spa', 'Free WiFi', 'Fishing'],
            roomType: 'Lake View Room',
            description: 'Experience luxury at its finest at Lakeside Resort. Located in Minnesota USA, our hotel offers stunning lake views and world-class amenities.',
            createdAt: new Date().toISOString(),
        }
    ];

    await db.insert(hotels).values(sampleHotels);
    
    console.log('✅ Hotels seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});
