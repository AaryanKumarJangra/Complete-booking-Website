CREATE TABLE `bookings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`hotel_id` integer NOT NULL,
	`check_in` text NOT NULL,
	`check_out` text NOT NULL,
	`guests` integer NOT NULL,
	`full_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`special_requests` text,
	`status` text DEFAULT 'confirmed' NOT NULL,
	`subtotal` integer NOT NULL,
	`taxes` real NOT NULL,
	`total_price` real NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`hotel_id`) REFERENCES `hotels`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `hotels` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`location` text NOT NULL,
	`address` text NOT NULL,
	`rating` real NOT NULL,
	`reviews` integer NOT NULL,
	`price` integer NOT NULL,
	`images` text NOT NULL,
	`amenities` text NOT NULL,
	`room_type` text NOT NULL,
	`description` text NOT NULL,
	`created_at` text NOT NULL
);
