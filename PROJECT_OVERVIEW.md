# TravelBook - Complete Booking Platform

A full-featured booking website built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **Shadcn/UI** components.

## 🎯 Project Overview

TravelBook is a comprehensive booking platform that allows users to search, filter, and book:
- **Hotels** - Browse accommodations with detailed filtering
- **Flights** - Search and book domestic and international flights  
- **Taxis** - Book rides with various vehicle options

## ✨ Features Implemented

### 1. **Homepage** (`/`)
- Hero section with compelling call-to-action
- Tabbed search interface (Hotels, Flights, Taxis)
- Featured services showcase with cards
- Responsive navigation bar
- Footer with social links and site navigation

### 2. **Search Results Pages**
- **Hotels** (`/hotels`) - Grid/list view with filtering sidebar
- **Flights** (`/flights`) - Flight cards with route details
- **Taxis** (`/taxis`) - Vehicle cards with pricing
- **Filters include:**
  - Price range sliders
  - Rating filters
  - Amenities/features checkboxes
  - Vehicle type/class selection
  - Sort options (price, rating, recommendations)

### 3. **Booking Detail Pages**
- **Hotel Booking** (`/hotels/[id]`) - Date selection, guest info, room details
- **Flight Booking** (`/flights/[id]`) - Passenger forms, passport details
- **Taxi Booking** (`/taxis/[id]`) - Pickup/drop locations, time selection
- **Features:**
  - Multi-step booking forms
  - Real-time price calculations
  - Guest/passenger information forms
  - Mock payment integration
  - Booking confirmation flow

### 4. **Authentication System**
- **Login Page** (`/login`) - Email/password authentication
- **Register Page** (`/register`) - New user signup with validation
- **Social login options** (Google, GitHub - UI only)
- Form validation and error handling

### 5. **User Profile Dashboard**
- **Profile Page** (`/profile`) - Personal information management
- **Edit Profile** - Update user details
- **Security Settings** - Password change functionality
- **Bookings Page** (`/profile/bookings`) - View booking history
  - Active bookings tab
  - Past bookings tab
  - Booking details and actions

### 6. **Admin Dashboard** (`/admin`)
- **Overview Tab** - Revenue, bookings, and user statistics
- **Hotels Management** - Full CRUD operations
  - Add new hotels
  - Edit existing hotels
  - Delete hotels
  - View hotel listings
- **Flights Management** - Full CRUD operations
  - Add new flights
  - Edit flight details
  - Delete flights
  - Manage airline routes
- **Taxis Management** - Full CRUD operations
  - Add new vehicles
  - Edit vehicle details
  - Delete vehicles
  - Manage pricing
- **Bookings Management** - View all bookings with filters
- **Users Management** - User accounts control
  - View user list
  - Activate/deactivate accounts
  - View user statistics

## 🛠️ Tech Stack

- **Frontend Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn/UI
- **Icons:** Lucide React
- **Date Handling:** date-fns
- **State Management:** React hooks (useState)
- **Routing:** Next.js App Router

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   ├── hotels/
│   │   ├── page.tsx               # Hotels search results
│   │   └── [id]/page.tsx          # Hotel booking detail
│   ├── flights/
│   │   ├── page.tsx               # Flights search results
│   │   └── [id]/page.tsx          # Flight booking detail
│   ├── taxis/
│   │   ├── page.tsx               # Taxis search results
│   │   └── [id]/page.tsx          # Taxi booking detail
│   ├── login/page.tsx             # Login page
│   ├── register/page.tsx          # Registration page
│   ├── profile/
│   │   ├── page.tsx               # User profile
│   │   └── bookings/page.tsx      # Booking history
│   └── admin/page.tsx             # Admin dashboard
├── components/
│   ├── Navbar.tsx                 # Navigation bar
│   ├── Footer.tsx                 # Footer component
│   ├── SearchTabs.tsx             # Homepage search tabs
│   ├── FeaturedServices.tsx       # Featured services cards
│   └── ui/                        # Shadcn/UI components
└── lib/
    └── utils.ts                   # Utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or bun

### Installation

```bash
# Install dependencies
npm install
# or
bun install

# Run development server
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📱 Key Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with search |
| `/hotels` | Hotel search results |
| `/hotels/[id]` | Hotel booking page |
| `/flights` | Flight search results |
| `/flights/[id]` | Flight booking page |
| `/taxis` | Taxi search results |
| `/taxis/[id]` | Taxi booking page |
| `/login` | User login |
| `/register` | User registration |
| `/profile` | User profile dashboard |
| `/profile/bookings` | Booking history |
| `/admin` | Admin dashboard |

## 🎨 Features Breakdown

### Search & Filtering System
- Location-based search
- Date range pickers
- Price range sliders
- Rating filters
- Amenity filters
- Real-time results update

### Booking Flow
1. Search for service (Hotel/Flight/Taxi)
2. Browse filtered results
3. Select service and view details
4. Fill booking information
5. Enter payment details (mock)
6. Receive confirmation

### Admin Features
- Dashboard with key metrics
- Inventory management (CRUD)
- Booking oversight
- User account management
- Status tracking

## 💾 Mock Data

The application uses mock data for demonstration:
- Sample hotels, flights, and taxis
- Mock user accounts
- Sample bookings
- Test statistics

**Note:** All data is stored in component state. In production, you would integrate with a real backend API and database.

## 🔐 Authentication

Current implementation uses **mock authentication**:
- Login accepts any email/password
- Registration creates mock user
- No actual JWT tokens

**For Production:** Integrate with authentication providers like:
- NextAuth.js
- Auth0
- Firebase Authentication
- Supabase Auth

## 🎯 Next Steps for Production

To make this production-ready, consider:

1. **Backend Integration**
   - Set up REST API or GraphQL
   - Implement MongoDB/PostgreSQL database
   - Add proper authentication (JWT)

2. **Payment Integration**
   - Integrate Stripe/PayPal
   - Implement secure payment flow
   - Add invoice generation

3. **Enhanced Features**
   - Email notifications (Nodemailer)
   - Real-time booking updates
   - Google Maps integration
   - Multi-language support
   - Dark mode toggle

4. **Deployment**
   - Deploy to Vercel/Netlify
   - Set up MongoDB Atlas
   - Configure environment variables
   - Add monitoring and analytics

## 🤝 Contributing

This is a demonstration project showcasing a complete booking platform frontend.

## 📄 License

This project is created for demonstration purposes.

---

**Built with ❤️ using Next.js 15 and Shadcn/UI**
