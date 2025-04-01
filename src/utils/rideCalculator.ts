
// Constants for fare calculation
export const COST_PER_MILE = 0.50;
export const COST_PER_MINUTE = 0.10;
export const BASE_FEE = 1.00;

// Hub location - fixed starting point
export const HUB_LOCATION = {
  address: "11411 E NW Hwy Suite 103, Dallas, TX 75218",
  lat: 32.866,
  lng: -96.732
};

// Mock function to calculate distance between two points in miles
export const calculateDistance = (
  startLat: number, 
  startLng: number, 
  endLat: number, 
  endLng: number
): number => {
  // This is a simplified version of the Haversine formula
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 3958.8; // Earth radius in miles
  
  const dLat = toRad(endLat - startLat);
  const dLng = toRad(endLng - startLng);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(startLat)) * Math.cos(toRad(endLat)) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

// Estimate time based on distance (assuming average speed of 30 mph)
export const estimateTime = (distanceInMiles: number): number => {
  const averageSpeedMph = 30;
  return Math.ceil(distanceInMiles / averageSpeedMph * 60); // Time in minutes
};

// Calculate fare based on distance and time
export const calculateFare = (
  distanceInMiles: number, 
  timeInMinutes: number,
  includeBaseFee = true
): number => {
  const distanceCost = distanceInMiles * COST_PER_MILE;
  const timeCost = timeInMinutes * COST_PER_MINUTE;
  const baseFee = includeBaseFee ? BASE_FEE : 0;
  
  return Math.round((distanceCost + timeCost + baseFee) * 100) / 100;
};

// Mock geocoding function
export const geocodeAddress = async (address: string): Promise<{ lat: number, lng: number }> => {
  // In a real app, this would call the Google Maps Geocoding API
  // For demo purposes, we'll return mock coordinates
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
  
  // Generate slightly randomized coordinates near Dallas
  const baseCoordinates = { lat: 32.8, lng: -96.8 };
  return {
    lat: baseCoordinates.lat + (Math.random() - 0.5) * 0.2,
    lng: baseCoordinates.lng + (Math.random() - 0.5) * 0.2
  };
};

// Calculate the complete ride details from Hub -> Source -> Destination
export const calculateCompleteRide = async (sourceAddress: string, destinationAddress: string) => {
  // Get coordinates
  const sourceCoords = await geocodeAddress(sourceAddress);
  const destCoords = await geocodeAddress(destinationAddress);
  
  // Calculate distances for both segments
  const hubToSourceDistance = calculateDistance(
    HUB_LOCATION.lat, 
    HUB_LOCATION.lng, 
    sourceCoords.lat, 
    sourceCoords.lng
  );
  
  const sourceToDestDistance = calculateDistance(
    sourceCoords.lat, 
    sourceCoords.lng, 
    destCoords.lat, 
    destCoords.lng
  );
  
  const totalDistance = hubToSourceDistance + sourceToDestDistance;
  
  // Estimate time
  const totalTime = estimateTime(totalDistance);
  
  // Calculate fare
  const fare = calculateFare(totalDistance, totalTime);
  
  return {
    hubToSourceDistance,
    sourceToDestDistance,
    totalDistance,
    totalTime,
    fare
  };
};

// Interface for ride data
export interface Ride {
  id: string;
  userId: string;
  source: string;
  destination: string;
  distance: number;
  time: number;
  fare: number;
  date: Date;
  carpoolCount?: number;
}

// Mock function to save a ride
export const saveRide = (ride: Omit<Ride, 'id' | 'date'>): Ride => {
  const newRide: Ride = {
    ...ride,
    id: Math.random().toString(36).substring(2, 9),
    date: new Date()
  };
  
  // In a real app, this would save to a database
  // For demo, we'll save to localStorage
  const rides = JSON.parse(localStorage.getItem('rides') || '[]');
  rides.push(newRide);
  localStorage.setItem('rides', JSON.stringify(rides));
  
  return newRide;
};

// Get rides for a specific user
export const getUserRides = (userId: string): Ride[] => {
  const rides = JSON.parse(localStorage.getItem('rides') || '[]');
  return rides.filter((ride: Ride) => ride.userId === userId)
    .sort((a: Ride, b: Ride) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Check if user has already booked a ride today
export const hasRideToday = (userId: string): boolean => {
  const rides = getUserRides(userId);
  if (rides.length === 0) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return rides.some((ride: Ride) => {
    const rideDate = new Date(ride.date);
    rideDate.setHours(0, 0, 0, 0);
    return rideDate.getTime() === today.getTime();
  });
};
