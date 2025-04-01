
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { MapPin, Clock, DollarSign, Users, ArrowRight } from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Simplify Your Journey with FareWay
                </h1>
                <p className="text-xl mb-8 text-gray-100">
                  Calculate exact fares, book rides, and save money with our student carpooling service.
                </p>
                {user ? (
                  <Link to="/calculator">
                    <Button size="lg" className="bg-accent hover:bg-accent-dark text-white">
                      Calculate a Ride <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <div className="space-x-4">
                    <Link to="/login">
                      <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                        Log In
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button size="lg" className="bg-accent hover:bg-accent-dark text-white">
                        Sign Up Free
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
              <div className="md:w-1/2 md:pl-12">
                <div className="bg-white p-6 rounded-lg shadow-xl">
                  <div className="text-gray-800 mb-4 text-lg font-medium">Sample Fare Calculation</div>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <MapPin className="h-5 w-5 mr-2 text-primary" />
                      <span>Distance: 5 miles</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="h-5 w-5 mr-2 text-primary" />
                      <span>Time: 15 minutes</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <DollarSign className="h-5 w-5 mr-2 text-primary" />
                      <span>Base Fee: $1.00</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex items-center font-semibold">
                      <span>Total Fare:</span>
                      <span className="ml-auto text-xl text-primary">$4.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Enter Locations</h3>
                <p className="text-gray-600">
                  Enter your source and destination addresses to calculate the exact fare for your journey.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">See Transparent Pricing</h3>
                <p className="text-gray-600">
                  View a detailed breakdown of your fare, including distance costs, time costs, and the base fee.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Share Your Ride</h3>
                <p className="text-gray-600">
                  Opt for carpooling to share the cost with other students and reduce your carbon footprint.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-secondary text-white py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Calculate Your Fare?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Your first month is completely free. After that, enjoy all features for just $1 per month.
            </p>
            {user ? (
              <Link to="/calculator">
                <Button size="lg" className="bg-white text-secondary hover:bg-gray-100">
                  Calculate a Ride
                </Button>
              </Link>
            ) : (
              <Link to="/register">
                <Button size="lg" className="bg-white text-secondary hover:bg-gray-100">
                  Start Free Trial
                </Button>
              </Link>
            )}
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-2">FareWay</h3>
              <p className="text-gray-400">Simplify your journey.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                  <li><Link to="/calculator" className="text-gray-400 hover:text-white">Calculator</Link></li>
                  <li><Link to="/history" className="text-gray-400 hover:text-white">Ride History</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-3">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-3">Contact</h4>
                <ul className="space-y-2">
                  <li><a href="mailto:support@fareway.com" className="text-gray-400 hover:text-white">support@fareway.com</a></li>
                  <li><span className="text-gray-400">(555) 123-4567</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} FareWay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
