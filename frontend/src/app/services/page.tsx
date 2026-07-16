"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL } from "../../config";

interface Service {
  id: number;
  title: string;
  description: string;
  price_range: string;
  icon: string;
  features: string[];
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [calcTier, setCalcTier] = useState<"standard" | "premium" | "enterprise">("premium");
  const [calcAddons, setCalcAddons] = useState({ hosting: true, maintenance: false, seo: true });

  useEffect(() => {
    fetch(`${API_URL}/api/services/`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setServices(data))
      .catch((err) => console.log("Failed to fetch services", err));
  }, []);

  const calculateTotal = () => {
    let base = 0;
    if (calcTier === "standard") base = 999;
    if (calcTier === "premium") base = 1999;
    if (calcTier === "enterprise") base = 3999;

    if (calcAddons.hosting) base += 29;
    if (calcAddons.maintenance) base += 99;
    if (calcAddons.seo) base += 149;

    return base;
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "Code2":
      case "web":
        return "web";
      case "Server":
      case "data_object":
        return "data_object";
      case "ShieldCheck":
      case "dns":
        return "dns";
      case "cloud_done":
        return "cloud_done";
      case "architecture":
        return "architecture";
      default:
        return "psychology";
    }
  };

  const defaultServices = [
    {
      id: 1,
      title: "Website Development",
      description: "High-performance marketing websites optimized for conversion, SEO, and lightning-fast loading speeds across all devices.",
      price_range: "$2,500",
      icon: "web",
      features: ["Custom UI design", "SEO optimization", "Responsive layouts", "1-year tech support"]
    },
    {
      id: 2,
      title: "Web Applications",
      description: "Complex SaaS platforms and custom internal tools built with robust architectures to handle scale and secure data management.",
      price_range: "$7,500",
      icon: "data_object",
      features: ["Database integrations", "Advanced security keys", "Admin dashboards", "Scalable backend API"]
    },
    {
      id: 3,
      title: "Hosting Solutions",
      description: "Fully managed, enterprise-grade hosting solutions with 99.9% uptime guarantee and daily automated backups for peace of mind.",
      price_range: "$49/mo",
      icon: "dns",
      features: ["99.9% uptime SLA", "Daily automated backups", "DDoS protection", "Server maintenance"]
    },
    {
      id: 4,
      title: "Cloud Solutions",
      description: "Infrastructure modernization via AWS, Azure, or GCP. Optimize your cloud spend and improve system reliability through DevOps.",
      price_range: "$4,000",
      icon: "cloud_done",
      features: ["Kubernetes & Docker", "CI/CD automated pipelines", "Cloud security policies", "Performance tuning"]
    },
    {
      id: 5,
      title: "Branding Design",
      description: "Visual identity systems designed for the digital age. We create logos, design systems, and brand guidelines that resonate.",
      price_range: "$3,200",
      icon: "architecture",
      features: ["Logo design", "Color system definition", "Typography styling guidelines", "Asset production pack"]
    },
    {
      id: 6,
      title: "Technical Consulting",
      description: "Expert guidance on stack selection, architectural audits, and digital transformation roadmaps tailored to your goals.",
      price_range: "$150/hr",
      icon: "psychology",
      features: ["Stack assessment", "Architecture audit", "Technical strategy", "Expert mentoring"]
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="px-gutter pt-16 pb-8 max-w-container-max mx-auto text-center">
        <div className="inline-flex items-center px-4 py-1 bg-primary/10 rounded-full mb-6">
          <span className="text-primary font-semibold text-xs uppercase tracking-wider px-2">EXPERTISE &amp; INNOVATION</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg md:text-display-lg md:font-display-lg text-on-surface mb-4">
          Our Expertise
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Scalable solutions engineered for the modern enterprise. We bridge the gap between technical complexity and business velocity.
        </p>
      </section>
 
      {/* Services Grid */}
      <section className="px-gutter pb-20 max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(services.length > 0 ? services : defaultServices).map((service) => (
            <div key={service.id} className="service-card group bg-surface-container-lowest border border-outline-variant/30 p-8 rounded-xl flex flex-col h-full hover:border-primary/50 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors duration-300">
                  {getServiceIcon(service.icon)}
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{service.title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6 flex-grow">
                {service.description}
              </p>
              
              {service.features && service.features.length > 0 && (
                <div className="mb-4">
                  <ul className="space-y-1.5">
                    {service.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 font-body-sm text-xs text-on-surface-variant">
                        <span className="material-symbols-outlined text-primary text-[14px]">check_circle</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
 
              <div className="pt-6 border-t border-outline-variant/20 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-xs text-on-surface-variant uppercase tracking-widest">Rate</span>
                  <span className="font-headline-md text-headline-md text-primary">{service.price_range}</span>
                </div>
                <Link href="/contact" className="w-full text-center py-2.5 border border-primary text-primary font-semibold text-sm rounded-lg hover:bg-primary hover:text-white transition-all duration-300">
                  Get Started
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
 
      {/* Pricing Calculator */}
      <section className="px-gutter pb-20 max-w-container-max mx-auto">
        <div className="bg-white border border-outline-variant rounded-2xl p-8 md:p-12 shadow-sm">
          <div className="max-w-xl mb-8">
            <span className="text-primary font-semibold text-xs uppercase tracking-widest mb-2 inline-block">Cost Estimator</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Estimate Your Project</h2>
            <p className="font-body-md text-on-surface-variant">Configure your development tier and cloud-management services below to calculate a baseline monthly estimation.</p>
          </div>
 
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Options */}
            <div className="space-y-6">
              <div>
                <label className="block font-semibold text-sm text-on-surface mb-3">Design &amp; Engineering Tier</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "standard", label: "Standard", price: "$999" },
                    { id: "premium", label: "Premium", price: "$1,999" },
                    { id: "enterprise", label: "Enterprise", price: "$3,999" },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => setCalcTier(tier.id as any)}
                      className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                        calcTier === tier.id
                          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                          : "bg-surface-container-lowest border-outline-variant hover:bg-surface-container-low"
                      }`}
                    >
                      <div className="font-semibold text-sm">{tier.label}</div>
                      <div className={`text-xs mt-1 ${calcTier === tier.id ? "text-white/80" : "text-on-surface-variant"}`}>{tier.price}</div>
                    </button>
                  ))}
                </div>
              </div>
 
              <div>
                <label className="block font-semibold text-sm text-on-surface mb-3">Add-on Infrastructure Care</label>
                <div className="space-y-3">
                  {[
                    { id: "hosting", label: "Managed Cloud Hosting Setup", price: "+$29/mo" },
                    { id: "maintenance", label: "Monthly Caretaker Maintenance Support", price: "+$99/mo" },
                    { id: "seo", label: "Elite SEO & Conversion Campaign", price: "+$149/mo" },
                  ].map((addon) => (
                    <label
                      key={addon.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-outline-variant/60 hover:bg-surface-container-low cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={(calcAddons as any)[addon.id]}
                          onChange={(e) => setCalcAddons({ ...calcAddons, [addon.id]: e.target.checked })}
                          className="w-4 h-4 text-primary focus:ring-primary rounded border-outline-variant"
                        />
                        <span className="font-medium text-sm text-on-surface">{addon.label}</span>
                      </div>
                      <span className="font-semibold text-sm text-primary">{addon.price}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
 
            {/* Result Display */}
            <div className="bg-surface-container-low rounded-2xl p-8 flex flex-col justify-between items-center text-center">
              <div className="space-y-2">
                <span className="font-semibold text-xs text-on-surface-variant/80 uppercase tracking-wider">Baseline Project Quote</span>
                <div className="text-display-lg font-display-lg text-primary leading-none py-4">${calculateTotal()}</div>
                <p className="font-body-sm text-xs text-on-surface-variant/75 max-w-sm">This estimation represents a baseline implementation code package. Actual enterprise SLA requirements will be customized during alignment calls.</p>
              </div>
              <Link href="/contact" className="w-full mt-6 py-3 bg-primary text-white font-semibold text-sm rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20">
                Claim Quote &amp; Book Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
