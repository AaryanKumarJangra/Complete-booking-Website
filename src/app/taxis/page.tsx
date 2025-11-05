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
import { Car, Users, Briefcase, Navigation } from "lucide-react"
import Link from "next/link"

const mockTaxis = [
  {
    id: 1,
    type: "Sedan",
    model: "Toyota Camry",
    capacity: 4,
    luggage: 2,
    pricePerKm: 18,
    estimatedPrice: 180,
    estimatedTime: "15 min",
    features: ["AC", "GPS", "Music System"],
    rating: 4.8,
    trips: 1234
  },
  {
    id: 2,
    type: "SUV",
    model: "Honda CR-V",
    capacity: 6,
    luggage: 4,
    pricePerKm: 25,
    estimatedPrice: 250,
    estimatedTime: "15 min",
    features: ["AC", "GPS", "Extra Luggage Space", "USB Charging"],
    rating: 4.9,
    trips: 892
  },
  {
    id: 3,
    type: "Luxury",
    model: "Mercedes S-Class",
    capacity: 4,
    luggage: 3,
    pricePerKm: 45,
    estimatedPrice: 450,
    estimatedTime: "12 min",
    features: ["Premium AC", "GPS", "Leather Seats", "WiFi", "Bottled Water"],
    rating: 5.0,
    trips: 654
  },
  {
    id: 4,
    type: "Economy",
    model: "Honda Civic",
    capacity: 4,
    luggage: 2,
    pricePerKm: 12,
    estimatedPrice: 120,
    estimatedTime: "18 min",
    features: ["AC", "GPS"],
    rating: 4.5,
    trips: 2156
  },
  {
    id: 5,
    type: "Van",
    model: "Toyota Hiace",
    capacity: 8,
    luggage: 6,
    pricePerKm: 30,
    estimatedPrice: 300,
    estimatedTime: "20 min",
    features: ["AC", "GPS", "Extra Space", "USB Charging"],
    rating: 4.7,
    trips: 432
  },
  {
    id: 6,
    type: "Premium SUV",
    model: "BMW X5",
    capacity: 5,
    luggage: 4,
    pricePerKm: 50,
    estimatedPrice: 500,
    estimatedTime: "10 min",
    features: ["Premium AC", "GPS", "Leather Seats", "WiFi", "Premium Sound"],
    rating: 4.9,
    trips: 321
  },
  {
    id: 7,
    type: "Compact",
    model: "Toyota Yaris",
    capacity: 3,
    luggage: 1,
    pricePerKm: 10,
    estimatedPrice: 100,
    estimatedTime: "20 min",
    features: ["AC", "GPS"],
    rating: 4.4,
    trips: 1567
  },
  {
    id: 8,
    type: "Electric",
    model: "Tesla Model 3",
    capacity: 4,
    luggage: 2,
    pricePerKm: 22,
    estimatedPrice: 220,
    estimatedTime: "14 min",
    features: ["AC", "GPS", "Eco-Friendly", "Autopilot", "Premium Sound"],
    rating: 4.8,
    trips: 543
  }
]

export default function TaxisPage() {
  const [priceRange, setPriceRange] = useState([0, 600])
  const [sortBy, setSortBy] = useState<string>("recommended")
  const [filteredTaxis] = useState(mockTaxis)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Available Taxis</h1>
          <p className="text-muted-foreground">
            {filteredTaxis.length} vehicles found • Estimated trip: 10 km
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
                  <Label>Estimated Price Range</Label>
                  <div className="pt-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={600}
                      step={50}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>

                {/* Vehicle Type */}
                <div className="space-y-3">
                  <Label>Vehicle Type</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="economy-car" />
                      <label htmlFor="economy-car" className="text-sm font-medium cursor-pointer">
                        Economy
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="sedan-car" />
                      <label htmlFor="sedan-car" className="text-sm font-medium cursor-pointer">
                        Sedan
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="suv-car" />
                      <label htmlFor="suv-car" className="text-sm font-medium cursor-pointer">
                        SUV
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="luxury-car" />
                      <label htmlFor="luxury-car" className="text-sm font-medium cursor-pointer">
                        Luxury
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="van-car" />
                      <label htmlFor="van-car" className="text-sm font-medium cursor-pointer">
                        Van
                      </label>
                    </div>
                  </div>
                </div>

                {/* Capacity */}
                <div className="space-y-3">
                  <Label>Minimum Capacity</Label>
                  <Select defaultValue="any-capacity">
                    <SelectTrigger>
                      <SelectValue placeholder="Any capacity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any-capacity">Any capacity</SelectItem>
                      <SelectItem value="4-capacity">4+ Passengers</SelectItem>
                      <SelectItem value="6-capacity">6+ Passengers</SelectItem>
                      <SelectItem value="8-capacity">8+ Passengers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <Label>Features</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="wifi-feature" />
                      <label htmlFor="wifi-feature" className="text-sm font-medium cursor-pointer">
                        WiFi
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="usb-feature" />
                      <label htmlFor="usb-feature" className="text-sm font-medium cursor-pointer">
                        USB Charging
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="leather-feature" />
                      <label htmlFor="leather-feature" className="text-sm font-medium cursor-pointer">
                        Leather Seats
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
                Showing {filteredTaxis.length} results
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
                  <SelectItem value="time">Shortest ETA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Taxi Cards */}
            <div className="grid gap-4 md:grid-cols-2">
              {filteredTaxis.map((taxi) => (
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
                      <Badge variant="secondary" className="flex items-center gap-1">
                        ⭐ {taxi.rating}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{taxi.capacity} seats</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Briefcase className="h-4 w-4" />
                        <span>{taxi.luggage} bags</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Navigation className="h-4 w-4" />
                        <span>{taxi.estimatedTime}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {taxi.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {taxi.trips} completed trips
                    </p>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t pt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated fare</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold">₹{taxi.estimatedPrice}</span>
                        <span className="text-xs text-muted-foreground">
                          (₹{taxi.pricePerKm}/km)
                        </span>
                      </div>
                    </div>
                    <Button asChild className="btn-primary-enhanced">
                      <Link href={`/taxis/${taxi.id}`}>Book Now</Link>
                    </Button>
                  </CardFooter>
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