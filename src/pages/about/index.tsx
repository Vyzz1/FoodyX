import { MapPin, Phone, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="relative h-[300px] w-full">
        <img
          className="w-full h-full object-cover"
          src="/images/big-banner2.avif"
          alt="Restaurant"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            About Us
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-amber-600 dark:text-amber-500 mb-6">
              Our Story
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Founded in 2025, FoodyX has been serving delicious, authentic
              cuisine to our community for over a decade. What started as a
              small family restaurant has grown into one of the most beloved
              dining establishments in the area.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Our commitment to quality ingredients, exceptional service, and a
              warm atmosphere has earned us a loyal customer base and numerous
              culinary awards.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              We take pride in creating memorable dining experiences and
              bringing people together through the universal language of good
              food.
            </p>
          </div>
          <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
            <img src="images/food-1.avif" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-2 md:order-1 relative h-[400px] w-full rounded-lg overflow-hidden">
            <img src="images/food-2.avif" />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold text-amber-800 dark:text-amber-400 mb-6">
              Our Philosophy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              At FoodyX, we believe that great food starts with great
              ingredients. We source locally whenever possible, supporting
              regional farmers and producers while ensuring the freshest
              components for our dishes.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Our chefs are passionate about their craft, combining traditional
              techniques with innovative approaches to create dishes that are
              both familiar and exciting.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              We're committed to sustainability in our practices, minimizing
              waste and making environmentally conscious choices throughout our
              operations.
            </p>
          </div>
        </div>

        <div
          className="bg-amber-50 dark:bg-amber-900/30 rounded-lg p-8 mb-16"
          id="adrress"
        >
          <h2 className="text-3xl font-bold text-amber-800 dark:text-amber-400 mb-6 text-center">
            Visit Us
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-amber-100 dark:bg-amber-800/50 p-4 rounded-full mb-4">
                <MapPin className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-amber-800 dark:text-amber-400 mb-2">
                Our Location
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                19 Nguyen Huu Tho,
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Quan 7, Ho Chi Minh City
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-amber-100 dark:bg-amber-800/50 p-4 rounded-full mb-4">
                <Phone className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-amber-800 dark:text-amber-400 mb-2">
                Contact Us
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Phone: #(555) 123-4567
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Email: vyauth28@gmail.com
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-amber-100 dark:bg-amber-800/50 p-4 rounded-full mb-4">
                <Clock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-amber-800 dark:text-amber-400 mb-2">
                Opening Hours
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Monday - Friday: 11am - 10pm
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Saturday - Sunday: 10am - 11pm
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-amber-800 dark:text-amber-400 mb-6">
            Ready to Order?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience our delicious cuisine from the comfort of your home.
            Order online for pickup or delivery.
          </p>
          <Link
            to="/"
            className="inline-block bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
          >
            Order Now
          </Link>
        </div>
      </div>
    </div>
  );
}
