import { db } from '@/db';
import { bookings, user, hotels, flights, taxis } from '@/db/schema';

async function main() {
    // Query existing IDs from database
    const existingUsers = await db.select({ id: user.id }).from(user).limit(5);
    const existingHotels = await db.select({ id: hotels.id }).from(hotels).limit(4);
    const existingFlights = await db.select({ id: flights.id }).from(flights).limit(4);
    const existingTaxis = await db.select({ id: taxis.id, pricePerKm: taxis.pricePerKm }).from(taxis).limit(4);

    if (existingUsers.length === 0) {
        throw new Error('No users found in database. Please seed users first.');
    }
    if (existingHotels.length === 0) {
        throw new Error('No hotels found in database. Please seed hotels first.');
    }
    if (existingFlights.length === 0) {
        throw new Error('No flights found in database. Please seed flights first.');
    }
    if (existingTaxis.length === 0) {
        throw new Error('No taxis found in database. Please seed taxis first.');
    }

    const userIds = existingUsers.map(u => u.id);
    const hotelIds = existingHotels.map(h => h.id);
    const flightIds = existingFlights.map(f => f.id);
    const taxiData = existingTaxis.map(t => ({ id: t.id, pricePerKm: t.pricePerKm }));

    const sampleBookings = [
        // Hotel Bookings
        {
            bookingType: 'hotel',
            hotelId: hotelIds[0],
            userId: userIds[0],
            checkIn: '2024-02-20',
            checkOut: '2024-02-23',
            guests: 2,
            fullName: 'Rahul Sharma',
            email: 'rahul.sharma@email.com',
            phone: '+91-9876543210',
            specialRequests: 'Ocean view room preferred',
            status: 'confirmed',
            subtotal: 15000,
            taxes: 1800,
            totalPrice: 16800,
            createdAt: new Date().toISOString(),
        },
        {
            bookingType: 'hotel',
            hotelId: hotelIds[1],
            userId: userIds[1],
            checkIn: '2024-03-05',
            checkOut: '2024-03-10',
            guests: 4,
            fullName: 'Priya Patel',
            email: 'priya.patel@email.com',
            phone: '+91-9876543211',
            specialRequests: 'Two adjacent rooms needed',
            status: 'confirmed',
            subtotal: 18000,
            taxes: 2160,
            totalPrice: 20160,
            createdAt: new Date().toISOString(),
        },
        {
            bookingType: 'hotel',
            hotelId: hotelIds[2],
            userId: userIds[2],
            checkIn: '2024-02-15',
            checkOut: '2024-02-17',
            guests: 1,
            fullName: 'Amit Kumar',
            email: 'amit.kumar@email.com',
            phone: '+91-9876543212',
            specialRequests: null,
            status: 'completed',
            subtotal: 8000,
            taxes: 960,
            totalPrice: 8960,
            createdAt: new Date().toISOString(),
        },
        {
            bookingType: 'hotel',
            hotelId: hotelIds[3] || hotelIds[0],
            userId: userIds[3] || userIds[0],
            checkIn: '2024-03-15',
            checkOut: '2024-03-18',
            guests: 3,
            fullName: 'Sneha Gupta',
            email: 'sneha.gupta@email.com',
            phone: '+91-9876543213',
            specialRequests: 'Early check-in if possible',
            status: 'pending',
            subtotal: 12000,
            taxes: 1440,
            totalPrice: 13440,
            createdAt: new Date().toISOString(),
        },
        // Flight Bookings
        {
            bookingType: 'flight',
            flightId: flightIds[0],
            userId: userIds[0],
            passengers: 1,
            fullName: 'Vikram Singh',
            email: 'vikram.singh@email.com',
            phone: '+91-9876543214',
            specialRequests: 'Window seat preferred',
            status: 'confirmed',
            subtotal: 12000,
            taxes: 600,
            totalPrice: 12600,
            createdAt: new Date().toISOString(),
        },
        {
            bookingType: 'flight',
            flightId: flightIds[1],
            userId: userIds[1],
            passengers: 2,
            fullName: 'Anjali Mehta',
            email: 'anjali.mehta@email.com',
            phone: '+91-9876543215',
            specialRequests: 'Seats together',
            status: 'confirmed',
            subtotal: 25000,
            taxes: 1250,
            totalPrice: 26250,
            createdAt: new Date().toISOString(),
        },
        {
            bookingType: 'flight',
            flightId: flightIds[2],
            userId: userIds[2],
            passengers: 4,
            fullName: 'Rajesh Iyer',
            email: 'rajesh.iyer@email.com',
            phone: '+91-9876543216',
            specialRequests: 'Extra baggage allowance needed',
            status: 'confirmed',
            subtotal: 48000,
            taxes: 2400,
            totalPrice: 50400,
            createdAt: new Date().toISOString(),
        },
        {
            bookingType: 'flight',
            flightId: flightIds[3] || flightIds[0],
            userId: userIds[3] || userIds[0],
            passengers: 1,
            fullName: 'Deepa Nair',
            email: 'deepa.nair@email.com',
            phone: '+91-9876543217',
            specialRequests: null,
            status: 'pending',
            subtotal: 8500,
            taxes: 425,
            totalPrice: 8925,
            createdAt: new Date().toISOString(),
        },
        // Taxi Bookings
        {
            bookingType: 'taxi',
            taxiId: taxiData[0].id,
            userId: userIds[0],
            pickupLocation: 'Mumbai Airport',
            dropLocation: 'Andheri',
            distance: 25,
            fullName: 'Karan Verma',
            email: 'karan.verma@email.com',
            phone: '+91-9876543218',
            specialRequests: 'Need child seat',
            status: 'completed',
            subtotal: 25 * taxiData[0].pricePerKm,
            taxes: (25 * taxiData[0].pricePerKm) * 0.05,
            totalPrice: (25 * taxiData[0].pricePerKm) * 1.05,
            createdAt: new Date().toISOString(),
        },
        {
            bookingType: 'taxi',
            taxiId: taxiData[1].id,
            userId: userIds[1],
            pickupLocation: 'Delhi Railway Station',
            dropLocation: 'Connaught Place',
            distance: 15,
            fullName: 'Meera Kapoor',
            email: 'meera.kapoor@email.com',
            phone: '+91-9876543219',
            specialRequests: null,
            status: 'confirmed',
            subtotal: 15 * taxiData[1].pricePerKm,
            taxes: (15 * taxiData[1].pricePerKm) * 0.05,
            totalPrice: (15 * taxiData[1].pricePerKm) * 1.05,
            createdAt: new Date().toISOString(),
        },
        {
            bookingType: 'taxi',
            taxiId: taxiData[2].id,
            userId: userIds[2],
            pickupLocation: 'Bangalore MG Road',
            dropLocation: 'Koramangala',
            distance: 18,
            fullName: 'Arjun Reddy',
            email: 'arjun.reddy@email.com',
            phone: '+91-9876543220',
            specialRequests: 'AC required',
            status: 'confirmed',
            subtotal: 18 * taxiData[2].pricePerKm,
            taxes: (18 * taxiData[2].pricePerKm) * 0.05,
            totalPrice: (18 * taxiData[2].pricePerKm) * 1.05,
            createdAt: new Date().toISOString(),
        },
        {
            bookingType: 'taxi',
            taxiId: taxiData[3]?.id || taxiData[0].id,
            userId: userIds[3] || userIds[0],
            pickupLocation: 'Hyderabad Secunderabad',
            dropLocation: 'Banjara Hills',
            distance: 22,
            fullName: 'Pooja Desai',
            email: 'pooja.desai@email.com',
            phone: '+91-9876543221',
            specialRequests: 'Extra luggage space needed',
            status: 'completed',
            subtotal: 22 * (taxiData[3]?.pricePerKm || taxiData[0].pricePerKm),
            taxes: (22 * (taxiData[3]?.pricePerKm || taxiData[0].pricePerKm)) * 0.05,
            totalPrice: (22 * (taxiData[3]?.pricePerKm || taxiData[0].pricePerKm)) * 1.05,
            createdAt: new Date().toISOString(),
        },
    ];

    await db.insert(bookings).values(sampleBookings);
    
    console.log('✅ Bookings seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});