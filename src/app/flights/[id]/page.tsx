"use client"
// importScripts ;
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Plane, Clock, Calendar as CalendarIcon, ArrowRight, Luggage, Users, Mail, Phone } from "lucide-react"
import { toast } from "sonner"

const mockFlightData: Record<string, any> = {
  "1": {
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
    date: "2024-02-15",
    aircraft: "Boeing 787-9",
    baggageAllowance: "2 checked bags (23kg each)",
    meals: "Complimentary meals and beverages",
    entertainment: "In-flight entertainment system"
  }
}

export default function FlightDetailPage() {
  const params = useParams()
  const router = useRouter()
  const flight = mockFlightData[params.id as string] || mockFlightData["1"]
  
  const [passengers, setPassengers] = useState([
    { firstName: "", lastName: "", dateOfBirth: "", passportNumber: "" }
  ])
  const [contactEmail, setContactEmail] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [showPayment, setShowPayment] = useState(false)

  const addPassenger = () => {
    setPassengers([...passengers, { firstName: "", lastName: "", dateOfBirth: "", passportNumber: "" }])
  }

  const updatePassenger = (index: number, field: string, value: string) => {
    const updated = [...passengers]
    updated[index] = { ...updated[index], [field]: value }
    setPassengers(updated)
  }

  const handleBooking = () => {
    const allFilled = passengers.every(p => p.firstName && p.lastName && p.dateOfBirth && p.passportNumber)
    if (!allFilled || !contactEmail || !contactPhone) {
      toast.error("Please fill in all required fields")
      return
    }
    setShowPayment(true)
  }

  const handlePayment = () => {
    toast.success("Flight booked successfully! Check your email for ticket details.")
    router.push("/profile/bookings")
  }

  const subtotal = flight.price * passengers.length
  const taxes = subtotal * 0.15
  const total = subtotal + taxes

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Flight Info */}
        <Card className="mb-8 card-hover-effect">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Plane className="h-6 w-6" />
                  {flight.airline}
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  Flight {flight.flightNumber} • {flight.aircraft}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-base px-4 py-2">
                {flight.class}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center mb-6">
              {/* Departure */}
              <div>
                <p className="text-3xl font-bold">{flight.departure}</p>
                <p className="text-lg text-muted-foreground">{flight.from}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  {flight.date}
                </div>
              </div>

              {/* Duration */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="h-px w-24 bg-border" />
                  <ArrowRight className="h-5 w-5" />
                  <div className="h-px w-24 bg-border" />
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{flight.duration}</span>
                </div>
                <Badge variant="outline">{flight.stops}</Badge>
              </div>

              {/* Arrival */}
              <div className="text-right">
                <p className="text-3xl font-bold">{flight.arrival}</p>
                <p className="text-lg text-muted-foreground">{flight.to}</p>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Baggage Allowance</p>
                <p className="font-medium flex items-center gap-2">
                  <Luggage className="h-4 w-4" />
                  {flight.baggageAllowance}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Meals</p>
                <p className="font-medium">{flight.meals}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Entertainment</p>
                <p className="font-medium">{flight.entertainment}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Passenger Information</CardTitle>
                <CardDescription>Enter details for all passengers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Passengers */}
                {passengers.map((passenger, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Passenger {index + 1}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>First Name *</Label>
                        <Input
                          placeholder="John"
                          value={passenger.firstName}
                          onChange={(e) => updatePassenger(index, "firstName", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name *</Label>
                        <Input
                          placeholder="Doe"
                          value={passenger.lastName}
                          onChange={(e) => updatePassenger(index, "lastName", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date of Birth *</Label>
                        <Input
                          type="date"
                          value={passenger.dateOfBirth}
                          onChange={(e) => updatePassenger(index, "dateOfBirth", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Passport Number *</Label>
                        <Input
                          placeholder="A12345678"
                          value={passenger.passportNumber}
                          onChange={(e) => updatePassenger(index, "passportNumber", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button variant="outline" onClick={addPassenger} className="w-full">
                  + Add Another Passenger
                </Button>

                <Separator />

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
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
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>
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
                <CardTitle>Price Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Flight Class</span>
                    <span className="font-medium">{flight.class}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      ₹{flight.price.toLocaleString('en-IN')} × {passengers.length} passenger{passengers.length !== 1 ? "s" : ""}
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