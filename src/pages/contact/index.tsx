import type React from "react";

import { useEffect, useState } from "react";
import { MapPin, Phone, Clock, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLocation } from "react-router-dom";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.hash]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="relative h-[300px] w-full">
        <img
          src="/images/big-banner.avif"
          alt="Restaurant contact"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Contact Us
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-amber-800 dark:text-amber-400 mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Have questions, feedback, or want to make a reservation? We'd love
            to hear from you. Reach out using the contact information below or
            fill out our contact form.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16" id="location">
          <div>
            <div className="bg-amber-50 dark:bg-amber-900/30 rounded-lg p-8 mb-8">
              <h3 className="text-2xl font-bold text-amber-800 dark:text-amber-400 mb-6">
                Contact Information
              </h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-amber-100 dark:bg-amber-800/50 p-2 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-800 dark:text-amber-400 mb-1">
                      Address
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      19 Nguyen Huu Tho
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      Quan 7, Ho Chi Minh City
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-amber-100 dark:bg-amber-800/50 p-2 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-800 dark:text-amber-400 mb-1">
                      Phone
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      Main: #(555) 123-4567
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      Reservations: #(555) 987-6543
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-amber-100 dark:bg-amber-800/50 p-2 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-800 dark:text-amber-400 mb-1">
                      Email
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      vyauth28@gmail.com
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      reservations@foodyx.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-amber-100 dark:bg-amber-800/50 p-2 rounded-full mr-4">
                    <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-800 dark:text-amber-400 mb-1">
                      Hours
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      Monday - Friday: 11am - 10pm
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      Saturday - Sunday: 10am - 11pm
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-amber-800 dark:text-amber-400 mb-6">
                Send Us a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="border-amber-200  focus:border-amber-500 focus:ring-amber-500 dark:text-gray-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className="border-amber-200  focus:border-amber-500 focus:ring-amber-500 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="#(555) 123-4567"
                      className="border-amber-200  focus:border-amber-500 focus:ring-amber-500 dark:text-gray-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="subject"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Reservation Inquiry"
                      required
                      className="border-amber-200  focus:border-amber-500 focus:ring-amber-500 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    rows={5}
                    required
                    className="border-amber-200  focus:border-amber-500 focus:ring-amber-500 dark:text-gray-100"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/30 rounded-lg overflow-hidden h-[300px] relative w-full col-span-2">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.033019962901!2d106.69676687479193!3d10.731936660013305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528b2747a81a3%3A0x33c1813055acb613!2zxJDhuqFpIGjhu41jIFTDtG4gxJDhu6ljIFRo4bqvbmc!5e0!3m2!1svi!2s!4v1746890681212!5m2!1svi!2s"
            className="border-none w-full h-full"
            loading="lazy"
          ></iframe>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/30 rounded-lg p-8 text-center mt-8">
          <h3 className="text-2xl font-bold text-amber-800 dark:text-amber-400 mb-4">
            Catering & Special Events
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
            Planning a special event? Our catering team can help create a
            memorable experience with delicious food tailored to your needs.
            Contact our events coordinator at #(555) 789-0123 or
            events@tastehaven.com.
          </p>
          <Button className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white">
            Learn More About Catering
          </Button>
        </div>
      </div>
    </div>
  );
}
