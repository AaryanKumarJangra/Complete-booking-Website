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
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, Users, Briefcase, MapPin, CalendarIcon, Clock, Phone, Mail } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const mockTaxiData: Record<string, any> = {
  "1": {
    id: 1,
    type: "Sedan",
    model: "Toyota Camry",
    capacity: 4,
    luggage: 2,
    pricePerKm: 18,
    estimatedPrice: 180,
    estimatedTime: "15 min",
    features: ["AC", "GPS", "Music System", "Phone Charger"],
    rating: 4.8,
    trips: 1234,
    driverName: "John Smith",
    licensePlate: "ABC 1234"
  }
}

export default function TaxiDetailPage() {
  const params = useParams()
  const router = useRouter()
  const taxi = mockTaxiData[params.id as string] || mockTaxiData["1"]
  
  const [pickupLocation, setPickupLocation] = useState("")
  const [dropLocation, setDropLocation] = useState("")
  const [pickupDate, setPickupDate] = useState<Date>()
  const [pickupTime, setPickupTime] = useState("")
  const [passengers, setPassengers] = useState("1")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [instructions, setInstructions] = useState("")
  const [showPayment, setShowPayment] = useState(false)

  const [estimatedDistance] = useState(10) // Mock distance in km
  const subtotal = taxi.pricePerKm * estimatedDistance
  const serviceFee = 50
  const total = subtotal + serviceFee

  const handleBooking = () => {
    if (!pickupLocation || !dropLocation || !pickupDate || !pickupTime || !fullName || !email || !phone) {
      toast.error("Please fill in all required fields")
      return
    }
    setShowPayment(true)
  }

  const handlePayment = () => {
    toast.success("Taxi booked successfully! Your driver will contact you shortly.")
    router.push("/profile/bookings")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Taxi Info */}
        <Card className="mb-8 card-hover-effect">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Car className="h-6 w-6" />
                  {taxi.type} - {taxi.model}
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  {taxi.licensePlate} • Driver: {taxi.driverName}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-base px-4 py-2">
                ⭐ {taxi.rating} ({taxi.trips} trips)
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Capacity</p>
                  <p className="font-medium">{taxi.capacity} passengers</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Luggage</p>
                  <p className="font-medium">{taxi.luggage} bags</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">ETA</p>
                  <p className="font-medium">{taxi.estimatedTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Car className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Rate</p>
                  <p className="font-medium">₹{taxi.pricePerKm}/km</p>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <p className="text-sm text-muted-foreground mb-2">Features</p>
              <div className="flex flex-wrap gap-2">
                {taxi.features.map((feature: string) => (
                  <Badge key={feature} variant="outline">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Ride Details</CardTitle>
                <CardDescription>Enter your trip information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Locations */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickup">Pickup Location *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="pickup"
                        placeholder="Enter pickup address"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="drop">Drop Location *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="drop"
                        placeholder="Enter destination address"
                        value={dropLocation}
                        onChange={(e) => setDropLocation(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Pickup Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !pickupDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {pickupDate ? format(pickupDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={pickupDate} onSelect={setPickupDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Pickup Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passengers">Passengers *</Label>
                    <Select value={passengers} onValueChange={setPassengers}>
                      <SelectTrigger id="passengers">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 passenger</SelectItem>
                        <SelectItem value="2">2 passengers</SelectItem>
                        <SelectItem value="3">3 passengers</SelectItem>
                        <SelectItem value="4">4 passengers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Contact Information</h3>
                  
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
                    <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                    <Textarea
                      id="instructions"
                      placeholder="Any special instructions for the driver..."
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      rows={3}
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
                  <Button size="lg" className="w-full btn-primary-enhanced" onClick={handlePayment}>
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
                <CardTitle>Fare Estimate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vehicle Type</span>
                    <span className="font-medium">{taxi.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      ₹{taxi.pricePerKm}/km × {estimatedDistance}km
                    </span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service Fee</span>
                    <span className="font-medium">₹{serviceFee.toFixed(2)}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Estimated Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  *Final fare may vary based on actual distance and waiting time
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}