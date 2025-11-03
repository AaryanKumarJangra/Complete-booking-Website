"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, MapPin, Wifi, UtensilsCrossed, Waves, Dumbbell } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const mockHotels = [
  {
    id: 1,
    name: "Grand Plaza Hotel",
    location: "New York, USA",
    rating: 4.8,
    reviews: 1284,
    price: 299,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
    amenities: ["Free WiFi", "Pool", "Spa", "Restaurant"],
    roomType: "Deluxe Suite"
  },
  {
    id: 2,
    name: "Seaside Resort",
    location: "Miami, USA",
    rating: 4.9,
    reviews: 892,
    price: 399,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
    amenities: ["Beach Access", "Restaurant", "Gym", "Free WiFi"],
    roomType: "Ocean View"
  },
  {
    id: 3,
    name: "Mountain View Lodge",
    location: "Colorado, USA",
    rating: 4.7,
    reviews: 654,
    price: 249,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop",
    amenities: ["Mountain View", "Fireplace", "Hiking", "Free WiFi"],
    roomType: "Standard Room"
  },
  {
    id: 4,
    name: "City Center Inn",
    location: "Chicago, USA",
    rating: 4.5,
    reviews: 432,
    price: 199,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
    amenities: ["Free WiFi", "Breakfast", "Parking"],
    roomType: "Standard Room"
  },
  {
    id: 5,
    name: "Luxury Palace Hotel",
    location: "Las Vegas, USA",
    rating: 4.9,
    reviews: 2156,
    price: 499,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop",
    amenities: ["Casino", "Pool", "Spa", "Restaurant", "Free WiFi", "Gym"],
    roomType: "Presidential Suite"
  },
  {
    id: 6,
    name: "Beachfront Paradise",
    location: "California, USA",
    rating: 4.6,
    reviews: 765,
    price: 349,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
    amenities: ["Beach Access", "Pool", "Restaurant", "Free WiFi"],
    roomType: "Deluxe Suite"
  },
  {
    id: 7,
    name: "Historic Downtown Hotel",
    location: "Boston, USA",
    rating: 4.4,
    reviews: 543,
    price: 229,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
    amenities: ["Free WiFi", "Breakfast", "Historic Building"],
    roomType: "Standard Room"
  },
  {
    id: 8,
    name: "Lakeside Resort",
    location: "Minnesota, USA",
    rating: 4.7,
    reviews: 421,
    price: 279,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
    amenities: ["Lake View", "Restaurant", "Spa", "Free WiFi"],
    roomType: "Lake View Room"
  }
]

export default function HotelsPage() {
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedRating, setSelectedRating] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("recommended")
  const [filteredHotels, setFilteredHotels] = useState(mockHotels)

  const amenitiesFilter = [
    { id: "wifi", label: "Free WiFi", icon: Wifi },
    { id: "pool", label: "Pool", icon: Waves },
    { id: "gym", label: "Gym", icon: Dumbbell },
    { id: "restaurant", label: "Restaurant", icon: UtensilsCrossed }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Hotels in Your Destination</h1>
          <p className="text-muted-foreground">
            {filteredHotels.length} properties found
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
                <CardDescription>Refine your search</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price Range */}
                <div className="space-y-4">
                  <Label>Price Range (per night)</Label>
                  <div className="pt-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={500}
                      step={10}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="space-y-3">
                  <Label>Minimum Rating</Label>
                  <Select value={selectedRating} onValueChange={setSelectedRating}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any rating</SelectItem>
                      <SelectItem value="4.5">4.5+ Stars</SelectItem>
                      <SelectItem value="4.0">4.0+ Stars</SelectItem>
                      <SelectItem value="3.5">3.5+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Amenities Filter */}
                <div className="space-y-3">
                  <Label>Amenities</Label>
                  <div className="space-y-2">
                    {amenitiesFilter.map((amenity) => (
                      <div key={amenity.id} className="flex items-center space-x-2">
                        <Checkbox id={amenity.id} />
                        <label
                          htmlFor={amenity.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {amenity.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Room Type */}
                <div className="space-y-3">
                  <Label>Room Type</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="standard" />
                      <label htmlFor="standard" className="text-sm font-medium cursor-pointer">
                        Standard Room
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="deluxe" />
                      <label htmlFor="deluxe" className="text-sm font-medium cursor-pointer">
                        Deluxe Suite
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="presidential" />
                      <label htmlFor="presidential" className="text-sm font-medium cursor-pointer">
                        Presidential Suite
                      </label>
                    </div>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Results */}
          <div className="lg:col-span-3 space-y-6">
            {/* Sort Controls */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredHotels.length} results
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Hotel Cards */}
            <div className="space-y-4">
              {filteredHotels.map((hotel) => (
                <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="grid md:grid-cols-[300px_1fr] gap-0">
                    <div className="relative h-64 md:h-full">
                      <Image
                        src={hotel.image}
                        alt={hotel.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl mb-2">{hotel.name}</CardTitle>
                            <CardDescription className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {hotel.location}
                            </CardDescription>
                          </div>
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {hotel.rating}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">
                            {hotel.reviews} reviews • {hotel.roomType}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {hotel.amenities.map((amenity) => (
                              <Badge key={amenity} variant="outline" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex items-center justify-between border-t pt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Starting from</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold">${hotel.price}</span>
                            <span className="text-muted-foreground text-sm">/night</span>
                          </div>
                        </div>
                        <Button size="lg" asChild>
                          <Link href={`/hotels/${hotel.id}`}>View Details</Link>
                        </Button>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
