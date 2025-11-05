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
import { Star, MapPin, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

interface Hotel {
  id: number
  name: string
  location: string
  address: string
  rating: number
  reviews: number
  price: number
  images: string[]
  amenities: string[]
  roomType: string
  description: string
  createdAt: string
}

export default function HotelsPage() {
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [selectedRating, setSelectedRating] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("recommended")
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([])
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const amenitiesFilter = [
    { id: "wifi", label: "Free WiFi" },
    { id: "pool", label: "Pool" },
    { id: "gym", label: "Gym" },
    { id: "restaurant", label: "Restaurant" }
  ]

  const roomTypeFilters = [
    { id: "standard", label: "Standard Room" },
    { id: "deluxe", label: "Deluxe Suite" },
    { id: "presidential", label: "Presidential Suite" }
  ]

  // Fetch hotels from API
  useEffect(() => {
    fetchHotels()
  }, [priceRange, selectedRating, sortBy, selectedAmenities])

  const fetchHotels = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      params.append("minPrice", priceRange[0].toString())
      params.append("maxPrice", priceRange[1].toString())
      
      if (selectedRating !== "all") {
        params.append("minRating", selectedRating)
      }
      
      if (sortBy) {
        params.append("sortBy", sortBy)
      }
      
      if (selectedAmenities.length > 0) {
        params.append("amenities", selectedAmenities.join(","))
      }

      const response = await fetch(`/api/hotels?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch hotels")
      }
      
      const data = await response.json()
      setHotels(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      toast.error("Failed to load hotels")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    )
  }

  const handleRoomTypeToggle = (roomType: string) => {
    setSelectedRoomTypes(prev => 
      prev.includes(roomType)
        ? prev.filter(r => r !== roomType)
        : [...prev, roomType]
    )
  }

  const handleResetFilters = () => {
    setPriceRange([0, 50000])
    setSelectedRating("all")
    setSortBy("recommended")
    setSelectedAmenities([])
    setSelectedRoomTypes([])
  }

  // Filter by room type client-side
  const filteredHotels = selectedRoomTypes.length > 0
    ? hotels.filter(hotel => selectedRoomTypes.includes(hotel.roomType))
    : hotels

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
                      max={50000}
                      step={1000}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
                    <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
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
                        <Checkbox 
                          id={amenity.id}
                          checked={selectedAmenities.includes(amenity.label)}
                          onCheckedChange={() => handleAmenityToggle(amenity.label)}
                        />
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
                    {roomTypeFilters.map((roomType) => (
                      <div key={roomType.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={roomType.id}
                          checked={selectedRoomTypes.includes(roomType.label)}
                          onCheckedChange={() => handleRoomTypeToggle(roomType.label)}
                        />
                        <label htmlFor={roomType.id} className="text-sm font-medium cursor-pointer">
                          {roomType.label}
                        </label>
                      </div>
                    ))}
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
                <Button onClick={fetchHotels}>Try Again</Button>
              </Card>
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredHotels.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">No hotels found matching your criteria</p>
                <Button variant="outline" onClick={handleResetFilters}>Reset Filters</Button>
              </Card>
            )}

            {/* Hotel Cards */}
            {!isLoading && !error && filteredHotels.length > 0 && (
              <div className="space-y-4">
                {filteredHotels.map((hotel) => (
                  <Card key={hotel.id} className="overflow-hidden card-hover-effect">
                    <div className="grid md:grid-cols-[300px_1fr] gap-0">
                      <div className="relative h-64 md:h-full">
                        <Image
                          src={hotel.images[0] || "/placeholder.jpg"}
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
                              {hotel.amenities.slice(0, 4).map((amenity) => (
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
                              <span className="text-3xl font-bold">₹{hotel.price.toLocaleString('en-IN')}</span>
                              <span className="text-muted-foreground text-sm">/night</span>
                            </div>
                          </div>
                          <Button size="lg" asChild className="btn-primary-enhanced">
                            <Link href={`/hotels/${hotel.id}`}>View Details</Link>
                          </Button>
                        </CardFooter>
                      </div>
                    </div>
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