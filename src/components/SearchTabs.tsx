"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Hotel, Plane, Car, MapPin, CalendarIcon, Users } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

export default function SearchTabs() {
  const router = useRouter()
  const [hotelLocation, setHotelLocation] = useState("")
  const [hotelCheckIn, setHotelCheckIn] = useState<Date>()
  const [hotelCheckOut, setHotelCheckOut] = useState<Date>()
  const [hotelGuests, setHotelGuests] = useState("2")

  const [flightFrom, setFlightFrom] = useState("")
  const [flightTo, setFlightTo] = useState("")
  const [flightDate, setFlightDate] = useState<Date>()
  const [flightPassengers, setFlightPassengers] = useState("1")

  const [taxiPickup, setTaxiPickup] = useState("")
  const [taxiDrop, setTaxiDrop] = useState("")
  const [taxiDate, setTaxiDate] = useState<Date>()

  const handleHotelSearch = () => {
    const params = new URLSearchParams({
      location: hotelLocation,
      checkIn: hotelCheckIn ? format(hotelCheckIn, "yyyy-MM-dd") : "",
      checkOut: hotelCheckOut ? format(hotelCheckOut, "yyyy-MM-dd") : "",
      guests: hotelGuests,
    })
    router.push(`/hotels?${params.toString()}`)
  }

  const handleFlightSearch = () => {
    const params = new URLSearchParams({
      from: flightFrom,
      to: flightTo,
      date: flightDate ? format(flightDate, "yyyy-MM-dd") : "",
      passengers: flightPassengers,
    })
    router.push(`/flights?${params.toString()}`)
  }

  const handleTaxiSearch = () => {
    const params = new URLSearchParams({
      pickup: taxiPickup,
      drop: taxiDrop,
      date: taxiDate ? format(taxiDate, "yyyy-MM-dd") : "",
    })
    router.push(`/taxis?${params.toString()}`)
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Tabs defaultValue="hotels" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1">
          <TabsTrigger value="hotels" className="flex items-center gap-2 py-3">
            <Hotel className="h-4 w-4" />
            <span className="hidden sm:inline">Hotels</span>
          </TabsTrigger>
          <TabsTrigger value="flights" className="flex items-center gap-2 py-3">
            <Plane className="h-4 w-4" />
            <span className="hidden sm:inline">Flights</span>
          </TabsTrigger>
          <TabsTrigger value="taxis" className="flex items-center gap-2 py-3">
            <Car className="h-4 w-4" />
            <span className="hidden sm:inline">Taxis</span>
          </TabsTrigger>
        </TabsList>

        {/* Hotels Tab */}
        <TabsContent value="hotels">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="hotel-location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="hotel-location"
                      placeholder="Where to?"
                      className="pl-9"
                      value={hotelLocation}
                      onChange={(e) => setHotelLocation(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Check In</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !hotelCheckIn && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {hotelCheckIn ? format(hotelCheckIn, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={hotelCheckIn}
                        onSelect={setHotelCheckIn}
                        initialFocus
                      />
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
                          !hotelCheckOut && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {hotelCheckOut ? format(hotelCheckOut, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={hotelCheckOut}
                        onSelect={setHotelCheckOut}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hotel-guests">Guests</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="hotel-guests"
                      type="number"
                      min="1"
                      placeholder="2"
                      className="pl-9"
                      value={hotelGuests}
                      onChange={(e) => setHotelGuests(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <Button className="w-full mt-4" size="lg" onClick={handleHotelSearch}>
                Search Hotels
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Flights Tab */}
        <TabsContent value="flights">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="flight-from">From</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="flight-from"
                      placeholder="Departure city"
                      className="pl-9"
                      value={flightFrom}
                      onChange={(e) => setFlightFrom(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flight-to">To</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="flight-to"
                      placeholder="Arrival city"
                      className="pl-9"
                      value={flightTo}
                      onChange={(e) => setFlightTo(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Departure Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !flightDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {flightDate ? format(flightDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={flightDate}
                        onSelect={setFlightDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flight-passengers">Passengers</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="flight-passengers"
                      type="number"
                      min="1"
                      placeholder="1"
                      className="pl-9"
                      value={flightPassengers}
                      onChange={(e) => setFlightPassengers(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <Button className="w-full mt-4" size="lg" onClick={handleFlightSearch}>
                Search Flights
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Taxis Tab */}
        <TabsContent value="taxis">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="taxi-pickup">Pickup Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="taxi-pickup"
                      placeholder="From where?"
                      className="pl-9"
                      value={taxiPickup}
                      onChange={(e) => setTaxiPickup(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxi-drop">Drop Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="taxi-drop"
                      placeholder="To where?"
                      className="pl-9"
                      value={taxiDrop}
                      onChange={(e) => setTaxiDrop(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Pickup Date & Time</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !taxiDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {taxiDate ? format(taxiDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={taxiDate}
                        onSelect={setTaxiDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <Button className="w-full mt-4" size="lg" onClick={handleTaxiSearch}>
                Search Taxis
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
