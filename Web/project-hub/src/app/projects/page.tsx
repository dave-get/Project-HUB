"use client"

import { Search, Calendar, Grid, List, Users, Clock, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [isLoading, setIsLoading] = useState(false)

  // Simulated loading state
  const handleViewModeChange = (mode: "grid" | "list") => {
    setIsLoading(true)
    setViewMode(mode)
    setTimeout(() => setIsLoading(false), 500)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">
          View and manage your projects
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Input 
              placeholder="Search projects..." 
              className="w-full pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative">
            <Input type="date" className="w-[180px] pl-10" />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-r-none"
              onClick={() => handleViewModeChange("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-l-none"
              onClick={() => handleViewModeChange("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "grid gap-4"}>
          {[1, 2, 3].map((i) => (
            <Card key={i} className={`overflow-hidden ${viewMode === "list" ? "flex" : ""}`}>
              <div className={`relative ${viewMode === "list" ? "w-48" : "w-full"}`}>
                <Skeleton className={`${viewMode === "list" ? "h-full" : "aspect-video"} w-full`} />
              </div>
              <div className={`${viewMode === "list" ? "flex-1" : ""} p-6`}>
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "grid gap-4"
          }
        >
          <Card className={`overflow-hidden ${viewMode === "list" ? "flex" : ""} relative group hover:shadow-lg transition-shadow duration-200`}>
            <Badge 
              className="absolute top-2 right-2 z-10"
              variant="secondary"
            >
              Approved
            </Badge>
            <div className={`relative ${viewMode === "list" ? "w-48" : "w-full"}`}>
              <div className={`${viewMode === "list" ? "h-full" : "aspect-video"} w-full relative`}>
                <Image
                  src="/placeholder-project.jpg"
                  alt="Project thumbnail"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <Button variant="secondary" size="sm" className="gap-2">
                    View Details <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className={`${viewMode === "list" ? "flex-1" : ""}`}>
              <CardHeader>
                <CardTitle className="text-xl">Smart Home Automation System</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  A comprehensive home automation solution that integrates IoT devices, 
                  voice control, and energy management for modern households.
                </p>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Team Size: 4</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Due: Dec 2024</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>

          <Card className={`overflow-hidden ${viewMode === "list" ? "flex" : ""} relative group hover:shadow-lg transition-shadow duration-200`}>
            <Badge 
              className="absolute top-2 right-2 z-10"
              variant="outline"
            >
              Pending
            </Badge>
            <div className={`relative ${viewMode === "list" ? "w-48" : "w-full"}`}>
              <div className={`${viewMode === "list" ? "h-full" : "aspect-video"} w-full relative`}>
                <Image
                  src="/placeholder-project.jpg"
                  alt="Project thumbnail"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <Button variant="secondary" size="sm" className="gap-2">
                    View Details <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className={`${viewMode === "list" ? "flex-1" : ""}`}>
              <CardHeader>
                <CardTitle className="text-xl">E-commerce Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  A modern e-commerce platform with advanced features like real-time inventory 
                  tracking, AI-powered recommendations, and secure payment processing.
                </p>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Team Size: 6</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Due: Mar 2025</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">30%</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
} 