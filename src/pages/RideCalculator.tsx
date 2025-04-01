
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { MapPin, Clock, DollarSign, Route, Users, ArrowRight, Loader2 } from "lucide-react";
import { 
  calculateCompleteRide, 
  HUB_LOCATION, 
  saveRide, 
  hasRideToday,
  COST_PER_MILE,
  COST_PER_MINUTE,
  BASE_FEE
} from "@/utils/rideCalculator";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";

const RideCalculator = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [sourceAddress, setSourceAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [isCarpool, setIsCarpool] = useState(false);
  const [carpoolCount, setCarpoolCount] = useState(2); // Default to 2 people
  
  const [calculating, setCalculating] = useState(false);
  const [bookingRide, setBookingRide] = useState(false);
  
  const [rideDetails, setRideDetails] = useState<{
    hubToSourceDistance: number;
    sourceToDestDistance: number;
    totalDistance: number;
    totalTime: number;
    fare: number;
  } | null>(null);
  
  // Check if user already has a ride today
  const userHasRideToday = user ? hasRideToday(user.id) : false;
  
  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sourceAddress || !destinationAddress) {
      toast.error("Please enter both source and destination addresses");
      return;
    }
    
    try {
      setCalculating(true);
      const results = await calculateCompleteRide(sourceAddress, destinationAddress);
      setRideDetails(results);
      toast.success("Fare calculated successfully!");
    } catch (error) {
      console.error("Calculation error:", error);
      toast.error("Failed to calculate fare. Please try again.");
    } finally {
      setCalculating(false);
    }
  };
  
  const handleBookRide = async () => {
    if (!user || !rideDetails) return;
    
    if (userHasRideToday) {
      toast.error("You've already booked a ride today");
      return;
    }
    
    try {
      setBookingRide(true);
      
      // Apply carpool discount if selected
      const finalFare = isCarpool ? 
        rideDetails.fare * (1 - (0.1 * (carpoolCount - 1))) : // 10% discount per additional person
        rideDetails.fare;
      
      // Save the ride
      const ride = saveRide({
        userId: user.id,
        source: sourceAddress,
        destination: destinationAddress,
        distance: rideDetails.totalDistance,
        time: rideDetails.totalTime,
        fare: finalFare,
        carpoolCount: isCarpool ? carpoolCount : undefined
      });
      
      toast.success("Ride booked successfully!");
      navigate("/history");
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to book ride. Please try again.");
    } finally {
      setBookingRide(false);
    }
  };
  
  // Calculate final fare with carpool discount if applicable
  const calculateFinalFare = () => {
    if (!rideDetails) return 0;
    
    if (isCarpool) {
      // 10% discount per additional person
      return rideDetails.fare * (1 - (0.1 * (carpoolCount - 1)));
    }
    
    return rideDetails.fare;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-2">Ride Fare Calculator</h1>
        <p className="text-gray-600 mb-8">
          Calculate the exact fare for your journey from our hub to your destination.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left column - Calculation Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Enter Ride Details</CardTitle>
                <CardDescription>
                  All rides start from our hub: {HUB_LOCATION.address}
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleCalculate}>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="source">Your Source Location</Label>
                    <div className="flex">
                      <MapPin className="mr-2 h-5 w-5 text-gray-400 self-center" />
                      <Input
                        id="source"
                        placeholder="Enter pickup address"
                        value={sourceAddress}
                        onChange={(e) => setSourceAddress(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="destination">Your Destination</Label>
                    <div className="flex">
                      <MapPin className="mr-2 h-5 w-5 text-gray-400 self-center" />
                      <Input
                        id="destination"
                        placeholder="Enter destination address"
                        value={destinationAddress}
                        onChange={(e) => setDestinationAddress(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h3 className="font-medium text-blue-800 flex items-center mb-2">
                      <Route className="mr-2 h-5 w-5" />
                      Ride Structure
                    </h3>
                    <p className="text-sm text-blue-700">
                      1. Start from hub: {HUB_LOCATION.address}
                    </p>
                    <p className="text-sm text-blue-700">
                      2. Travel to your source location
                    </p>
                    <p className="text-sm text-blue-700">
                      3. Travel from source to destination
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="carpool">Carpool Option</Label>
                      <Switch
                        id="carpool"
                        checked={isCarpool}
                        onCheckedChange={setIsCarpool}
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      Share your ride and save 10% for each additional person.
                    </p>
                    
                    {isCarpool && (
                      <div className="pt-3">
                        <Label htmlFor="carpoolCount">Number of People (including you)</Label>
                        <div className="flex items-center mt-2">
                          <Button 
                            type="button"
                            variant="outline" 
                            className="h-10 w-10 p-0" 
                            onClick={() => setCarpoolCount(Math.max(2, carpoolCount - 1))}
                          >
                            -
                          </Button>
                          <div className="w-12 text-center">{carpoolCount}</div>
                          <Button 
                            type="button"
                            variant="outline" 
                            className="h-10 w-10 p-0" 
                            onClick={() => setCarpoolCount(Math.min(5, carpoolCount + 1))}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={calculating}
                  >
                    {calculating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      <>
                        Calculate Fare
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
          
          {/* Right column - Fare Details */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Fare Details</CardTitle>
                <CardDescription>
                  Breakdown of your ride cost
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {rideDetails ? (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Route className="mr-2 h-5 w-5 text-gray-500" />
                          <span>Hub to Source Distance</span>
                        </div>
                        <span className="font-medium">{rideDetails.hubToSourceDistance.toFixed(1)} miles</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Route className="mr-2 h-5 w-5 text-gray-500" />
                          <span>Source to Destination</span>
                        </div>
                        <span className="font-medium">{rideDetails.sourceToDestDistance.toFixed(1)} miles</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center font-medium">
                          <MapPin className="mr-2 h-5 w-5 text-gray-700" />
                          <span>Total Distance</span>
                        </div>
                        <span className="font-bold">{rideDetails.totalDistance.toFixed(1)} miles</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center font-medium">
                          <Clock className="mr-2 h-5 w-5 text-gray-700" />
                          <span>Estimated Time</span>
                        </div>
                        <span className="font-bold">{rideDetails.totalTime} minutes</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Distance Cost ({COST_PER_MILE.toFixed(2)}/mile)</span>
                        <span>${(rideDetails.totalDistance * COST_PER_MILE).toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Time Cost (${COST_PER_MINUTE.toFixed(2)}/min)</span>
                        <span>${(rideDetails.totalTime * COST_PER_MINUTE).toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Base Fee</span>
                        <span>${BASE_FEE.toFixed(2)}</span>
                      </div>
                      
                      {isCarpool && (
                        <div className="flex justify-between items-center text-green-600">
                          <span className="text-sm">Carpool Discount ({(carpoolCount - 1) * 10}%)</span>
                          <span>-${(rideDetails.fare - calculateFinalFare()).toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center font-bold text-lg">
                        <DollarSign className="mr-1 h-5 w-5" />
                        <span>Total Fare</span>
                      </div>
                      <span className="font-bold text-lg">${calculateFinalFare().toFixed(2)}</span>
                    </div>
                    
                    {isCarpool && (
                      <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                        <div className="flex items-center text-green-800 font-medium mb-1">
                          <Users className="mr-2 h-5 w-5" />
                          <span>Carpool Savings</span>
                        </div>
                        <p className="text-sm text-green-700">
                          Sharing with {carpoolCount - 1} other {carpoolCount - 1 === 1 ? 'person' : 'people'} saves you ${(rideDetails.fare - calculateFinalFare()).toFixed(2)}!
                        </p>
                      </div>
                    )}
                    
                    <Button 
                      className="w-full"
                      onClick={handleBookRide}
                      disabled={bookingRide || userHasRideToday}
                    >
                      {bookingRide ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Booking Ride...
                        </>
                      ) : userHasRideToday ? (
                        "You've already booked a ride today"
                      ) : (
                        "Book This Ride"
                      )}
                    </Button>
                    
                    {userHasRideToday && (
                      <p className="text-center text-sm text-amber-600">
                        Note: You're limited to one ride booking per day.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-500">
                    <MapPin className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p className="mb-2">Enter your source and destination addresses</p>
                    <p>Then click "Calculate Fare" to see the breakdown</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideCalculator;
