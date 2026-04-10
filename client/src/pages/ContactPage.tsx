import { useState } from "react";
import { MessageCircle, Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const submitContactMutation = trpc.contact.submit.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitContactMutation.mutateAsync(formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-blue-100">We're here to help with any questions about our vehicles</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Info Cards */}
          {[
            {
              icon: MessageCircle,
              title: "WhatsApp",
              desc: "Chat with us instantly",
              value: "+1 (555) 123-4567",
              action: "https://wa.me/1234567890",
            },
            {
              icon: Mail,
              title: "Email",
              desc: "Send us a message",
              value: "info@japanvehicles.com",
              action: "mailto:info@japanvehicles.com",
            },
            {
              icon: Phone,
              title: "Phone",
              desc: "Call us during business hours",
              value: "+1 (555) 987-6543",
              action: "tel:+15559876543",
            },
          ].map((contact, idx) => (
            <a
              key={idx}
              href={contact.action}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition-all transform hover:scale-105 border border-slate-200"
            >
              <contact.icon className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{contact.title}</h3>
              <p className="text-slate-600 mb-4">{contact.desc}</p>
              <p className="text-lg font-semibold text-blue-600">{contact.value}</p>
            </a>
          ))}
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-lg p-12 border border-slate-200 max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-8 text-center">Send us a Message</h2>

          {submitted && (
            <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-xl flex items-center gap-4">
              <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-green-900">Message sent successfully!</p>
                <p className="text-green-700">We'll get back to you as soon as possible.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                <Input
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Phone (Optional)</label>
              <Input
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
              <Input
                type="text"
                placeholder="What is this about?"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                className="border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
              <textarea
                placeholder="Tell us more about your inquiry..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={6}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={submitContactMutation.isPending}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              {submitContactMutation.isPending ? "Sending..." : "Send Message"}
            </Button>
          </form>

          {/* WhatsApp CTA */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <p className="text-center text-slate-600 mb-6">Prefer instant chat?</p>
            <a
              href="https://wa.me/1234567890?text=Hi%20I%20am%20interested%20in%20your%20vehicles"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <MessageCircle className="w-6 h-6" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
