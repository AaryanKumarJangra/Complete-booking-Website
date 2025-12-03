"use client"

import Navbar from "@/components/Navbar"
import SearchTabs from "@/components/SearchTabs"
import FeaturedServices from "@/components/FeaturedServices"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-chart-1/10">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-chart-1/20 via-chart-2/10 to-primary/15 py-20 px-4 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-chart-1/20 rounded-full blur-3xl floating-animation" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-chart-2/15 rounded-full blur-3xl floating-animation" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl floating-animation" style={{ animationDelay: '4s' }} />
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-shadow-soft gradient-text">
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
            <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50 backdrop-blur-sm hover:bg-accent/50 transition-all duration-300 hover:shadow-lg border border-border/50">
              <CheckCircle className="h-6 w-6 text-chart-1 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Best Price Guarantee</h3>
                <p className="text-sm text-muted-foreground">
                  Find the lowest prices or we'll refund the difference
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50 backdrop-blur-sm hover:bg-accent/50 transition-all duration-300 hover:shadow-lg border border-border/50">
              <CheckCircle className="h-6 w-6 text-chart-1 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">24/7 Customer Support</h3>
                <p className="text-sm text-muted-foreground">
                  Our team is always here to help you
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50 backdrop-blur-sm hover:bg-accent/50 transition-all duration-300 hover:shadow-lg border border-border/50">
              <CheckCircle className="h-6 w-6 text-chart-1 flex-shrink-0 mt-1" />
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