"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plane, Clock, Calendar, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Flight {
  id: number
  airline: string
  flightNumber: string
  fromLocation: string
  toLocation: string
  departure: string
  arrival: string
  duration: string
  stops: string
  price: number
  class: string
  date: string
  availableSeats: number
  createdAt: string
}

export default function FlightsPage() {
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [sortBy, setSortBy] = useState<string>("recommended")
  const [selectedStops, setSelectedStops] = useState<string[]>([])
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])
  const [flights, setFlights] = useState<Flight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFlights()
  }, [priceRange, sortBy, selectedStops, selectedClasses])

  const fetchFlights = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const token = localStorage.getItem("bearer_token")
      const params = new URLSearchParams()
      params.append("minPrice", priceRange[0].toString())
      params.append("maxPrice", priceRange[1].toString())
      
      if (sortBy) {
        params.append("sortBy", sortBy)
      }

      const response = await fetch(`/api/flights?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch flights")
      }
      
      const data = await response.json()
      
      // Client-side filtering for stops and classes
      let filtered = data
      
      if (selectedStops.length > 0) {
        filtered = filtered.filter((flight: Flight) => selectedStops.includes(flight.stops))
      }
      
      if (selectedClasses.length > 0) {
        filtered = filtered.filter((flight: Flight) => selectedClasses.includes(flight.class))
      }
      
      setFlights(filtered)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      toast.error("Failed to load flights")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStopToggle = (stop: string) => {
    setSelectedStops(prev => 
      prev.includes(stop)
        ? prev.filter(s => s !== stop)
        : [...prev, stop]
    )
  }

  const handleClassToggle = (flightClass: string) => {
    setSelectedClasses(prev => 
      prev.includes(flightClass)
        ? prev.filter(c => c !== flightClass)
        : [...prev, flightClass]
    )
  }

  const handleResetFilters = () => {
    setPriceRange([0, 100000])
    setSortBy("recommended")
    setSelectedStops([])
    setSelectedClasses([])
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Available Flights</h1>
          <p className="text-muted-foreground">
            {flights.length} flights found
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
                      <Checkbox 
                        id="nonstop" 
                        checked={selectedStops.includes("Non-stop")}
                        onCheckedChange={() => handleStopToggle("Non-stop")}
                      />
                      <label htmlFor="nonstop" className="text-sm font-medium cursor-pointer">
                        Non-stop
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="onestop" 
                        checked={selectedStops.includes("1 Stop")}
                        onCheckedChange={() => handleStopToggle("1 Stop")}
                      />
                      <label htmlFor="onestop" className="text-sm font-medium cursor-pointer">
                        1 Stop
                      </label>
                    </div>
                  </div>
                </div>

                {/* Class */}
                <div className="space-y-3">
                  <Label>Class</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="economy" 
                        checked={selectedClasses.includes("Economy")}
                        onCheckedChange={() => handleClassToggle("Economy")}
                      />
                      <label htmlFor="economy" className="text-sm font-medium cursor-pointer">
                        Economy
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="premium" 
                        checked={selectedClasses.includes("Premium Economy")}
                        onCheckedChange={() => handleClassToggle("Premium Economy")}
                      />
                      <label htmlFor="premium" className="text-sm font-medium cursor-pointer">
                        Premium Economy
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="business" 
                        checked={selectedClasses.includes("Business")}
                        onCheckedChange={() => handleClassToggle("Business")}
                      />
                      <label htmlFor="business" className="text-sm font-medium cursor-pointer">
                        Business
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="first" 
                        checked={selectedClasses.includes("First Class")}
                        onCheckedChange={() => handleClassToggle("First Class")}
                      />
                      <label htmlFor="first" className="text-sm font-medium cursor-pointer">
                        First Class
                      </label>
                    </div>
                  </div>
                </div>

                <Button className="w-full" variant="outline" onClick={handleResetFilters}>
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
                Showing {flights.length} results
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
                </SelectContent>
              </Select>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={fetchFlights}>Try Again</Button>
              </Card>
            )}

            {/* Empty State */}
            {!isLoading && !error && flights.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">No flights found matching your criteria</p>
                <Button variant="outline" onClick={handleResetFilters}>Reset Filters</Button>
              </Card>
            )}

            {/* Flight Cards */}
            {!isLoading && !error && flights.length > 0 && (
              <div className="space-y-4">
                {flights.map((flight) => (
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
                          <p className="text-sm text-muted-foreground">{flight.fromLocation}</p>
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
                          <p className="text-sm text-muted-foreground">{flight.toLocation}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {flight.availableSeats} seats available
                          </p>
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
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}