"use client";

import React, { useState } from "react";

interface MockLayout {
  id: string;
  name: string;
  category: string;
  icon: string;
  theme: "dark" | "light" | "green" | "gold";
  heroTitle: string;
  heroSub: string;
  features: string[];
}

export default function LiveDemoPage() {
  const [selectedDemo, setSelectedDemo] = useState<string>("doctor");
  const [viewportMode, setViewportMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const demos: MockLayout[] = [
    {
      id: "doctor",
      name: "MedCare Clinic",
      category: "Doctor / Healthcare Portal",
      icon: "healing",
      theme: "light",
      heroTitle: "Expert Medical Care You Can Trust",
      heroSub: "Book online consultations with certified doctors and manage prescriptions through your private medical portal.",
      features: ["Online Consultation Booking", "Prescription Refill Request", "Patient Health Records Access", "24/7 Nurse Tele-assistance"],
    },
    {
      id: "restaurant",
      name: "Bella Italia Bistro",
      category: "Restaurant Storefront",
      icon: "restaurant",
      theme: "dark",
      heroTitle: "Authentic Italian Cuisine",
      heroSub: "Experience wood-fired pizza and handmade pasta from our family recipes, delivered directly to your doorstep.",
      features: ["Interactive PDF Menu", "Table Reservation Booker", "Direct Delivery Checkout", "Loyalty Point Dashboard"],
    },
    {
      id: "lawyer",
      name: "Justitia Law Partners",
      category: "Law / Attorney Portal",
      icon: "gavel",
      theme: "gold",
      heroTitle: "Dedicated to Protecting Your Rights",
      heroSub: "Corporate law counsel, IP filings, and general litigation support backed by over 25 years of courtroom experience.",
      features: ["Confidential Consultation Form", "Case Status Timeline", "Interactive Fee Calculator", "Secure Document Exchange"],
    }
  ];

  const currentDemo = demos.find((d) => d.id === selectedDemo) || demos[0];

  const getViewportWidth = () => {
    if (viewportMode === "mobile") return "max-w-[375px]";
    if (viewportMode === "tablet") return "max-w-[768px]";
    return "max-w-full";
  };

  return (
    <div className="min-h-screen pt-xxl bg-background text-on-background">
      <div className="max-w-container-max mx-auto px-gutter py-20">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-md">
          <div className="inline-flex items-center px-sm py-xs bg-primary/10 rounded-full mb-md">
            <span className="text-primary font-label-sm text-label-sm px-sm">LIVE INTERACTIVE WIREFRAMES</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg md:text-display-lg md:font-display-lg text-on-surface">Interactive Live Demos</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Select a template wireframe below and toggle responsive layouts to preview the custom solutions we deliver.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-2">Available Niche Templates</h3>
            <div className="space-y-2">
              {demos.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDemo(d.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedDemo === d.id
                      ? "bg-primary/10 border-primary text-primary font-bold"
                      : "bg-white border-outline-variant/30 text-on-surface-variant hover:border-primary/50 hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{d.icon}</span>
                  <div>
                    <h4 className="font-bold text-sm">{d.name}</h4>
                    <p className="text-[10px] text-on-surface-variant/80 mt-0.5">{d.category}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-white p-5 rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
              <h4 className="font-semibold text-on-surface text-xs uppercase tracking-wider">Demo Specifications</h4>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                Every layout is fully customizable. We integrate headless content engines so you can edit text directly from your dashboard.
              </p>
            </div>
          </div>

          {/* Live Preview Container */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Mock Viewport Controller */}
            <div className="bg-white border border-outline-variant/30 p-4 rounded-xl flex items-center justify-between gap-4 shadow-sm">
              <div className="flex gap-2">
                {[
                  { mode: "desktop", icon: "desktop_windows" },
                  { mode: "tablet", icon: "tablet_mac" },
                  { mode: "mobile", icon: "smartphone" },
                ].map((btn) => (
                  <button
                    key={btn.mode}
                    onClick={() => setViewportMode(btn.mode as any)}
                    className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                      viewportMode === btn.mode
                        ? "bg-primary border-primary text-white"
                        : "bg-surface-container-low border-outline-variant/30 text-on-surface-variant hover:text-on-surface"
                    }`}
                    title={`${btn.mode} view`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{btn.icon}</span>
                  </button>
                ))}
              </div>
              <div className="text-xs text-primary font-semibold flex items-center gap-1.5">
                <span>Template: {currentDemo.name}</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </div>
            </div>

            {/* Interactive Rendering Frame */}
            <div className="bg-surface-container border border-outline-variant/30 rounded-2xl overflow-hidden aspect-video flex justify-center items-stretch p-4 transition-all duration-300 shadow-inner">
              <div className={`w-full ${getViewportWidth()} bg-white rounded-lg overflow-y-auto text-gray-800 transition-all duration-300 shadow-2xl flex flex-col`}>
                {/* Header */}
                <header
                  className={`p-4 border-b border-gray-100 flex items-center justify-between shrink-0 ${
                    currentDemo.theme === "dark" ? "bg-gray-900 text-white border-gray-800" : "bg-white"
                  }`}
                >
                  <div className="font-extrabold text-sm tracking-wider uppercase">{currentDemo.name}</div>
                  <nav className="flex gap-3 text-xs opacity-75">
                    <span>Home</span>
                    <span>About</span>
                    <span>Contact</span>
                  </nav>
                </header>

                {/* Main Content */}
                <div
                  className={`p-8 flex-grow flex flex-col justify-center ${
                    currentDemo.theme === "dark"
                      ? "bg-gray-950 text-white"
                      : currentDemo.theme === "green"
                      ? "bg-emerald-50 text-gray-800"
                      : currentDemo.theme === "gold"
                      ? "bg-slate-900 text-amber-100"
                      : "bg-gray-50 text-gray-800"
                  }`}
                >
                  <div className="max-w-xl space-y-4">
                    <span
                      className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                        currentDemo.theme === "gold"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {currentDemo.category}
                    </span>
                    <h1 className="font-headline-lg text-headline-lg leading-tight">{currentDemo.heroTitle}</h1>
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{currentDemo.heroSub}</p>
                    <div className="pt-2">
                      <button
                        className={`font-semibold text-xs px-5 py-2.5 rounded-lg transition-all ${
                          currentDemo.theme === "gold"
                            ? "bg-amber-500 text-gray-950 hover:bg-amber-400"
                            : currentDemo.theme === "dark"
                            ? "bg-white text-gray-950 hover:bg-gray-200"
                            : "bg-primary text-white hover:opacity-95"
                        }`}
                      >
                        Book Consultation
                      </button>
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div
                  className={`p-6 border-t border-gray-100 grid grid-cols-2 gap-3 shrink-0 ${
                    currentDemo.theme === "dark" ? "bg-gray-950 border-gray-900 text-white" : "bg-white"
                  }`}
                >
                  {currentDemo.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[10px] text-gray-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
