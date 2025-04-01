
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Clock, DollarSign, Users } from "lucide-react";
import { getUserRides, Ride } from "@/utils/rideCalculator";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RideHistory = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
  
  if (!user) {
    return null; // Should be handled by ProtectedRoute
  }
  
  const rides = getUserRides(user.id);
  
  // Filter rides by search query
  const filteredRides = rides.filter((ride) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      ride.source.toLowerCase().includes(searchLower) ||
      ride.destination.toLowerCase().includes(searchLower) ||
      new Date(ride.date).toLocaleDateString().includes(searchQuery)
    );
  });
  
  // Sort rides
  const sortedRides = [...filteredRides].sort((a, b) => {
    switch (sortOrder) {
      case "newest":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "highest":
        return b.fare - a.fare;
      case "lowest":
        return a.fare - b.fare;
      default:
        return 0;
    }
  });
  
  // Calculate totals
  const totalRides = sortedRides.length;
  const totalSpent = sortedRides.reduce((sum, ride) => sum + ride.fare, 0);
  const totalDistance = sortedRides.reduce((sum, ride) => sum + ride.distance, 0);
  const totalTime = sortedRides.reduce((sum, ride) => sum + ride.time, 0);
  
  // Format date
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-2">Ride History</h1>
        <p className="text-gray-600 mb-8">
          View all your past rides and their details.
        </p>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Rides</p>
                  <p className="text-2xl font-bold">{totalRides}</p>
                </div>
                <div className="h-12 w-12 bg-primary-light/10 rounded-full flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Distance</p>
                  <p className="text-2xl font-bold">{totalDistance.toFixed(1)} mi</p>
                </div>
                <div className="h-12 w-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Time</p>
                  <p className="text-2xl font-bold">{totalTime} mins</p>
                </div>
                <div className="h-12 w-12 bg-amber-500/10 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Spent</p>
                  <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
                </div>
                <div className="h-12 w-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle>Filter & Sort</CardTitle>
            <CardDescription>Find specific rides in your history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search" className="mb-2 block">Search</Label>
                <Input
                  id="search"
                  placeholder="Search by address or date..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="sort" className="mb-2 block">Sort By</Label>
                <Select
                  value={sortOrder}
                  onValueChange={(value) => setSortOrder(value as any)}
                >
                  <SelectTrigger id="sort">
                    <SelectValue placeholder="Select sort order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="highest">Highest Fare</SelectItem>
                    <SelectItem value="lowest">Lowest Fare</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Ride List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Rides</CardTitle>
            <CardDescription>
              {sortedRides.length > 0 
                ? `Showing ${sortedRides.length} ${sortedRides.length === 1 ? 'ride' : 'rides'}`
                : 'No rides found'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sortedRides.length > 0 ? (
              <div className="space-y-6">
                {sortedRides.map((ride: Ride) => (
                  <div key={ride.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                      <div className="flex items-center mb-2 md:mb-0">
                        <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                        <span className="font-medium">{formatDate(ride.date)}</span>
                      </div>
                      <div className="flex space-x-3">
                        <div className="flex items-center text-gray-700">
                          <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                          <span>{ride.distance.toFixed(1)} mi</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Clock className="h-4 w-4 mr-1 text-gray-500" />
                          <span>{ride.time} mins</span>
                        </div>
                        <div className="font-bold text-primary">
                          ${ride.fare.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-start">
                        <div className="min-w-8 flex justify-center mt-1">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                        </div>
                        <div>
                          <p className="font-medium">Source</p>
                          <p className="text-gray-600">{ride.source}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="min-w-8 flex justify-center">
                          <div className="w-[1px] h-8 bg-gray-300"></div>
                        </div>
                        <div className="hidden"></div>
                      </div>
                      <div className="flex items-start">
                        <div className="min-w-8 flex justify-center mt-1">
                          <div className="w-2 h-2 rounded-full bg-accent"></div>
                        </div>
                        <div>
                          <p className="font-medium">Destination</p>
                          <p className="text-gray-600">{ride.destination}</p>
                        </div>
                      </div>
                    </div>
                    
                    {ride.carpoolCount && ride.carpoolCount > 1 && (
                      <div className="flex items-center text-green-600 text-sm mt-3 bg-green-50 p-2 rounded">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Carpooled with {ride.carpoolCount - 1} other {ride.carpoolCount - 1 === 1 ? 'person' : 'people'}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No rides found</p>
                <p className="text-gray-400 text-sm">
                  {searchQuery ? "Try different search terms" : "Book a ride to see it here"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RideHistory;
