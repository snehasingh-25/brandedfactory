import { useState } from "react";
import { API } from "../api";
import { useToast } from "../components/Toast";
import { LoadingButton } from "../components/Spinner";

export default function Contact() {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    message: "" 
  });
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`${API}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
        }),
      });
      
      if (response.ok) {
        showToast("Message sent successfully!", "success");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        showToast("Failed to send message. Please try again.", "error");
      }
    } catch (error) {
      showToast("Error sending message. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-16" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
          <div className="text-center mb-12">
          <h1 className="hero-title mb-4" style={{ color: 'var(--foreground)' }}>
              Contact Us
            </h1>
          <p className="body-text max-w-3xl mx-auto" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
            Get in touch with us for product inquiries, custom orders, or partnership opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information Cards */}
          <div className="space-y-6">
            {/* Our Address Card */}
            <div className="rounded-xl p-6 shadow-md" style={{ backgroundColor: 'var(--card)' }}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--secondary)' }}>
                  <svg className="w-6 h-6" style={{ color: 'var(--foreground)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
                    Our Address
                  </h3>
                  <p className="body-text" style={{ color: 'var(--foreground)', opacity: 0.8 }}>
                    703, Chittorgarh Rd, opposite Zee School,<br />
                    Gathila Kheda, Bhilwara,<br />
                    Rajasthan 311802
            </p>
          </div>
        </div>
      </div>

            {/* Phone Numbers Card */}
            <div className="rounded-xl p-6 shadow-md" style={{ backgroundColor: 'var(--card)' }}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--secondary)' }}>
                  <svg className="w-6 h-6" style={{ color: 'var(--foreground)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
                    Phone Numbers
                  </h3>
                  <div className="space-y-2">
                    <p className="body-text" style={{ color: 'var(--foreground)', opacity: 0.8 }}>
                      <span className="font-semibold">Ashish Jain:</span> <a href="tel:+918003246909" className="hover:opacity-70 transition-opacity">+91 8003246909</a>
                    </p>
                    <p className="body-text" style={{ color: 'var(--foreground)', opacity: 0.8 }}>
                      <span className="font-semibold">Rishi Gandhi:</span> <a href="tel:+919251554751" className="hover:opacity-70 transition-opacity">+91 9251554751</a>
                    </p>
                    <p className="body-text" style={{ color: 'var(--foreground)', opacity: 0.8 }}>
                      <span className="font-semibold">Vaibhav Gandhi:</span> <a href="tel:+919660994037" className="hover:opacity-70 transition-opacity">+91 9660994037</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Address Card */}
            <div className="rounded-xl p-6 shadow-md" style={{ backgroundColor: 'var(--card)' }}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--secondary)' }}>
                  <svg className="w-6 h-6" style={{ color: 'var(--foreground)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
                    Email Address
                  </h3>
                  <p className="body-text" style={{ color: 'var(--foreground)', opacity: 0.8 }}>
                    <a href="mailto:brandedfactorysaleufc@gmail.com" className="hover:opacity-70 transition-opacity">
                      brandedfactorysaleufc@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="section-heading mb-6" style={{ color: 'var(--foreground)' }}>
              Send us a Message
            </h2>
            <form onSubmit={submit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                  Full Name *
                </label>
      <input
                  className="w-full px-4 py-3 rounded-lg transition-all duration-300 focus:outline-none"
                  style={{
                    border: '2px solid var(--border)',
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                  placeholder="Enter your full name"
                  value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
                  required
      />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                  Email Address *
                </label>
      <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg transition-all duration-300 focus:outline-none"
                  style={{
                    border: '2px solid var(--border)',
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                  placeholder="Enter your email address"
                  value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 rounded-lg transition-all duration-300 focus:outline-none"
                  style={{
                    border: '2px solid var(--border)',
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                  Message *
                </label>
      <textarea
                  className="w-full px-4 py-3 rounded-lg transition-all duration-300 focus:outline-none resize-none"
                  style={{
                    border: '2px solid var(--border)',
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                  placeholder="Enter your message"
                  rows="6"
                  maxLength={500}
                  value={form.message}
        onChange={e => setForm({ ...form, message: e.target.value })}
                  required
      />
                <p className="text-xs mt-1 text-right" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
                  {form.message.length}/500 characters
                </p>
              </div>

              <LoadingButton
                type="submit"
                loading={submitting}
                disabled={submitting}
                className="w-full py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
                style={{ 
                  backgroundColor: 'var(--primary)', 
                  color: 'var(--primary-foreground)' 
                }}
              >
                Send Message
              </LoadingButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
