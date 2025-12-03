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

export const flights = sqliteTable('flights', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  airline: text('airline').notNull(),
  flightNumber: text('flight_number').notNull(),
  fromLocation: text('from_location').notNull(),
  toLocation: text('to_location').notNull(),
  departure: text('departure').notNull(),
  arrival: text('arrival').notNull(),
  duration: text('duration').notNull(),
  stops: text('stops').notNull(),
  price: integer('price').notNull(),
  class: text('class').notNull(),
  date: text('date').notNull(),
  availableSeats: integer('available_seats').notNull().default(150),
  createdAt: text('created_at').notNull(),
});

export const taxis = sqliteTable('taxis', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type').notNull(),
  model: text('model').notNull(),
  capacity: integer('capacity').notNull(),
  luggage: integer('luggage').notNull(),
  pricePerKm: integer('price_per_km').notNull(),
  features: text('features', { mode: 'json' }).notNull(),
  rating: real('rating').notNull(),
  totalTrips: integer('total_trips').notNull().default(0),
  available: integer('available', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
});

export const bookings = sqliteTable('bookings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  bookingType: text('booking_type').notNull(),
  hotelId: integer('hotel_id').references(() => hotels.id),
  flightId: integer('flight_id').references(() => flights.id),
  taxiId: integer('taxi_id').references(() => taxis.id),
  userId: text('user_id').notNull().references(() => user.id),
  checkIn: text('check_in'),
  checkOut: text('check_out'),
  guests: integer('guests'),
  passengers: integer('passengers'),
  pickupLocation: text('pickup_location'),
  dropLocation: text('drop_location'),
  distance: integer('distance'),
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


// Auth tables for better-auth
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  role: text("role").notNull().default("user"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});