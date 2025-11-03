"use client"

import { useState } from "react"
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
import { Star, MapPin, Wifi, Waves, Dumbbell, UtensilsCrossed, CalendarIcon, Users, Phone, Mail } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const mockHotelData: Record<string, any> = {
  "1": {
    id: 1,
    name: "Grand Plaza Hotel",
    location: "New York, USA",
    address: "123 Fifth Avenue, New York, NY 10001",
    rating: 4.8,
    reviews: 1284,
    price: 299,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop"
    ],
    amenities: ["Free WiFi", "Pool", "Spa", "Restaurant", "Gym", "Room Service"],
    roomType: "Deluxe Suite",
    description: "Experience luxury at its finest in our Grand Plaza Hotel. Located in the heart of New York City, our hotel offers stunning views and world-class amenities."
  }
}

export default function HotelDetailPage() {
  const params = useParams()
  const router = useRouter()
  const hotel = mockHotelData[params.id as string] || mockHotelData["1"]
  
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [guests, setGuests] = useState("2")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")
  const [showPayment, setShowPayment] = useState(false)

  const calculateNights = () => {
    if (checkIn && checkOut) {
      const diff = checkOut.getTime() - checkIn.getTime()
      return Math.ceil(diff / (1000 * 60 * 60 * 24))
    }
    return 1
  }

  const nights = calculateNights()
  const subtotal = hotel.price * nights
  const taxes = subtotal * 0.1
  const total = subtotal + taxes

  const handleBooking = () => {
    if (!checkIn || !checkOut || !fullName || !email || !phone) {
      alert("Please fill in all required fields")
      return
    }
    setShowPayment(true)
  }

  const handlePayment = () => {
    // Mock payment processing
    alert("Booking confirmed! Check your email for confirmation details.")
    router.push("/profile/bookings")
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
              <div key={index} className="relative h-64 rounded-lg overflow-hidden">
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
                  <Button size="lg" className="w-full" onClick={handleBooking}>
                    Proceed to Payment
                  </Button>
                ) : (
                  <Button size="lg" className="w-full" onClick={handlePayment}>
                    Confirm Booking
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
                      ${hotel.price} × {nights} night{nights !== 1 ? "s" : ""}
                    </span>
                    <span className="font-medium">${subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes & Fees</span>
                    <span className="font-medium">${taxes.toFixed(2)}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
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
