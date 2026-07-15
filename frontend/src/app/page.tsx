"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL } from "../config";

interface Offer {
  id: number;
  title: string;
  discount_percentage: number;
  ends_at: string;
  is_active: boolean;
  coupon_code: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  price_range: string;
  icon: string;
  features: string[];
}

interface Project {
  id: number;
  title: string;
  client_name: string;
  description: string;
  image_url: string;
  preview_url: string;
  tech_stack: string[];
  category: string;
  featured: boolean;
}

interface Blog {
  id: number;
  title: string;
  content: string;
  summary: string;
  cover_image: string;
  author_name: string;
  tags: string[];
  published_at: string;
}

export default function HomePage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Fetch offers
    fetch(`${API_URL}/api/offers/`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const activeOffers = data.filter((o: Offer) => o.is_active);
        setOffers(activeOffers);
        if (activeOffers.length > 0) {
          calculateTimeLeft(activeOffers[0].ends_at);
        }
      })
      .catch((err) => console.log("Failed to fetch offers", err));

    // Fetch services
    fetch(`${API_URL}/api/services/`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setServices(data.slice(0, 3)))
      .catch((err) => console.log("Failed to fetch services", err));

    // Fetch projects
    fetch(`${API_URL}/api/projects/`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setProjects(data.filter((p: Project) => p.featured)))
      .catch((err) => console.log("Failed to fetch projects", err));

    // Fetch blogs
    fetch(`${API_URL}/api/blogs/`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setBlogs(data.slice(0, 3)))
      .catch((err) => console.log("Failed to fetch blogs", err));
  }, []);

  // Countdown timer logic
  useEffect(() => {
    if (offers.length === 0) return;
    
    const timer = setInterval(() => {
      calculateTimeLeft(offers[0].ends_at);
    }, 1000);

    return () => clearInterval(timer);
  }, [offers]);

  const calculateTimeLeft = (endsAtStr: string) => {
    const difference = +new Date(endsAtStr) - +new Date();
    if (difference <= 0) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    setTimeLeft({
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    });
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "Code2":
      case "cloud_done":
        return "cloud_done";
      case "Server":
      case "security":
        return "security";
      case "ShieldCheck":
      case "insights":
        return "insights";
      default:
        return "rocket_launch";
    }
  };

  const defaultServices = [
    {
      id: 1,
      title: "Cloud Architecture",
      description: "Multi-cloud deployments and hybrid infrastructure strategies for seamless global operations.",
      icon: "cloud_done",
    },
    {
      id: 2,
      title: "Cyber Resilience",
      description: "Advanced zero-trust security frameworks protecting your most critical digital assets.",
      icon: "security",
    },
    {
      id: 3,
      title: "Data Intelligence",
      description: "Transforming raw organizational data into actionable strategic insights through AI.",
      icon: "insights",
    }
  ];

  const defaultProjects = [
    {
      id: 1,
      title: "Global Ledger System",
      category: "FinTech",
      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfYpnnCdZ0VkHNVMDATIyEqj6rAGVSwaFSPlXKCh4gmJOcGrqxCHr-204DbtpynQQv8FoSFPcK6ym5BfAHINqECdMzs5lnJrSK2oxaha4ZUNnxe3Z9UXZIGc1iY0_EbhX2nv4xnEEHOdAYqyygt_Qu5lo6XvI48oaQG0Llv5SwvWV-tfVsC8Hna8XxYeRShpE6xuAKF3kbmlWErIZo-hYVKoj5v8i8t-UsMk5U-a_y5JrhhVozvwcjSQ",
    },
    {
      id: 2,
      title: "AI Supply Core",
      category: "Logistics",
      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5RwgqAxHbDu4R17J-O1kZjiUP_WximmHqoC4e8c66M9xUCWA_hSwAaaV_qwdjczNfhOzD_mIG48duzRrDdcrPGwlC-F3LUlzeI61zjL4yV0SEGXytUnPG8Cy0qToi5F_02Jw2gRiE47WgdJkQQUN_ifkMk2-4uzHX3CfYGQXY9o3Hmuy1IM2Q-FjBuSkMx3K3oZoR8vfVDpm_3IDtBe2fyFhjpMhV2Za4lIxLswGAArZBTfKunYEKPg",
    },
    {
      id: 3,
      title: "Nexus Patient Care",
      category: "HealthTech",
      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRu-53Kh_zQiHpLBDMImaeSvW1SEaSQnHXvQOakmDvKiGlDCsT37sHxJdNfAfzEkgu7-Rw1s2AnPVsRh_KVuqCltPJR1TBPNmM82jn0E9kirJVJT_tUQy3J0sketlcyX8cx9kljHkSSlf6V-sIX1lWIBA1fTHrQfeBJDQlyQFVHVOBMEfZkxqCdUwkImo8gXKUnO8VH10HPMt6Yj7AlhlmQREJFS-zYUNM_ERJxnUMsOZTTC30a62XQg",
    }
  ];

  const defaultBlogs = [
    {
      id: 1,
      title: "The Shift to Sovereign Clouds: Why Compliance Matters Now",
      summary: "Exploring the geopolitical implications of data storage and why enterprises are moving away from public cloud monopolies.",
      cover_image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqwVmFR5btxrCDbxsO9XQA9lAT9cQbFCZZ1q2WMJjAxfRt_kkUL9Bd7wXbVmYu7yMgWc19Ze9eb3HDs5wIWqQI1lH4UIhi85jUI9GxbOlY9PcQIJx-t-2uKRhv2QrDiyfhg1ZGXHQDQ7tAWsaLauNTGzeuIHZLAER41Cs1X8YlGRqEKjmPDMEhaXMhiH8Md78AA0kj_s7yjrP3rVgasobLT7JCju62mQMkebz2bBX7lOkiySnX1YJ-2A",
      published_at: "2024-03-12T00:00:00Z",
    },
    {
      id: 2,
      title: "Generative AI in the Enterprise: Beyond the Hype",
      summary: "A pragmatic guide for CTOs on integrating large language models without compromising corporate security.",
      cover_image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCluaeSCiuT-_3h5m5Q-9AdjpVNkqY3Lco7xkgb5qli97-RgfxxeWUb29OJdLl8VeWoxN-0DyTYtlgJey2bNf-CtEjdNIP74nyFuXXJhPp3JcPZgKwDuQnbBPvrjK3GwlBd4i0YbLzQgnZhCpmJSj2mN5mY1h76dbPJQdEn5hslB3fc4jR4ZGodHkTrOFyWqyScXpEWQODeiyR8hWIEvPi5_9YvqbdC3zGGLED2HQ9QK0dKOd2hUcjTEA",
      published_at: "2024-02-28T00:00:00Z",
    },
    {
      id: 3,
      title: "Design as a Performance Metric: UI/UX in SaaS",
      summary: "How refined user experience directly impacts retention rates and long-term customer lifetime value in B2B software.",
      cover_image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA2ylHT_3wkVlq-5LZKE3QTT7HvePyFo2oGnHMLEQysgdqyRvlhdiex7lOCutP7QsBEddToe3-9ZIXq6dnfza9cOP7drkaAQE1hd6nZVto6lOaR6ODFa4CucwJzq4x5zOj8PUs3nw9rt75iI5QI591iutDMhxbWqSRKNTqaVYMP4xqWPO9iX5wacYhEUhkV5h6ouSGjFNWCeeapitMKFz_GlNGOZLwSxZV3epvwa-AbQepEBViE7TIWOw",
      published_at: "2024-02-15T00:00:00Z",
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Campaign Sale Banner */}
      {offers.length > 0 && (
        <div className="bg-gradient-to-r from-primary to-primary-container text-white py-3.5 px-gutter relative z-20">
          <div className="max-w-container-max mx-auto flex flex-col md:flex-row items-center justify-between gap-md">
            <div className="flex items-center gap-sm">
              <span className="bg-white/20 border border-white/30 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                Special Offer
              </span>
              <p className="font-label-md text-sm">
                {offers[0].title}: Use code <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded text-white font-extrabold">{offers[0].coupon_code}</span> for <span className="font-bold underline">{offers[0].discount_percentage}% OFF</span> services!
              </p>
            </div>
            <div className="flex items-center gap-md">
              <div className="flex gap-1.5 items-center">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span className="text-xs font-semibold uppercase tracking-wider mr-1">Ends in:</span>
                {[
                  { val: timeLeft.days, label: "d" },
                  { val: timeLeft.hours, label: "h" },
                  { val: timeLeft.minutes, label: "m" },
                  { val: timeLeft.seconds, label: "s" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center bg-black/20 border border-white/10 px-2 py-0.5 rounded">
                    <span className="font-mono font-bold text-xs">{item.val}</span>
                    <span className="text-white/60 text-[9px] ml-0.5">{item.label}</span>
                  </div>
                ))}
              </div>
              <Link href="/services" className="bg-white text-primary font-bold text-xs px-3.5 py-1.5 rounded-lg hover:bg-surface transition-all">
                Claim
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden hero-gradient">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tertiary/5 rounded-full blur-3xl"></div>
        </div>
        <div className="px-gutter max-w-container-max mx-auto w-full relative z-10 py-xxl">
          <div className="max-w-3xl space-y-lg">
            <div className="inline-flex items-center gap-xs px-md py-xs bg-surface-container rounded-full border border-outline-variant">
              <span className="material-symbols-outlined text-primary text-[18px]">rocket_launch</span>
              <span className="font-label-sm text-primary uppercase">Empowering Enterprise Evolution</span>
            </div>
            <h1 className="font-display-lg text-display-lg text-on-surface leading-tight tracking-tighter">
              Future-Proof Your <br className="hidden md:block" /> <span class="text-primary">Digital Presence</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              High-performance IT infrastructure and elite software solutions engineered for modern enterprises. We bridge the gap between complex engineering and premium business outcomes.
            </p>
            <div className="flex flex-wrap gap-md pt-md">
              <Link href="/contact" className="bg-primary text-white px-xxl py-md rounded-xl font-label-md shadow-lg shadow-primary/20 hover:translate-y-[-2px] transition-all">
                Book Consultation
              </Link>
              <Link href="/services" className="flex items-center gap-sm px-xl py-md border border-outline rounded-xl font-label-md text-on-surface hover:bg-surface-variant transition-all">
                <span className="material-symbols-outlined">explore</span>
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-xxl bg-surface">
        <div className="px-gutter max-w-container-max mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-md mb-xxl">
            <div className="max-w-xl space-y-md">
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Precision Engineered Services</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Scalable technological architecture designed to sustain growth and ensure operational excellence in a volatile market.</p>
            </div>
            <Link className="text-primary font-label-md flex items-center gap-xs hover:gap-sm transition-all" href="/services">
              View All Services <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {services.length > 0 ? (
              services.map((service) => (
                <div key={service.id} className="group p-lg bg-white border border-outline-variant rounded-xl hover:border-primary hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-primary-fixed rounded-lg flex items-center justify-center mb-lg group-hover:bg-primary-container group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-primary group-hover:text-white">{getServiceIcon(service.icon)}</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md mb-md">{service.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-xl">{service.description}</p>
                  <Link href="/services" className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">arrow_right_alt</Link>
                </div>
              ))
            ) : (
              defaultServices.map((service) => (
                <div key={service.id} className="group p-lg bg-white border border-outline-variant rounded-xl hover:border-primary hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-primary-fixed rounded-lg flex items-center justify-center mb-lg group-hover:bg-primary-container group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-primary group-hover:text-white">{service.icon}</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md mb-md">{service.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-xl">{service.description}</p>
                  <Link href="/services" className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">arrow_right_alt</Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Live Statistics (Bento Style) */}
      <section className="py-xxl bg-inverse-surface text-inverse-on-surface">
        <div className="px-gutter max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-lg">
            <div className="md:col-span-2 space-y-md p-xl">
              <h2 className="font-headline-lg text-headline-lg">Reliability in Numbers</h2>
              <p className="text-on-surface-variant/80">We don't just promise results; we quantify them. Our track record spans across continents and industries.</p>
            </div>
            <div className="bg-surface/10 backdrop-blur-md p-xl rounded-2xl flex flex-col justify-center items-center text-center">
              <span className="font-display-lg text-display-lg text-primary-fixed-dim">200+</span>
              <span className="font-label-md text-inverse-on-surface/60 uppercase">Projects Delivered</span>
            </div>
            <div className="bg-surface/10 backdrop-blur-md p-xl rounded-2xl flex flex-col justify-center items-center text-center">
              <span className="font-display-lg text-display-lg text-primary-fixed-dim">95%</span>
              <span className="font-label-md text-inverse-on-surface/60 uppercase">Satisfaction Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Showcase */}
      <section className="py-xxl overflow-hidden bg-surface-container-low">
        <div className="px-gutter max-w-container-max mx-auto mb-lg flex justify-between items-center">
          <h2 className="font-headline-lg text-headline-lg">Impactful Transformations</h2>
          <Link href="/portfolio" className="text-primary text-sm font-semibold hover:underline">
            View All Work
          </Link>
        </div>
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="flex gap-lg overflow-x-auto custom-scrollbar pb-lg snap-x">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div key={project.id} className="min-w-[320px] md:min-w-[480px] group snap-start">
                  <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden mb-md shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={project.title} src={project.image_url} />
                    <div className="absolute bottom-md left-md z-20">
                      <span className="bg-primary/90 text-white px-md py-xs rounded-full text-label-sm uppercase mb-xs inline-block">{project.category}</span>
                      <h4 className="text-white font-headline-md">{project.title}</h4>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              defaultProjects.map((project) => (
                <div key={project.id} className="min-w-[320px] md:min-w-[480px] group snap-start">
                  <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden mb-md shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={project.title} src={project.image_url} />
                    <div className="absolute bottom-md left-md z-20">
                      <span className="bg-primary/90 text-white px-md py-xs rounded-full text-label-sm uppercase mb-xs inline-block">{project.category}</span>
                      <h4 className="text-white font-headline-md">{project.title}</h4>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Latest Blogs / Insights */}
      <section className="py-xxl">
        <div className="px-gutter max-w-container-max mx-auto">
          <div className="text-center mb-xxl max-w-2xl mx-auto space-y-md">
            <h2 className="font-headline-lg text-headline-lg">Industry Insights</h2>
            <p className="font-body-md text-on-surface-variant">Stay ahead of the curve with our expert analysis on emerging technologies and market trends.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <article key={blog.id} className="bg-white rounded-2xl p-md border border-outline-variant hover:shadow-lg transition-all flex flex-col">
                  <div className="rounded-xl overflow-hidden mb-md h-48">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="w-full h-full object-cover" alt={blog.title} src={blog.cover_image} />
                  </div>
                  <div className="px-xs flex-grow">
                    <time className="text-label-sm text-outline uppercase">{new Date(blog.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
                    <h3 className="font-headline-md text-headline-md mt-sm mb-md leading-snug">{blog.title}</h3>
                    <p className="text-body-sm text-on-surface-variant line-clamp-2">{blog.summary}</p>
                  </div>
                  <Link className="mt-lg px-xs py-sm border-t border-surface-variant flex items-center justify-between text-primary font-label-md group" href="/blog">
                    Read Article
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">chevron_right</span>
                  </Link>
                </article>
              ))
            ) : (
              defaultBlogs.map((blog) => (
                <article key={blog.id} className="bg-white rounded-2xl p-md border border-outline-variant hover:shadow-lg transition-all flex flex-col">
                  <div className="rounded-xl overflow-hidden mb-md h-48">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="w-full h-full object-cover" alt={blog.title} src={blog.cover_image} />
                  </div>
                  <div className="px-xs flex-grow">
                    <time className="text-label-sm text-outline uppercase">{new Date(blog.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
                    <h3 className="font-headline-md text-headline-md mt-sm mb-md leading-snug">{blog.title}</h3>
                    <p className="text-body-sm text-on-surface-variant line-clamp-2">{blog.summary}</p>
                  </div>
                  <Link className="mt-lg px-xs py-sm border-t border-surface-variant flex items-center justify-between text-primary font-label-md group" href="/blog">
                    Read Article
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">chevron_right</span>
                  </Link>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-xxl px-gutter">
        <div className="max-w-container-max mx-auto bg-primary rounded-3xl p-xl md:p-xxl relative overflow-hidden text-center text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]"></div>
          <div className="relative z-10 space-y-lg max-w-2xl mx-auto">
            <h2 className="font-headline-lg text-headline-lg">Ready to Scale Your Digital Horizon?</h2>
            <p className="text-body-lg text-primary-fixed-dim">Partner with Noventra to transform your technological challenges into competitive advantages.</p>
            <div className="flex flex-col md:flex-row gap-md justify-center pt-md">
              <Link href="/contact" className="bg-white text-primary px-xxl py-md rounded-xl font-label-md hover:bg-surface-container transition-all">
                Book a Strategy Call
              </Link>
              <Link href="/services" className="border border-white/30 px-xxl py-md rounded-xl font-label-md hover:bg-white/10 transition-all">
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
