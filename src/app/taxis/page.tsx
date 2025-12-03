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
import { Car, Users, Briefcase, Navigation, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Taxi {
  id: number
  type: string
  model: string
  capacity: number
  luggage: number
  pricePerKm: number
  features: string[] | string
  rating: number
  totalTrips: number
  available: boolean
  createdAt: string
}

export default function TaxisPage() {
  const [priceRange, setPriceRange] = useState([0, 600])
  const [sortBy, setSortBy] = useState<string>("recommended")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [minCapacity, setMinCapacity] = useState<string>("any-capacity")
  const [taxis, setTaxis] = useState<Taxi[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTaxis()
  }, [priceRange, sortBy, selectedTypes, minCapacity])

  const fetchTaxis = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const token = localStorage.getItem("bearer_token")
      const params = new URLSearchParams()
      params.append("minPrice", "0")
      params.append("maxPrice", priceRange[1].toString())
      
      if (sortBy) {
        params.append("sortBy", sortBy)
      }
      
      if (minCapacity !== "any-capacity") {
        params.append("minCapacity", minCapacity)
      }

      const response = await fetch(`/api/taxis?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch taxis")
      }
      
      const data = await response.json()
      
      // Parse features if they're strings
      const parsedData = data.map((taxi: Taxi) => ({
        ...taxi,
        features: typeof taxi.features === 'string' ? JSON.parse(taxi.features) : taxi.features
      }))
      
      // Client-side filtering for types
      let filtered = parsedData
      
      if (selectedTypes.length > 0) {
        filtered = filtered.filter((taxi: Taxi) => selectedTypes.includes(taxi.type))
      }
      
      setTaxis(filtered)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      toast.error("Failed to load taxis")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const handleResetFilters = () => {
    setPriceRange([0, 600])
    setSortBy("recommended")
    setSelectedTypes([])
    setMinCapacity("any-capacity")
  }

  // Calculate estimated price for 10km trip
  const getEstimatedPrice = (pricePerKm: number) => {
    return pricePerKm * 10
  }

  // Helper to get features array
  const getFeatures = (features: string[] | string): string[] => {
    if (Array.isArray(features)) return features
    try {
      return JSON.parse(features)
    } catch {
      return []
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Available Taxis</h1>
          <p className="text-muted-foreground">
            {taxis.length} vehicles found • Estimated trip: 10 km
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
                  <Label>Price per km (₹)</Label>
                  <div className="pt-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={60}
                      step={5}
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
                      <Checkbox 
                        id="economy-car" 
                        checked={selectedTypes.includes("Economy")}
                        onCheckedChange={() => handleTypeToggle("Economy")}
                      />
                      <label htmlFor="economy-car" className="text-sm font-medium cursor-pointer">
                        Economy
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="sedan-car" 
                        checked={selectedTypes.includes("Sedan")}
                        onCheckedChange={() => handleTypeToggle("Sedan")}
                      />
                      <label htmlFor="sedan-car" className="text-sm font-medium cursor-pointer">
                        Sedan
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="suv-car" 
                        checked={selectedTypes.includes("SUV")}
                        onCheckedChange={() => handleTypeToggle("SUV")}
                      />
                      <label htmlFor="suv-car" className="text-sm font-medium cursor-pointer">
                        SUV
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="luxury-car" 
                        checked={selectedTypes.includes("Luxury")}
                        onCheckedChange={() => handleTypeToggle("Luxury")}
                      />
                      <label htmlFor="luxury-car" className="text-sm font-medium cursor-pointer">
                        Luxury
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="van-car" 
                        checked={selectedTypes.includes("Van")}
                        onCheckedChange={() => handleTypeToggle("Van")}
                      />
                      <label htmlFor="van-car" className="text-sm font-medium cursor-pointer">
                        Van
                      </label>
                    </div>
                  </div>
                </div>

                {/* Capacity */}
                <div className="space-y-3">
                  <Label>Minimum Capacity</Label>
                  <Select value={minCapacity} onValueChange={setMinCapacity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any capacity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any-capacity">Any capacity</SelectItem>
                      <SelectItem value="4">4+ Passengers</SelectItem>
                      <SelectItem value="6">6+ Passengers</SelectItem>
                      <SelectItem value="8">8+ Passengers</SelectItem>
                    </SelectContent>
                  </Select>
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
                Showing {taxis.length} results
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
                <Button onClick={fetchTaxis}>Try Again</Button>
              </Card>
            )}

            {/* Empty State */}
            {!isLoading && !error && taxis.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">No taxis found matching your criteria</p>
                <Button variant="outline" onClick={handleResetFilters}>Reset Filters</Button>
              </Card>
            )}

            {/* Taxi Cards */}
            {!isLoading && !error && taxis.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                {taxis.map((taxi) => {
                  const features = getFeatures(taxi.features)
                  return (
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
                            ⭐ {taxi.rating.toFixed(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{taxi.capacity} seats</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Briefcase className="h-4 w-4" />
                            <span>{taxi.luggage} bags</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {features.slice(0, 4).map((feature, index) => (
                            <Badge key={`${taxi.id}-${feature}-${index}`} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {taxi.totalTrips} completed trips
                          </span>
                          <Badge variant={taxi.available ? "default" : "secondary"}>
                            {taxi.available ? "Available" : "Busy"}
                          </Badge>
                        </div>
                      </CardContent>
                      <CardFooter className="flex items-center justify-between border-t pt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Estimated fare (10km)</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold">₹{getEstimatedPrice(taxi.pricePerKm)}</span>
                            <span className="text-xs text-muted-foreground">
                              (₹{taxi.pricePerKm}/km)
                            </span>
                          </div>
                        </div>
                        <Button asChild className="btn-primary-enhanced" disabled={!taxi.available}>
                          <Link href={`/taxis/${taxi.id}`}>Book Now</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}