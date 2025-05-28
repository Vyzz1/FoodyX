import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Home, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function SuccessPayment() {
  const SuccessCard = () => (
    <Card className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      <div className="p-8 text-center">
        <div className="mx-auto w-20 h-20 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="h-12 w-12 text-amber-500 dark:text-amber-400" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-3">
          Thank You!
        </h1>
        <p className="text-amber-500 dark:text-amber-400 text-lg">
          Your payment was successful
        </p>
      </div>

      <div className="p-6 md:p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Your order has been confirmed
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            Thank you for your purchase. We hope you enjoy your delicious meal!
          </p>
        </div>

        <div className="relative h-48 mb-8 rounded-xl overflow-hidden">
          <img
            src="/images/cancle.avif"
            alt="Food illustration"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/80 to-transparent dark:from-amber-600/90 flex items-center">
            <div className="p-8 text-white max-w-md">
              <h3 className="text-2xl font-bold mb-2">Enjoy Your Meal!</h3>
              <p>We're preparing your delicious food with care.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            className="bg-amber-500 hover:bg-amber-600 text-stone-50 dark:bg-amber-600 dark:hover:bg-amber-700"
          >
            <Link to="/filter-food" replace>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="border-amber-500 text-amber-500 dark:border-amber-400 dark:text-amber-400 dark:hover:bg-amber-950/30"
          >
            <Link to="/" replace>
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 dark:bg-gray-900">
      <SuccessCard />

      <div className="mt-8 text-center text-amber-700 dark:text-amber-400">
        <p>
          Having trouble?{" "}
          <a
            href="#"
            className="underline font-medium hover:text-amber-800 dark:hover:text-amber-300"
          >
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
