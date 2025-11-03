"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Hotel, Plane, Car, Users, DollarSign, TrendingUp, Edit, Trash2, Plus, Search } from "lucide-react"

// Mock data
const mockStats = {
  totalRevenue: 125430,
  totalBookings: 342,
  totalUsers: 1256,
  activeBookings: 89
}

const mockHotels = [
  { id: 1, name: "Grand Plaza Hotel", location: "New York, USA", price: 299, rating: 4.8, rooms: 150, status: "active" },
  { id: 2, name: "Seaside Resort", location: "Miami, USA", price: 399, rating: 4.9, rooms: 200, status: "active" },
  { id: 3, name: "Mountain View Lodge", location: "Colorado, USA", price: 249, rating: 4.7, rooms: 80, status: "active" }
]

const mockFlights = [
  { id: 1, airline: "SkyWings Airlines", route: "JFK → LHR", price: 599, class: "Economy", status: "active" },
  { id: 2, airline: "Pacific Air", route: "LAX → NRT", price: 899, class: "Business", status: "active" },
  { id: 3, airline: "Euro Express", route: "CDG → BCN", price: 149, class: "Economy", status: "active" }
]

const mockTaxis = [
  { id: 1, type: "Sedan", model: "Toyota Camry", pricePerKm: 2.5, capacity: 4, status: "active" },
  { id: 2, type: "SUV", model: "Honda CR-V", pricePerKm: 3.5, capacity: 6, status: "active" },
  { id: 3, type: "Luxury", model: "Mercedes S-Class", pricePerKm: 5.5, capacity: 4, status: "active" }
]

const mockBookings = [
  { id: "BK001", user: "John Doe", type: "Hotel", service: "Grand Plaza Hotel", date: "2024-02-15", amount: 598, status: "confirmed" },
  { id: "BK002", user: "Jane Smith", type: "Flight", service: "SkyWings Airlines", date: "2024-03-10", amount: 599, status: "confirmed" },
  { id: "BK003", user: "Bob Johnson", type: "Taxi", service: "Sedan - Toyota Camry", date: "2024-02-15", amount: 45, status: "completed" },
  { id: "BK004", user: "Alice Brown", type: "Hotel", service: "Seaside Resort", date: "2024-04-05", amount: 1197, status: "pending" }
]

const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", bookings: 5, joined: "2024-01-15", status: "active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", bookings: 8, joined: "2024-01-10", status: "active" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", bookings: 3, joined: "2024-02-01", status: "active" }
]

