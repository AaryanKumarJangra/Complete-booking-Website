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
import { Plane, Clock, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

const mockFlights = [
  {
    id: 1,
    airline: "SkyWings Airlines",
    flightNumber: "SW 1234",
    from: "New York (JFK)",
    to: "London (LHR)",
    departure: "08:00 AM",
    arrival: "08:30 PM",
    duration: "7h 30m",
    stops: "Non-stop",
    price: 49999,
    class: "Economy",
    date: "2024-02-15"
  },
  {
    id: 2,
    airline: "Pacific Air",
    flightNumber: "PA 5678",
    from: "Los Angeles (LAX)",
    to: "Tokyo (NRT)",
    departure: "11:00 PM",
    arrival: "05:45 PM+1",
    duration: "11h 45m",
    stops: "Non-stop",
    price: 74999,
    class: "Business",
    date: "2024-02-15"
  },
  {
    id: 3,
    airline: "Euro Express",
    flightNumber: "EE 9012",
    from: "Paris (CDG)",
    to: "Barcelona (BCN)",
    departure: "02:00 PM",
    arrival: "04:15 PM",
    duration: "2h 15m",
    stops: "Non-stop",
    price: 12499,
    class: "Economy",
    date: "2024-02-15"
  },
  {
    id: 4,
    airline: "Global Airlines",
    flightNumber: "GA 3456",
    from: "Dubai (DXB)",
    to: "Singapore (SIN)",
    departure: "03:30 AM",
    arrival: "02:45 PM",
    duration: "7h 15m",
    stops: "Non-stop",
    price: 62499,
    class: "Business",
    date: "2024-02-16"
  },
  {
    id: 5,
    airline: "Continental Air",
    flightNumber: "CA 7890",
    from: "Chicago (ORD)",
    to: "Miami (MIA)",
    departure: "06:45 AM",
    arrival: "11:30 AM",
    duration: "3h 45m",
    stops: "1 Stop",
    price: 16499,
    class: "Economy",
    date: "2024-02-15"
  },
  {
    id: 6,
    airline: "SkyWings Airlines",
    flightNumber: "SW 2468",
    from: "Sydney (SYD)",
    to: "Los Angeles (LAX)",
    departure: "09:00 PM",
    arrival: "05:30 PM",
    duration: "12h 30m",
    stops: "Non-stop",
    price: 91499,
    class: "Premium Economy",
    date: "2024-02-17"
  },
  {
    id: 7,
    airline: "Asian Express",
    flightNumber: "AE 1357",
    from: "Hong Kong (HKG)",
    to: "Bangkok (BKK)",
    departure: "01:15 PM",
    arrival: "03:30 PM",
    duration: "2h 15m",
    stops: "Non-stop",
    price: 15749,
    class: "Economy",
    date: "2024-02-15"
  },
  {
    id: 8,
    airline: "Trans Atlantic",
    flightNumber: "TA 9753",
    from: "Boston (BOS)",
    to: "Rome (FCO)",
    departure: "05:00 PM",
    arrival: "07:15 AM+1",
    duration: "8h 15m",
    stops: "Non-stop",
    price: 56499,
    class: "Economy",
    date: "2024-02-16"
  }
]

export default function FlightsPage() {
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [sortBy, setSortBy] = useState<string>("recommended")
  const [filteredFlights] = useState(mockFlights)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Available Flights</h1>
          <p className="text-muted-foreground">
            {filteredFlights.length} flights found
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
                  <Label>Price Range</Label>
                  <div className="pt-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={100000}
                      step={5000}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
                    <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Stops */}
                <div className="space-y-3">
                  <Label>Stops</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="nonstop" />
                      <label htmlFor="nonstop" className="text-sm font-medium cursor-pointer">
                        Non-stop
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="onestop" />
                      <label htmlFor="onestop" className="text-sm font-medium cursor-pointer">
                        1 Stop
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="twostop" />
                      <label htmlFor="twostop" className="text-sm font-medium cursor-pointer">
                        2+ Stops
                      </label>
                    </div>
                  </div>
                </div>

                {/* Class */}
                <div className="space-y-3">
                  <Label>Class</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="economy" />
                      <label htmlFor="economy" className="text-sm font-medium cursor-pointer">
                        Economy
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="premium" />
                      <label htmlFor="premium" className="text-sm font-medium cursor-pointer">
                        Premium Economy
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="business" />
                      <label htmlFor="business" className="text-sm font-medium cursor-pointer">
                        Business
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="first" />
                      <label htmlFor="first" className="text-sm font-medium cursor-pointer">
                        First Class
                      </label>
                    </div>
                  </div>
                </div>

                {/* Airlines */}
                <div className="space-y-3">
                  <Label>Airlines</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="skywings" />
                      <label htmlFor="skywings" className="text-sm font-medium cursor-pointer">
                        SkyWings Airlines
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pacific" />
                      <label htmlFor="pacific" className="text-sm font-medium cursor-pointer">
                        Pacific Air
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="euro" />
                      <label htmlFor="euro" className="text-sm font-medium cursor-pointer">
                        Euro Express
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
                Showing {filteredFlights.length} results
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="duration">Shortest Duration</SelectItem>
                  <SelectItem value="departure">Earliest Departure</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Flight Cards */}
            <div className="space-y-4">
              {filteredFlights.map((flight) => (
                <Card key={flight.id} className="card-hover-effect">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Plane className="h-5 w-5" />
                          {flight.airline}
                        </CardTitle>
                        <CardDescription>{flight.flightNumber}</CardDescription>
                      </div>
                      <Badge>{flight.class}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
                      {/* Departure */}
                      <div>
                        <p className="text-2xl font-bold">{flight.departure}</p>
                        <p className="text-sm text-muted-foreground">{flight.from}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {flight.date}
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <div className="h-px w-16 bg-border" />
                          <ArrowRight className="h-4 w-4" />
                          <div className="h-px w-16 bg-border" />
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <Clock className="h-3 w-3" />
                          {flight.duration}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {flight.stops}
                        </Badge>
                      </div>

                      {/* Arrival */}
                      <div className="text-right">
                        <p className="text-2xl font-bold">{flight.arrival}</p>
                        <p className="text-sm text-muted-foreground">{flight.to}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t pt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Price per person</p>
                      <span className="text-3xl font-bold">₹{flight.price.toLocaleString('en-IN')}</span>
                    </div>
                    <Button size="lg" asChild className="btn-primary-enhanced">
                      <Link href={`/flights/${flight.id}`}>Select Flight</Link>
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