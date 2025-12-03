"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, User, LogOut, Loader2 } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authClient, useSession } from "@/lib/auth-client"
import { toast } from "sonner"
import { useState } from "react"

export default function Navbar() {
  const router = useRouter()
  const { data: session, isPending, refetch } = useSession()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleSignOut = async () => {
    setIsLoggingOut(true)
    const token = localStorage.getItem("bearer_token")

    const { error } = await authClient.signOut({
      fetchOptions: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })
    
    if (error?.code) {
      toast.error("Failed to logout. Please try again.")
      setIsLoggingOut(false)
    } else {
      localStorage.removeItem("bearer_token")
      toast.success("Logged out successfully")
      refetch()
      router.push("/login")
      router.refresh()
    }
  }

  const isAuthenticated = !!session?.user
  const userName = session?.user?.name || "User"

  return (
    <nav className="border-b bg-white/95 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            TravelBook
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/hotels" className="text-sm font-medium hover:text-primary transition-colors">
              Hotels
            </Link>
            <Link href="/flights" className="text-sm font-medium hover:text-primary transition-colors">
              Flights
            </Link>
            <Link href="/taxis" className="text-sm font-medium hover:text-primary transition-colors">
              Taxis
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    {userName}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/bookings">My Bookings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} disabled={isLoggingOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-8">
                <Link href="/hotels" className="text-lg font-medium hover:text-primary transition-colors">
                  Hotels
                </Link>
                <Link href="/flights" className="text-lg font-medium hover:text-primary transition-colors">
                  Flights
                </Link>
                <Link href="/taxis" className="text-lg font-medium hover:text-primary transition-colors">
                  Taxis
                </Link>
                <div className="border-t pt-4 mt-4">
                  {isPending ? (
                    <div className="flex justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : isAuthenticated ? (
                    <>
                      <div className="mb-4 p-3 bg-accent rounded-lg">
                        <p className="text-sm text-muted-foreground">Signed in as</p>
                        <p className="font-medium">{userName}</p>
                      </div>
                      <Link href="/profile" className="block py-2 text-lg font-medium">
                        My Profile
                      </Link>
                      <Link href="/profile/bookings" className="block py-2 text-lg font-medium">
                        My Bookings
                      </Link>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start mt-2"
                        onClick={handleSignOut}
                        disabled={isLoggingOut}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {isLoggingOut ? "Logging out..." : "Logout"}
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button asChild className="w-full">
                        <Link href="/register">Sign Up</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}