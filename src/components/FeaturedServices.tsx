"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Plane, Car } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const featuredHotels = [
  {
    id: 1,
    name: "Grand Plaza Hotel",
    location: "New York, USA",
    rating: 4.8,
    reviews: 1284,
    price: 24999,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
    amenities: ["Free WiFi", "Pool", "Spa"]
  },
  {
    id: 2,
    name: "Seaside Resort",
    location: "Miami, USA",
    rating: 4.9,
    reviews: 892,
    price: 33499,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
    amenities: ["Beach Access", "Restaurant", "Gym"]
  },
  {
    id: 3,
    name: "Mountain View Lodge",
    location: "Colorado, USA",
    rating: 4.7,
    reviews: 654,
    price: 20999,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop",
    amenities: ["Mountain View", "Fireplace", "Hiking"]
  }
]

const featuredFlights = [
  {
    id: 1,
    airline: "SkyWings Airlines",
    from: "New York (JFK)",
    to: "London (LHR)",
    duration: "7h 30m",
    price: 49999,
    class: "Economy"
  },
  {
    id: 2,
    airline: "Pacific Air",
    from: "Los Angeles (LAX)",
    to: "Tokyo (NRT)",
    duration: "11h 45m",
    price: 74999,
    class: "Business"
  },
  {
    id: 3,
    airline: "Euro Express",
    from: "Paris (CDG)",
    to: "Barcelona (BCN)",
    duration: "2h 15m",
    price: 12499,
    class: "Economy"
  }
]

const featuredTaxis = [
  {
    id: 1,
    type: "Sedan",
    model: "Toyota Camry",
    capacity: "4 Passengers",
    pricePerKm: 18,
    features: ["AC", "GPS", "Music System"]
  },
  {
    id: 2,
    type: "SUV",
    model: "Honda CR-V",
    capacity: "6 Passengers",
    pricePerKm: 25,
    features: ["AC", "GPS", "Extra Luggage Space"]
  },
  {
    id: 3,
    type: "Luxury",
    model: "Mercedes S-Class",
    capacity: "4 Passengers",
    pricePerKm: 45,
    features: ["Premium AC", "GPS", "Leather Seats", "WiFi"]
  }
]

export default function FeaturedServices() {
  return (
    <div className="space-y-16">
      {/* Featured Hotels */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Hotels</h2>
            <p className="text-muted-foreground">Discover our handpicked accommodations</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/hotels">View All</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredHotels.map((hotel) => (
            <Card key={hotel.id} className="overflow-hidden card-hover-effect">
              <div className="relative h-48 w-full">
                <Image
                  src={hotel.image}
                  alt={hotel.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{hotel.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {hotel.location}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {hotel.rating}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities.map((amenity) => (
                    <Badge key={amenity} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {hotel.reviews} reviews
                </p>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold">₹{hotel.price.toLocaleString('en-IN')}</span>
                  <span className="text-muted-foreground text-sm">/night</span>
                </div>
                <Button asChild className="btn-primary-enhanced">
                  <Link href={`/hotels/${hotel.id}`}>Book Now</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Flights */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Popular Flight Routes</h2>
            <p className="text-muted-foreground">Best deals on international flights</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/flights">View All</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredFlights.map((flight) => (
            <Card key={flight.id} className="card-hover-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-5 w-5" />
                  {flight.airline}
                </CardTitle>
                <CardDescription>{flight.class}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{flight.from}</p>
                  </div>
                  <div className="text-center">
                    <div className="h-px w-12 bg-border" />
                    <p className="text-xs text-muted-foreground mt-1">{flight.duration}</p>
                  </div>
                  <div>
                    <p className="font-semibold">{flight.to}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold">₹{flight.price.toLocaleString('en-IN')}</span>
                  <span className="text-muted-foreground text-sm">/person</span>
                </div>
                <Button asChild className="btn-primary-enhanced">
                  <Link href={`/flights/${flight.id}`}>Book Flight</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Taxis */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Available Taxis</h2>
            <p className="text-muted-foreground">Comfortable rides for every need</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/taxis">View All</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredTaxis.map((taxi) => (
            <Card key={taxi.id} className="card-hover-effect">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Car className="h-5 w-5" />
                      {taxi.type}
                    </CardTitle>
                    <CardDescription>{taxi.model}</CardDescription>
                  </div>
                  <Badge>{taxi.capacity}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {taxi.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold">₹{taxi.pricePerKm}</span>
                  <span className="text-muted-foreground text-sm">/km</span>
                </div>
                <Button asChild className="btn-primary-enhanced">
                  <Link href={`/taxis/${taxi.id}`}>Book Ride</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}