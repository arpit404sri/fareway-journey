
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, MapPin, User, History, CreditCard, LogOut } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary font-bold text-xl">FareWay</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <>
                <Link to="/calculator" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  Calculate Ride
                </Link>
                <Link to="/history" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <History className="mr-1 h-4 w-4" />
                  Ride History
                </Link>
                <Link to="/subscription" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <CreditCard className="mr-1 h-4 w-4" />
                  Subscription
                </Link>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="ml-2 flex items-center"
                >
                  <LogOut className="mr-1 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="mr-2">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-primary"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white pb-4 px-4">
          {user ? (
            <div className="flex flex-col space-y-2">
              <Link 
                to="/calculator" 
                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center"
                onClick={toggleMobileMenu}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Calculate Ride
              </Link>
              <Link 
                to="/history" 
                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center"
                onClick={toggleMobileMenu}
              >
                <History className="mr-2 h-4 w-4" />
                Ride History
              </Link>
              <Link 
                to="/subscription" 
                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center"
                onClick={toggleMobileMenu}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Subscription
              </Link>
              <Button
                variant="outline"
                onClick={() => {
                  handleLogout();
                  toggleMobileMenu();
                }}
                className="flex items-center justify-center"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <Link to="/login" onClick={toggleMobileMenu}>
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
              <Link to="/register" onClick={toggleMobileMenu}>
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
