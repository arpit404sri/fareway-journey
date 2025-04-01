
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';

// Define the props interface for the GoogleMap component
interface GoogleMapProps {
  sourceAddress: string;
  destinationAddress: string;
  hubAddress: string;
  showRoute: boolean;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  sourceAddress, 
  destinationAddress, 
  hubAddress,
  showRoute 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  
  // Function to load the Google Maps API script
  const loadGoogleMapsScript = () => {
    if (window.google?.maps) {
      setMapLoaded(true);
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDTZH-X8mYns8FRy1GtYA4iKCNVu45HFi8&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setMapLoaded(true);
    };
    
    script.onerror = () => {
      toast.error("Failed to load Google Maps. Please try again later.");
    };
    
    document.head.appendChild(script);
  };

  // Initialize map once script is loaded
  useEffect(() => {
    loadGoogleMapsScript();
  }, []);

  // Set up map instance when map is loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    
    const mapOptions: google.maps.MapOptions = {
      center: { lat: 32.866, lng: -96.732 }, // Dallas area
      zoom: 12,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    };
    
    const map = new google.maps.Map(mapRef.current, mapOptions);
    setMapInstance(map);
    
    const renderer = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: '#3366CC', // Primary color
        strokeWeight: 5,
        strokeOpacity: 0.7
      }
    });
    
    setDirectionsRenderer(renderer);
  }, [mapLoaded]);

  // Update route whenever addresses change
  useEffect(() => {
    if (!mapLoaded || !mapInstance || !directionsRenderer || !showRoute) return;
    
    if (!hubAddress || !sourceAddress || !destinationAddress) {
      // Clear existing route if any address is missing
      directionsRenderer.setDirections({ routes: [] });
      return;
    }
    
    const directionsService = new google.maps.DirectionsService();
    
    // First leg: Hub to Source
    directionsService.route(
      {
        origin: hubAddress,
        destination: sourceAddress,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (hubToSourceResult, hubToSourceStatus) => {
        if (hubToSourceStatus !== google.maps.DirectionsStatus.OK) {
          toast.error(`Could not find route from hub to source: ${hubToSourceStatus}`);
          return;
        }
        
        // Second leg: Source to Destination
        directionsService.route(
          {
            origin: sourceAddress,
            destination: destinationAddress,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (sourceToDestResult, sourceToDestStatus) => {
            if (sourceToDestStatus !== google.maps.DirectionsStatus.OK) {
              toast.error(`Could not find route from source to destination: ${sourceToDestStatus}`);
              return;
            }
            
            // Combine routes by adding waypoints
            directionsService.route(
              {
                origin: hubAddress,
                destination: destinationAddress,
                waypoints: [{ location: sourceAddress, stopover: true }],
                travelMode: google.maps.TravelMode.DRIVING,
                optimizeWaypoints: false
              },
              (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                  directionsRenderer.setDirections(result);
                  
                  // Fit bounds to show the entire route
                  const bounds = new google.maps.LatLngBounds();
                  result.routes[0].legs.forEach(leg => {
                    leg.steps.forEach(step => {
                      step.path.forEach(point => {
                        bounds.extend(point);
                      });
                    });
                  });
                  mapInstance.fitBounds(bounds);
                } else {
                  toast.error(`Directions request failed: ${status}`);
                }
              }
            );
          }
        );
      }
    );
  }, [mapLoaded, mapInstance, directionsRenderer, hubAddress, sourceAddress, destinationAddress, showRoute]);

  return (
    <div className="rounded-md overflow-hidden border border-gray-200 bg-white shadow-inner w-full h-full min-h-[300px]">
      {!mapLoaded && (
        <div className="flex items-center justify-center h-full bg-gray-50">
          <Loader className="w-6 h-6 text-primary animate-spin mr-2" />
          <span className="text-gray-500">Loading map...</span>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default GoogleMap;
