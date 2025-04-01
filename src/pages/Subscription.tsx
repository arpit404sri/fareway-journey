
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CreditCard, Check, AlertCircle, Loader2 } from "lucide-react";

const Subscription = () => {
  const { user, updateUserSubscription } = useAuth();
  const [processing, setProcessing] = useState(false);
  
  if (!user) {
    return null; // Should be handled by ProtectedRoute
  }
  
  // Format the trial end date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Check if trial is active
  const trialActive = new Date(user.trialEndDate) > new Date();
  
  // Calculate days left in trial
  const daysLeft = () => {
    const today = new Date();
    const endDate = new Date(user.trialEndDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  
  const handleSubscribe = async () => {
    setProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user subscription status
      updateUserSubscription(true);
      
      toast.success("Successfully subscribed!");
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to process subscription. Please try again.");
    } finally {
      setProcessing(false);
    }
  };
  
  const handleCancel = async () => {
    setProcessing(true);
    
    try {
      // Simulate cancellation processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user subscription status
      updateUserSubscription(false);
      
      toast.success("Subscription successfully cancelled.");
    } catch (error) {
      console.error("Cancellation error:", error);
      toast.error("Failed to cancel subscription. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-2">Subscription Management</h1>
        <p className="text-gray-600 mb-8">
          Manage your FareWay subscription and payment details.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                Your subscription status and details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg">FareWay Standard</h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.isSubscribed 
                      ? "bg-green-100 text-green-800" 
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {user.isSubscribed ? "Active" : "Inactive"}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Unlimited ride calculations</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>One ride booking per day</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Access to carpool discounts</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Full ride history and analytics</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Price</span>
                    <span className="font-bold text-xl">$1.00 / month</span>
                  </div>
                </div>
              </div>
              
              {trialActive && (
                <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-700">Free Trial Active</h4>
                      <p className="text-blue-600 text-sm mt-1">
                        Your free trial ends on {formatDate(user.trialEndDate)}. 
                        {daysLeft() > 0 && ` You have ${daysLeft()} days left.`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {user.isSubscribed ? (
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleCancel}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Cancel Subscription"
                  )}
                </Button>
              ) : (
                <Button 
                  className="w-full" 
                  onClick={handleSubscribe}
                  disabled={processing || trialActive}
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : trialActive ? (
                    "Active Free Trial"
                  ) : (
                    "Subscribe - $1.00/month"
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
          
          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your payment information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {user.isSubscribed ? (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded mr-3">
                        <CreditCard className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">Credit Card</p>
                        <p className="text-sm text-gray-500">**** **** **** 4242</p>
                      </div>
                    </div>
                    <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Default
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 flex justify-between">
                    <span>Expires 12/2025</span>
                    <button className="text-primary hover:underline">Edit</button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No payment methods yet</p>
                  <p className="text-gray-500 text-sm">
                    Payment information will be added when you subscribe
                  </p>
                </div>
              )}
              
              <div className="space-y-4">
                <h3 className="font-medium">Billing Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Billing Name</p>
                    <p>{user.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Billing Email</p>
                    <p>{user.email}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled={!user.isSubscribed}>
                {user.isSubscribed ? "Update Payment Method" : "No Payment Method"}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Pricing FAQ */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">What's included in my subscription?</h3>
              <p className="text-gray-600">
                Your $1/month subscription includes unlimited ride calculations, one ride booking per day, access to carpool discounts, and full ride history tracking.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Can I cancel at any time?</h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. There are no long-term commitments or cancellation fees.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">How does the free trial work?</h3>
              <p className="text-gray-600">
                New users get a 30-day free trial with full access to all features. No credit card is required during the trial period.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">What happens if I don't subscribe after my trial?</h3>
              <p className="text-gray-600">
                When your trial ends, you'll need to subscribe to continue using the service. Your ride history will remain available if you decide to subscribe later.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
