CREATE TABLE `flights` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`airline` text NOT NULL,
	`flight_number` text NOT NULL,
	`from_location` text NOT NULL,
	`to_location` text NOT NULL,
	`departure` text NOT NULL,
	`arrival` text NOT NULL,
	`duration` text NOT NULL,
	`stops` text NOT NULL,
	`price` integer NOT NULL,
	`class` text NOT NULL,
	`date` text NOT NULL,
	`available_seats` integer DEFAULT 150 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `taxis` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`model` text NOT NULL,
	`capacity` integer NOT NULL,
	`luggage` integer NOT NULL,
	`price_per_km` integer NOT NULL,
	`features` text NOT NULL,
	`rating` real NOT NULL,
	`total_trips` integer DEFAULT 0 NOT NULL,
	`available` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_bookings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`booking_type` text NOT NULL,
	`hotel_id` integer,
	`flight_id` integer,
	`taxi_id` integer,
	`user_id` text NOT NULL,
	`check_in` text,
	`check_out` text,
	`guests` integer,
	`passengers` integer,
	`pickup_location` text,
	`drop_location` text,
	`distance` integer,
	`full_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`special_requests` text,
	`status` text DEFAULT 'confirmed' NOT NULL,
	`subtotal` integer NOT NULL,
	`taxes` real NOT NULL,
	`total_price` real NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`hotel_id`) REFERENCES `hotels`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`flight_id`) REFERENCES `flights`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`taxi_id`) REFERENCES `taxis`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_bookings`("id", "booking_type", "hotel_id", "flight_id", "taxi_id", "user_id", "check_in", "check_out", "guests", "passengers", "pickup_location", "drop_location", "distance", "full_name", "email", "phone", "special_requests", "status", "subtotal", "taxes", "total_price", "created_at") SELECT "id", "booking_type", "hotel_id", "flight_id", "taxi_id", "user_id", "check_in", "check_out", "guests", "passengers", "pickup_location", "drop_location", "distance", "full_name", "email", "phone", "special_requests", "status", "subtotal", "taxes", "total_price", "created_at" FROM `bookings`;--> statement-breakpoint
DROP TABLE `bookings`;--> statement-breakpoint
ALTER TABLE `__new_bookings` RENAME TO `bookings`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `user` ADD `role` text DEFAULT 'user' NOT NULL;