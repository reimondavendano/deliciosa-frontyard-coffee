'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Loader2, X, Copy, MessageCircle } from 'lucide-react';

export default function Information() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [inquiryData, setInquiryData] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Format the inquiry message
    const messengerMessage = `🍽️ NEW INQUIRY - Deliciosa Food Products

👤 Name: ${formData.name}
📧 Email: ${formData.email}
📱 Phone: ${formData.phone}
📅 Event Date: ${formData.eventDate || 'Not specified'}

💬 Message:
${formData.message}`;

    // Store inquiry data for modal
    setInquiryData(messengerMessage);

    try {
      // Send email using Web3Forms (free service)
      const emailData = {
        access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || '',
        subject: `New Inquiry from ${formData.name} - Deliciosa Food Products`,
        from_name: 'Deliciosa Website',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        event_date: formData.eventDate || 'Not specified',
        message: formData.message,
        to_email: process.env.NEXT_PUBLIC_TO_EMAIL || 'deliciosafoodproducts@gmail.com',
      };

      // Send to Web3Forms
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      const result = await response.json();
      setEmailSent(result.success);

      // Show modal regardless of email success
      setShowModal(true);

      // Reset form
      setFormData({ name: '', email: '', phone: '', eventDate: '', message: '' });
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      setEmailSent(false);

      // Show modal even if email fails
      setShowModal(true);

      // Reset form
      setFormData({ name: '', email: '', phone: '', eventDate: '', message: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Automatically copy to clipboard when modal shows
  useEffect(() => {
    if (showModal && inquiryData) {
      // Auto-copy to clipboard
      navigator.clipboard.writeText(inquiryData)
        .then(() => {
          console.log('Inquiry details automatically copied to clipboard');
        })
        .catch((error) => {
          console.error('Failed to auto-copy:', error);
        });
    }
  }, [showModal, inquiryData]);

  const handleCopyInquiry = async () => {
    try {
      await navigator.clipboard.writeText(inquiryData);
      alert('✅ Inquiry details copied to clipboard!');
    } catch (error) {
      alert('❌ Failed to copy. Please select and copy the text manually.');
    }
  };

  const handleMessageUs = () => {
    // Open Messenger app with the page
    window.open('https://m.me/Deliciosaphilippines', '_blank');
    setShowModal(false);
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
                  <h4 className="font-semibold text-gray-900 mb-1">Opening Hours</h4>
                  <p className="text-gray-600">Mon-Saturday: 10:00-22:00</p>
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
                  disabled={isSubmitting}
                  className="w-full bg-rust hover:bg-rust/90 text-white font-semibold py-4 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Inquiry
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="font-serif text-2xl font-bold text-rustic-blue-dark">
                {emailSent ? '✅ Inquiry Submitted!' : '⚠️ Inquiry Received'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Status Message */}
              <div className={`p-4 rounded-lg ${emailSent ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                <p className={`text-sm ${emailSent ? 'text-green-800' : 'text-yellow-800'}`}>
                  {emailSent ? (
                    <>
                      <strong>Thank you!</strong> Your inquiry has been sent to our email successfully.
                      We'll get back to you as soon as possible.
                    </>
                  ) : (
                    <>
                      <strong>Note:</strong> There was an issue sending the email.
                      Please use the alternative option below to contact us directly.
                    </>
                  )}
                </p>
              </div>

              {/* Alternative Option */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Alternative: Message Us on Facebook
                </h4>
                <p className="text-sm text-blue-800 mb-3">
                  {emailSent
                    ? "For faster response, you can also send us a message on Facebook. We've prepared your inquiry details below - just copy and paste!"
                    : "Please send us a message on Facebook with your inquiry details. Click 'Copy Details' below, then click 'Message Us' to open our Facebook page."}
                </p>
              </div>

              {/* Inquiry Details */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Inquiry Details:
                </label>
                <textarea
                  readOnly
                  value={inquiryData}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-sm font-mono resize-none"
                  rows={12}
                  onClick={(e) => e.currentTarget.select()}
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 Tip: Click the text above to select all, or use the Copy button below
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCopyInquiry}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 border border-gray-300"
                >
                  <Copy className="h-5 w-5" />
                  Copy Details
                </button>
                <button
                  onClick={handleMessageUs}
                  className="flex-1 bg-rust hover:bg-rust/90 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  Message Us on Facebook
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all border border-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
