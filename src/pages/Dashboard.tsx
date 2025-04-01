
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { MapPin, History, CreditCard, TrendingUp, Calendar, Clock } from "lucide-react";
import { getUserRides, hasRideToday } from "@/utils/rideCalculator";

const Dashboard = () => {
  const { user } = useAuth();
  
  if (!user) {
    return null; // Should be handled by ProtectedRoute
  }
  
  const rides = getUserRides(user.id);
  const canBookRideToday = !hasRideToday(user.id);
  
  // Calculate total spent
  const totalSpent = rides.reduce((sum, ride) => sum + ride.fare, 0);
  
  // Format the trial end date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}!</h1>
        <p className="text-gray-600 mb-8">
          Manage your rides and subscription from your dashboard.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Access commonly used features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/calculator">
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="mr-2 h-5 w-5" />
                  Calculate New Ride
                </Button>
              </Link>
              <Link to="/history">
                <Button variant="outline" className="w-full justify-start">
                  <History className="mr-2 h-5 w-5" />
                  View Ride History
                </Button>
              </Link>
              <Link to="/subscription">
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Manage Subscription
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          {/* Subscription Status */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Status</CardTitle>
              <CardDescription>Your current plan details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">Status</div>
                <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded">
                  {user.isSubscribed ? "Active" : "Inactive"}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">Plan</div>
                <div className="font-medium">Standard ($1/month)</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">Trial Ends</div>
                <div className="font-medium">{formatDate(user.trialEndDate)}</div>
              </div>
              <Link to="/subscription">
                <Button className="w-full mt-2">
                  Manage Subscription
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          {/* Ride Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Ride Summary</CardTitle>
              <CardDescription>Your ride statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-500">Total Rides</span>
                </div>
                <div className="font-medium">{rides.length}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-500">Ride Today</span>
                </div>
                <div className="font-medium">{canBookRideToday ? "No" : "Yes"}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-500">Last Ride</span>
                </div>
                <div className="font-medium">
                  {rides.length > 0 
                    ? new Date(rides[0].date).toLocaleDateString() 
                    : "No rides yet"}
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <div className="text-sm font-medium">Total Spent</div>
                <div className="font-bold text-lg">${totalSpent.toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activity */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your last 5 rides</CardDescription>
          </CardHeader>
          <CardContent>
            {rides.length > 0 ? (
              <div className="space-y-4">
                {rides.slice(0, 5).map((ride) => (
                  <div key={ride.id} className="p-4 border rounded-lg flex flex-col md:flex-row md:items-center justify-between">
                    <div className="mb-2 md:mb-0">
                      <div className="font-medium">
                        {new Date(ride.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {ride.source} → {ride.destination}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">{ride.distance.toFixed(1)}</span> miles
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">{ride.time}</span> mins
                      </div>
                      <div className="font-bold">
                        ${ride.fare.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>You haven't taken any rides yet.</p>
                <Link to="/calculator">
                  <Button className="mt-4">Calculate Your First Ride</Button>
                </Link>
              </div>
            )}
            
            {rides.length > 5 && (
              <div className="mt-4 text-center">
                <Link to="/history">
                  <Button variant="outline">View All Rides</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
