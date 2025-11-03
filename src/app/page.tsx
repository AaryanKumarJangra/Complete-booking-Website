"use client"

import Navbar from "@/components/Navbar"
import SearchTabs from "@/components/SearchTabs"
import FeaturedServices from "@/components/FeaturedServices"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Book Your Next Adventure
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Find the best deals on hotels, flights, and taxis. Travel made simple.
            </p>
          </div>
          
          {/* Search Tabs */}
          <SearchTabs />
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Best Price Guarantee</h3>
                <p className="text-sm text-muted-foreground">
                  Find the lowest prices or we'll refund the difference
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">24/7 Customer Support</h3>
                <p className="text-sm text-muted-foreground">
                  Our team is always here to help you
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Instant Confirmation</h3>
                <p className="text-sm text-muted-foreground">
                  Get booking confirmations in seconds
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="container mx-auto px-4 py-16">
        <FeaturedServices />
      </section>

      <Footer />
    </div>
  )
}