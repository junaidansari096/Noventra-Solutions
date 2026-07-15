"use client";

import React, { useState } from "react";
import { API_URL } from "../../config";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    fetch(`${API_URL}/api/contacts/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (res.ok) {
          setSubmitted(true);
          setFormData({ name: "", email: "", message: "" });
          setTimeout(() => setSubmitted(false), 3000);
        }
      })
      .catch((err) => console.log("Failed to submit contact", err));
  };

  return (
    <div className="min-h-screen pt-xxl bg-background text-on-background">
      <div className="max-w-container-max mx-auto px-gutter py-20">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-md">
          <div className="inline-flex items-center px-sm py-xs bg-primary/10 rounded-full mb-md">
            <span className="text-primary font-label-sm text-label-sm px-sm">CONNECT WITH US</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg md:text-display-lg md:font-display-lg text-on-surface">Get in Touch</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Have an upcoming project or need maintenance support? Get in touch with our design team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Details & Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-outline-variant/30 shadow-sm space-y-6">
              <h3 className="font-headline-md text-headline-md text-on-surface">Office Info</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined">map</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-on-surface text-sm">Headquarters</h4>
                    <p className="text-on-surface-variant text-xs mt-1 leading-relaxed">
                      102 Noventra Hub, Tech District, Suite 400, New York, NY 10001
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-on-surface text-sm">Email Address</h4>
                    <p className="text-on-surface-variant text-xs mt-1">support@noventra.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-on-surface text-sm">Phone Hotline</h4>
                    <p className="text-on-surface-variant text-xs mt-1">+1 (800) 555-8324</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <span className="material-symbols-outlined">schedule</span>
                <h4 className="font-headline-md text-headline-md text-on-surface">Business Hours</h4>
              </div>
              <ul className="space-y-2 text-xs text-on-surface-variant">
                <li className="flex justify-between">
                  <span>Monday - Friday</span> <span className="text-on-surface font-semibold">9:00 AM - 6:00 PM EST</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday</span> <span className="text-on-surface font-semibold">10:00 AM - 4:00 PM EST</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span> <span className="text-on-surface-variant/60">Closed</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Form Container */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-3xl border border-outline-variant/30 shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary text-[28px]">forum</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">Send a Message</h2>
              </div>

              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-[32px]">check_circle</span>
                  </div>
                  <h3 className="font-bold text-on-surface text-xl">Inquiry Submitted!</h3>
                  <p className="text-on-surface-variant text-sm">
                    We have received your message and our design team will reply back to your email shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-2">Your Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-2">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary"
                        placeholder="john.doe@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-2">
                      Inquiry / Requirements Description
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary resize-none"
                      placeholder="Describe what type of website, hosting, or maintenance plan you are looking for..."
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full bg-primary hover:opacity-95 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Send Message</span>
                      <span className="material-symbols-outlined text-[18px]">send</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
