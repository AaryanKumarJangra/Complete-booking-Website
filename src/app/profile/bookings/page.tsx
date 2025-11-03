"use client"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Hotel, Plane, Car, Calendar, MapPin, Clock, DollarSign } from "lucide-react"
import Link from "next/link"

const mockBookings = [
  {
    id: "BK001",
    type: "hotel",
    name: "Grand Plaza Hotel",
    location: "New York, USA",
    date: "Feb 15-17, 2024",
    status: "confirmed",
    price: 598,
    details: "Deluxe Suite • 2 Nights"
  },
  {
    id: "BK002",
    type: "flight",
    name: "SkyWings Airlines",
    location: "New York → London",
    date: "Mar 10, 2024",
    status: "confirmed",
    price: 599,
    details: "Flight SW 1234 • Economy"
  },
  {
    id: "BK003",
    type: "taxi",
    name: "Sedan - Toyota Camry",
    location: "JFK Airport → Manhattan",
    date: "Feb 15, 2024, 10:00 AM",
    status: "completed",
    price: 45,
    details: "10 km • 25 min"
  },
  {
    id: "BK004",
    type: "hotel",
    name: "Seaside Resort",
    location: "Miami, USA",
    date: "Apr 5-8, 2024",
    status: "pending",
    price: 1197,
    details: "Ocean View • 3 Nights"
  }
]

const getIcon = (type: string) => {
  switch (type) {
    case "hotel":
      return <Hotel className="h-5 w-5" />
    case "flight":
      return <Plane className="h-5 w-5" />
    case "taxi":
      return <Car className="h-5 w-5" />
    default:
      return null
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "confirmed":
      return <Badge className="bg-green-500">Confirmed</Badge>
    case "pending":
      return <Badge variant="secondary">Pending</Badge>
    case "completed":
      return <Badge variant="outline">Completed</Badge>
    case "cancelled":
      return <Badge variant="destructive">Cancelled</Badge>
    default:
      return null
  }
}

export default function BookingsPage() {
  const activeBookings = mockBookings.filter(b => b.status === "confirmed" || b.status === "pending")
  const pastBookings = mockBookings.filter(b => b.status === "completed")

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
            <p className="text-muted-foreground">
              View and manage all your travel bookings
            </p>
          </div>

          <Tabs defaultValue="active" className="space-y-6">
            <TabsList>
              <TabsTrigger value="active">Active ({activeBookings.length})</TabsTrigger>
              <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
            </TabsList>

            {/* Active Bookings */}
            <TabsContent value="active" className="space-y-4">
              {activeBookings.length > 0 ? (
                activeBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            {getIcon(booking.type)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{booking.name}</CardTitle>
                            <CardDescription className="mt-1">
                              Booking ID: {booking.id}
                            </CardDescription>
                          </div>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.details}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between border-t pt-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xl font-bold">${booking.price}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline">View Details</Button>
                        {booking.status === "confirmed" && (
                          <Button variant="destructive">Cancel</Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No active bookings</p>
                    <Button asChild>
                      <Link href="/">Start Booking</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Past Bookings */}
            <TabsContent value="past" className="space-y-4">
              {pastBookings.length > 0 ? (
                pastBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                            {getIcon(booking.type)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{booking.name}</CardTitle>
                            <CardDescription className="mt-1">
                              Booking ID: {booking.id}
                            </CardDescription>
                          </div>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.details}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between border-t pt-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xl font-bold">${booking.price}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline">View Receipt</Button>
                        <Button variant="outline">Book Again</Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No past bookings</p>
                    <Button asChild>
                      <Link href="/">Start Booking</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  )
}
