<user_request>Prompt to Develop Complete Booking Website (Hotels, Taxis, Flights)

Title: Full-Stack Booking Platform (MERN Stack)

Tech Stack:

Frontend: React.js (with React Router, Context API or Redux for state management, Axios for API calls, Tailwind CSS or Material UI for styling)

Backend: Node.js, Express.js (REST APIs)

Database: MongoDB (with Mongoose ORM)

Authentication: JWT-based authentication

Deployment: Render / Vercel / MongoDB Atlas

🧩 Project Description

Develop a complete booking website that allows users to search, filter, and book services like Hotels, Taxis, and Flights.
The website should offer an end-to-end experience — from searching to reservation confirmation.

🎯 Core Features
1. User Features

User Registration & Login (JWT Auth)

Profile Management (view/edit personal info, booking history)

Search functionality for Hotels, Flights, and Taxis

Filters (price, rating, location, availability, etc.)

Booking system (select date, destination, confirm & pay — mock payment)

Booking confirmation page and booking history

2. Admin Features

Admin login (separate dashboard)

CRUD operations for Hotels, Flights, and Taxis

View all bookings

Manage users (activate/deactivate accounts)

3. Search & Filter System

Users can filter based on:

Hotel → location, price range, rating, room type

Flight → source, destination, date, airline

Taxi → pickup, drop, type (sedan, SUV, etc.)

Backend queries optimized with MongoDB operators ($regex, $gte, $lte, $in)

⚙️ System Architecture

Frontend (React.js)

Pages: Home, Search Results, Details, Booking, Login, Register, Profile, Admin Dashboard

Components: Navbar, Footer, SearchBar, Card (for hotel/flight/taxi), Filters, Modal (booking confirmation)

State Management: Context API or Redux for global states (auth, bookings)

API Integration via Axios

Backend (Node.js + Express.js)

Routes:

/api/auth → register, login

/api/hotels, /api/flights, /api/taxis → CRUD endpoints

/api/bookings → create, read, cancel bookings

Middleware:

Auth middleware (JWT verification)

Error handling middleware

Database Models:

UserModel

HotelModel

FlightModel

TaxiModel

BookingModel

Database (MongoDB)

Proper relations using references (userId, itemId)

Indexing for fast search queries

🎨 UI/UX Requirements

Responsive layout (mobile-first)

Clean interface with intuitive navigation

Interactive search bar on homepage

Separate dashboards for User and Admin

Toast or Modal notifications for actions (booking success, login errors, etc.)

🔐 Additional Enhancements (Optional)

Integrate Google Maps API for taxi routes or hotel locations

Payment simulation using Stripe test keys

Email booking confirmation using Nodemailer

Dark/Light theme toggle

Pagination and sorting on search results

🧠 Expected Skills Demonstration

REST API design (CRUD + filtering endpoints)

State management in React (Context API / Redux)

MongoDB querying and schema design

Authentication and authorization (JWT)

Component reusability & modular structure

Frontend-backend integration using Axios

Deployment and environment setup (dotenv, production build)</user_request>

<todo_list>
1. Create homepage with hero section, search tabs (Hotels/Flights/Taxis), and featured booking cards showcasing services
2. Build search results pages for hotels, flights, and taxis with filtering sidebar (price, rating, location, date) and booking cards with mock data
3. Create booking detail pages with service information, date/time selection, passenger/guest forms, and mock payment confirmation flow
4. Implement user authentication pages (login/register) and profile dashboard showing booking history and user info management
5. Build admin dashboard with tabs for managing hotels/flights/taxis inventory, viewing all bookings, and user management with CRUD operations using mock data
</todo_list>