export default function AdminDashboard() {
  const [hotels, setHotels] = useState(mockHotels)
  const [flights, setFlights] = useState(mockFlights)
  const [taxis, setTaxis] = useState(mockTaxis)
  const [bookings] = useState(mockBookings)
  const [users, setUsers] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")

  // Hotel CRUD
  const [editingHotel, setEditingHotel] = useState<any>(null)
  const [hotelForm, setHotelForm] = useState({ name: "", location: "", price: "", rating: "", rooms: "" })

  const handleAddHotel = () => {
    const newHotel = {
      id: hotels.length + 1,
      name: hotelForm.name,
      location: hotelForm.location,
      price: Number(hotelForm.price),
      rating: Number(hotelForm.rating),
      rooms: Number(hotelForm.rooms),
      status: "active"
    }
    setHotels([...hotels, newHotel])
    setHotelForm({ name: "", location: "", price: "", rating: "", rooms: "" })
    alert("Hotel added successfully!")
  }

  const handleUpdateHotel = () => {
    setHotels(hotels.map(h => h.id === editingHotel.id ? { ...h, ...hotelForm } : h))
    setEditingHotel(null)
    setHotelForm({ name: "", location: "", price: "", rating: "", rooms: "" })
    alert("Hotel updated successfully!")
  }

  const handleDeleteHotel = (id: number) => {
    if (confirm("Are you sure you want to delete this hotel?")) {
      setHotels(hotels.filter(h => h.id !== id))
    }
  }

  // Flight CRUD
  const [editingFlight, setEditingFlight] = useState<any>(null)
  const [flightForm, setFlightForm] = useState({ airline: "", route: "", price: "", class: "" })

  const handleAddFlight = () => {
    const newFlight = {
      id: flights.length + 1,
      airline: flightForm.airline,
      route: flightForm.route,
      price: Number(flightForm.price),
      class: flightForm.class,
      status: "active"
    }
    setFlights([...flights, newFlight])
    setFlightForm({ airline: "", route: "", price: "", class: "" })
    alert("Flight added successfully!")
  }

  const handleUpdateFlight = () => {
    setFlights(flights.map(f => f.id === editingFlight.id ? { ...f, ...flightForm } : f))
    setEditingFlight(null)
    setFlightForm({ airline: "", route: "", price: "", class: "" })
    alert("Flight updated successfully!")
  }

  const handleDeleteFlight = (id: number) => {
    if (confirm("Are you sure you want to delete this flight?")) {
      setFlights(flights.filter(f => f.id !== id))
    }
  }

  // Taxi CRUD
  const [editingTaxi, setEditingTaxi] = useState<any>(null)
  const [taxiForm, setTaxiForm] = useState({ type: "", model: "", pricePerKm: "", capacity: "" })

  const handleAddTaxi = () => {
    const newTaxi = {
      id: taxis.length + 1,
      type: taxiForm.type,
      model: taxiForm.model,
      pricePerKm: Number(taxiForm.pricePerKm),
      capacity: Number(taxiForm.capacity),
      status: "active"
    }
    setTaxis([...taxis, newTaxi])
    setTaxiForm({ type: "", model: "", pricePerKm: "", capacity: "" })
    alert("Taxi added successfully!")
  }

  const handleUpdateTaxi = () => {
    setTaxis(taxis.map(t => t.id === editingTaxi.id ? { ...t, ...taxiForm } : t))
    setEditingTaxi(null)
    setTaxiForm({ type: "", model: "", pricePerKm: "", capacity: "" })
    alert("Taxi updated successfully!")
  }

  const handleDeleteTaxi = (id: number) => {
    if (confirm("Are you sure you want to delete this taxi?")) {
      setTaxis(taxis.filter(t => t.id !== id))
    }
  }

  const handleToggleUserStatus = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your booking platform</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="hotels">Hotels</TabsTrigger>
            <TabsTrigger value="flights">Flights</TabsTrigger>
            <TabsTrigger value="taxis">Taxis</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${mockStats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.totalBookings}</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                  <Hotel className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.activeBookings}</div>
                  <p className="text-xs text-muted-foreground">Currently in progress</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Hotels Listed</span>
                    <span className="font-medium">{hotels.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Flights Listed</span>
                    <span className="font-medium">{flights.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Taxis Listed</span>
                    <span className="font-medium">{taxis.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Hotels Tab */}
          <TabsContent value="hotels" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Hotels Management</CardTitle>
                    <CardDescription>Add, edit, or remove hotels</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Hotel
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>{editingHotel ? "Edit Hotel" : "Add New Hotel"}</DialogTitle>
                        <DialogDescription>
                          {editingHotel ? "Update hotel information" : "Enter details for the new hotel"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="hotel-name">Hotel Name</Label>
                          <Input
                            id="hotel-name"
                            value={hotelForm.name}
                            onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
                            placeholder="Grand Plaza Hotel"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="hotel-location">Location</Label>
                          <Input
                            id="hotel-location"
                            value={hotelForm.location}
                            onChange={(e) => setHotelForm({ ...hotelForm, location: e.target.value })}
                            placeholder="New York, USA"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="hotel-price">Price/Night</Label>
                            <Input
                              id="hotel-price"
                              type="number"
                              value={hotelForm.price}
                              onChange={(e) => setHotelForm({ ...hotelForm, price: e.target.value })}
                              placeholder="299"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="hotel-rating">Rating</Label>
                            <Input
                              id="hotel-rating"
                              type="number"
                              step="0.1"
                              max="5"
                              value={hotelForm.rating}
                              onChange={(e) => setHotelForm({ ...hotelForm, rating: e.target.value })}
                              placeholder="4.8"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="hotel-rooms">Rooms</Label>
                            <Input
                              id="hotel-rooms"
                              type="number"
                              value={hotelForm.rooms}
                              onChange={(e) => setHotelForm({ ...hotelForm, rooms: e.target.value })}
                              placeholder="150"
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={editingHotel ? handleUpdateHotel : handleAddHotel}>
                          {editingHotel ? "Update" : "Add"} Hotel
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Rooms</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hotels.map((hotel) => (
                      <TableRow key={hotel.id}>
                        <TableCell>{hotel.id}</TableCell>
                        <TableCell className="font-medium">{hotel.name}</TableCell>
                        <TableCell>{hotel.location}</TableCell>
                        <TableCell>${hotel.price}</TableCell>
                        <TableCell>{hotel.rating}</TableCell>
                        <TableCell>{hotel.rooms}</TableCell>
                        <TableCell>
                          <Badge variant={hotel.status === "active" ? "default" : "secondary"}>
                            {hotel.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingHotel(hotel)
                                setHotelForm({
                                  name: hotel.name,
                                  location: hotel.location,
                                  price: hotel.price.toString(),
                                  rating: hotel.rating.toString(),
                                  rooms: hotel.rooms.toString()
                                })
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteHotel(hotel.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Flights Tab */}
          <TabsContent value="flights" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Flights Management</CardTitle>
                    <CardDescription>Add, edit, or remove flights</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Flight
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingFlight ? "Edit Flight" : "Add New Flight"}</DialogTitle>
                        <DialogDescription>
                          {editingFlight ? "Update flight information" : "Enter details for the new flight"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="flight-airline">Airline</Label>
                          <Input
                            id="flight-airline"
                            value={flightForm.airline}
                            onChange={(e) => setFlightForm({ ...flightForm, airline: e.target.value })}
                            placeholder="SkyWings Airlines"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="flight-route">Route</Label>
                          <Input
                            id="flight-route"
                            value={flightForm.route}
                            onChange={(e) => setFlightForm({ ...flightForm, route: e.target.value })}
                            placeholder="JFK → LHR"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="flight-price">Price</Label>
                            <Input
                              id="flight-price"
                              type="number"
                              value={flightForm.price}
                              onChange={(e) => setFlightForm({ ...flightForm, price: e.target.value })}
                              placeholder="599"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="flight-class">Class</Label>
                            <Select
                              value={flightForm.class}
                              onValueChange={(value) => setFlightForm({ ...flightForm, class: value })}
                            >
                              <SelectTrigger id="flight-class">
                                <SelectValue placeholder="Select class" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Economy">Economy</SelectItem>
                                <SelectItem value="Premium Economy">Premium Economy</SelectItem>
                                <SelectItem value="Business">Business</SelectItem>
                                <SelectItem value="First Class">First Class</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={editingFlight ? handleUpdateFlight : handleAddFlight}>
                          {editingFlight ? "Update" : "Add"} Flight
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Airline</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {flights.map((flight) => (
                      <TableRow key={flight.id}>
                        <TableCell>{flight.id}</TableCell>
                        <TableCell className="font-medium">{flight.airline}</TableCell>
                        <TableCell>{flight.route}</TableCell>
                        <TableCell>${flight.price}</TableCell>
                        <TableCell>{flight.class}</TableCell>
                        <TableCell>
                          <Badge variant={flight.status === "active" ? "default" : "secondary"}>
                            {flight.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingFlight(flight)
                                setFlightForm({
                                  airline: flight.airline,
                                  route: flight.route,
                                  price: flight.price.toString(),
                                  class: flight.class
                                })
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteFlight(flight.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Taxis Tab */}
          <TabsContent value="taxis" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Taxis Management</CardTitle>
                    <CardDescription>Add, edit, or remove taxis</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Taxi
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingTaxi ? "Edit Taxi" : "Add New Taxi"}</DialogTitle>
                        <DialogDescription>
                          {editingTaxi ? "Update taxi information" : "Enter details for the new taxi"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="taxi-type">Type</Label>
                          <Select
                            value={taxiForm.type}
                            onValueChange={(value) => setTaxiForm({ ...taxiForm, type: value })}
                          >
                            <SelectTrigger id="taxi-type">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Economy">Economy</SelectItem>
                              <SelectItem value="Sedan">Sedan</SelectItem>
                              <SelectItem value="SUV">SUV</SelectItem>
                              <SelectItem value="Luxury">Luxury</SelectItem>
                              <SelectItem value="Van">Van</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="taxi-model">Model</Label>
                          <Input
                            id="taxi-model"
                            value={taxiForm.model}
                            onChange={(e) => setTaxiForm({ ...taxiForm, model: e.target.value })}
                            placeholder="Toyota Camry"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="taxi-price">Price/km</Label>
                            <Input
                              id="taxi-price"
                              type="number"
                              step="0.1"
                              value={taxiForm.pricePerKm}
                              onChange={(e) => setTaxiForm({ ...taxiForm, pricePerKm: e.target.value })}
                              placeholder="2.5"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="taxi-capacity">Capacity</Label>
                            <Input
                              id="taxi-capacity"
                              type="number"
                              value={taxiForm.capacity}
                              onChange={(e) => setTaxiForm({ ...taxiForm, capacity: e.target.value })}
                              placeholder="4"
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={editingTaxi ? handleUpdateTaxi : handleAddTaxi}>
                          {editingTaxi ? "Update" : "Add"} Taxi
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Price/km</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taxis.map((taxi) => (
                      <TableRow key={taxi.id}>
                        <TableCell>{taxi.id}</TableCell>
                        <TableCell className="font-medium">{taxi.type}</TableCell>
                        <TableCell>{taxi.model}</TableCell>
                        <TableCell>${taxi.pricePerKm}</TableCell>
                        <TableCell>{taxi.capacity} passengers</TableCell>
                        <TableCell>
                          <Badge variant={taxi.status === "active" ? "default" : "secondary"}>
                            {taxi.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingTaxi(taxi)
                                setTaxiForm({
                                  type: taxi.type,
                                  model: taxi.model,
                                  pricePerKm: taxi.pricePerKm.toString(),
                                  capacity: taxi.capacity.toString()
                                })
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteTaxi(taxi.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Bookings</CardTitle>
                    <CardDescription>View and manage all bookings</CardDescription>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search bookings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.id}</TableCell>
                        <TableCell>{booking.user}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{booking.type}</Badge>
                        </TableCell>
                        <TableCell>{booking.service}</TableCell>
                        <TableCell>{booking.date}</TableCell>
                        <TableCell>${booking.amount}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              booking.status === "confirmed"
                                ? "default"
                                : booking.status === "pending"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Users Management</CardTitle>
                    <CardDescription>View and manage all users</CardDescription>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Total Bookings</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.bookings}</TableCell>
                        <TableCell>{user.joined}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === "active" ? "default" : "secondary"}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              View Profile
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleUserStatus(user.id)}
                            >
                              {user.status === "active" ? "Deactivate" : "Activate"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
