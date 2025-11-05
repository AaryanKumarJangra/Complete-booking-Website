"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Star, MapPin, CalendarIcon, Users, Phone, Mail, Loader2 } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
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

export default function HotelDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)
  
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [guests, setGuests] = useState("2")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")
  const [showPayment, setShowPayment] = useState(false)

  // Fetch hotel details
  useEffect(() => {
    if (params.id) {
      fetchHotel()
    }
  }, [params.id])

  const fetchHotel = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/hotels/${params.id}`)
      
      if (!response.ok) {
        throw new Error("Hotel not found")
      }
      
      const data = await response.json()
      setHotel(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load hotel")
      router.push("/hotels")
    } finally {
      setIsLoading(false)
    }
  }

  const calculateNights = () => {
    if (checkIn && checkOut) {
      const diff = checkOut.getTime() - checkIn.getTime()
      return Math.ceil(diff / (1000 * 60 * 60 * 24))
    }
    return 1
  }

  const nights = calculateNights()
  const subtotal = hotel ? hotel.price * nights : 0
  const taxes = subtotal * 0.1
  const total = subtotal + taxes

  const handleBooking = () => {
    if (!checkIn || !checkOut || !fullName || !email || !phone) {
      toast.error("Please fill in all required fields")
      return
    }
    
    if (!guests || parseInt(guests) < 1) {
      toast.error("Please enter a valid number of guests")
      return
    }
    
    setShowPayment(true)
  }

  const handlePayment = async () => {
    if (!hotel) return
    
    setIsBooking(true)
    
    try {
      const bookingData = {
        hotel_id: hotel.id,
        check_in: checkIn!.toISOString(),
        check_out: checkOut!.toISOString(),
        guests: parseInt(guests),
        full_name: fullName,
        email: email,
        phone: phone,
        special_requests: specialRequests || null,
        subtotal: subtotal,
        taxes: taxes,
        total_price: total,
        status: "confirmed"
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bookingData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create booking")
      }

      const booking = await response.json()
      toast.success("Booking confirmed! Check your email for confirmation details.")
      router.push("/profile/bookings")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create booking")
    } finally {
      setIsBooking(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    )
  }

  if (!hotel) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Hotel Info */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{hotel.name}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {hotel.address}
                </span>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {hotel.rating} ({hotel.reviews} reviews)
                </Badge>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {hotel.images.map((image: string, index: number) => (
              <div key={index} className="relative h-64 rounded-lg overflow-hidden card-hover-effect">
                <Image src={image} alt={`${hotel.name} ${index + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>

          {/* Description */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>About this property</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">{hotel.description}</p>
              
              <div>
                <h3 className="font-semibold mb-3">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {hotel.amenities.map((amenity: string) => (
                    <div key={amenity} className="flex items-center gap-2">
                      <Badge variant="outline">{amenity}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Reservation Details</CardTitle>
                <CardDescription>Fill in your booking information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Dates and Guests */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Check In</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !checkIn && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkIn ? format(checkIn, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Check Out</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !checkOut && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkOut ? format(checkOut, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guests">Guests</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="guests"
                        type="number"
                        min="1"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Guest Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Guest Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requests">Special Requests (Optional)</Label>
                    <Textarea
                      id="requests"
                      placeholder="Any special requirements or requests..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>

                {showPayment && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="font-semibold">Payment Information</h3>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                {!showPayment ? (
                  <Button size="lg" className="w-full btn-primary-enhanced" onClick={handleBooking}>
                    Proceed to Payment
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    className="w-full btn-primary-enhanced" 
                    onClick={handlePayment}
                    disabled={isBooking}
                  >
                    {isBooking ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Price Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Room Type</span>
                    <span className="font-medium">{hotel.roomType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      ₹{hotel.price.toLocaleString('en-IN')} × {nights} night{nights !== 1 ? "s" : ""}
                    </span>
                    <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes & Fees</span>
                    <span className="font-medium">₹{taxes.toFixed(2)}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}