'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function Information() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your inquiry! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', eventDate: '', message: '' });
  };

  return (
    <section id="contact" className="py-20 bg-stone-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-rustic-blue-dark mb-4">
            Get In Touch
          </h2>
          <div className="w-24 h-1 bg-rust mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Let's create something special together
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <h3 className="font-serif text-3xl font-bold text-rustic-blue-dark mb-6">
              Contact Information
            </h3>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-rustic-blue/10 rounded-full flex items-center justify-center shrink-0">
                  <Phone className="h-6 w-6 text-rustic-blue" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                  <p className="text-gray-600">0927 969 8669</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-rustic-blue/10 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="h-6 w-6 text-rustic-blue" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                  <p className="text-gray-600">deliciosafoodproducts@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-rustic-blue/10 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6 text-rustic-blue" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Service Area</h4>
                  <p className="text-gray-600">Lagundi, Plaridel, Bulacan</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-rustic-blue/10 rounded-full flex items-center justify-center shrink-0">
                  <Clock className="h-6 w-6 text-rustic-blue" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Booking Hours</h4>
                  <p className="text-gray-600">Mon-Fri: 4PM - 10PM</p>
                  <p className="text-gray-600">Sat: 3PM - 10PM</p>
                </div>
              </div>
            </div>

            <div className="bg-warm-cream/50 border border-warm-brown/20 rounded-xl p-6">
              <h4 className="font-serif text-xl font-bold text-rustic-blue-dark mb-4">
                Terms & Conditions
              </h4>
              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <p className="font-bold">PAYMENT:</p>
                  <ul className="list-disc pl-4 space-y-1 mt-1">
                    <li>50% DOWN PAYMENT IS REQUIRED UPON BOOKING</li>
                    <li>BALANCE CAN BE PAID IN THE VENUE</li>
                  </ul>
                </div>

                <div>
                  <p className="font-bold">ADDITIONAL CHARGES:</p>
                  <ul className="list-disc pl-4 space-y-1 mt-1">
                    <li>ADDITIONAL DRINKS: ₱130/drink</li>
                    <li>ADDITIONAL HOURS: ₱500/hour</li>
                  </ul>
                </div>

                <div>
                  <p className="font-bold text-rust">NO REFUND</p>
                </div>

                <div>
                  <p className="font-bold">CANCELLATION:</p>
                  <ul className="list-disc pl-4 space-y-1 mt-1">
                    <li>FOR LESS THAN 24 HRS CANCELLATION: NO REFUND</li>
                    <li>CANCELLATION MUST BE MADE 3 DAYS OR 72 HRS BEFORE THE EVENT.</li>
                    <li>ONLY 50% WILL BE REFUNDED IF CANCELLED WITHIN NOTICE PERIOD</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="font-serif text-3xl font-bold text-rustic-blue-dark mb-6">
                Send Inquiry
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-rustic-blue focus:ring-2 focus:ring-rustic-blue/20 outline-none transition-all"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-rustic-blue focus:ring-2 focus:ring-rustic-blue/20 outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-rustic-blue focus:ring-2 focus:ring-rustic-blue/20 outline-none transition-all"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) =>
                      setFormData({ ...formData, eventDate: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-rustic-blue focus:ring-2 focus:ring-rustic-blue/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-rustic-blue focus:ring-2 focus:ring-rustic-blue/20 outline-none transition-all resize-none"
                    placeholder="Tell us about your event..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-rust hover:bg-rust/90 text-white font-semibold py-4 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Send className="h-5 w-5" />
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
