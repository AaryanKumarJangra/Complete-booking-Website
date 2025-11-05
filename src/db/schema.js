import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const hotels = sqliteTable('hotels', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  location: text('location').notNull(),
  address: text('address').notNull(),
  rating: real('rating').notNull(),
  reviews: integer('reviews').notNull(),
  price: integer('price').notNull(),
  images: text('images', { mode: 'json' }).notNull(),
  amenities: text('amenities', { mode: 'json' }).notNull(),
  roomType: text('room_type').notNull(),
  description: text('description').notNull(),
  createdAt: text('created_at').notNull(),
});

export const bookings = sqliteTable('bookings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  hotelId: integer('hotel_id').references(() => hotels.id).notNull(),
  checkIn: text('check_in').notNull(),
  checkOut: text('check_out').notNull(),
  guests: integer('guests').notNull(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  specialRequests: text('special_requests'),
  status: text('status').notNull().default('confirmed'),
  subtotal: integer('subtotal').notNull(),
  taxes: real('taxes').notNull(),
  totalPrice: real('total_price').notNull(),
  createdAt: text('created_at').notNull(),
});
