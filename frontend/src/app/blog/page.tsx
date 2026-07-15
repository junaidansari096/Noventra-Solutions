"use client";

import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";

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

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/blogs/`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setBlogs(data))
      .catch((err) => console.log("Failed to fetch blogs", err));
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const defaultBlogs = [
    {
      id: 1,
      title: "The Shift to Sovereign Clouds: Why Compliance Matters Now",
      summary: "Exploring the geopolitical implications of data storage and why enterprises are moving away from public cloud monopolies.",
      content: "As governments worldwide tighten restrictions on where citizen data can reside, sovereign clouds are rapidly transitioning from niche solutions to mainstream enterprise requirements. Public cloud monopolies are no longer sufficient for industries dealing with highly sensitive financial, healthcare, or municipal data.\n\nSovereign clouds solve this by ensuring compliance with localized data protection rules (such as GDPR in Europe) while retaining the scalability of modern cloud platforms. Over the next decade, we expect a major shift in how CTOs architect multi-cloud infrastructure to prioritize national and regional data residency.",
      cover_image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqwVmFR5btxrCDbxsO9XQA9lAT9cQbFCZZ1q2WMJjAxfRt_kkUL9Bd7wXbVmYu7yMgWc19Ze9eb3HDs5wIWqQI1lH4UIhi85jUI9GxbOlY9PcQIJx-t-2uKRhv2QrDiyfhg1ZGXHQDQ7tAWsaLauNTGzeuIHZLAER41Cs1X8YlGRqEKjmPDMEhaXMhiH8Md78AA0kj_s7yjrP3rVgasobLT7JCju62mQMkebz2bBX7lOkiySnX1YJ-2A",
      author_name: "Sarah Chen",
      tags: ["Cloud Compliance", "DevOps", "Enterprise"],
      published_at: "2024-03-12T00:00:00Z"
    },
    {
      id: 2,
      title: "Generative AI in the Enterprise: Beyond the Hype",
      summary: "A pragmatic guide for CTOs on integrating large language models without compromising corporate security.",
      content: "While artificial intelligence continues to dominate boardroom discussions, many organizations struggle to move from experimental sandboxes to secure, production-ready enterprise applications.\n\nThe main issue is data leakage. Directing sensitive corporate data to third-party public models is a security liability. To build confidence, enterprises are adopting local, hosted LLMs that interact securely with closed company databases through Retrieval-Augmented Generation (RAG). By focusing on privacy and model validation, enterprises can harvest real automation benefits without risking intellectual property breaches.",
      cover_image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCluaeSCiuT-_3h5m5Q-9AdjpVNkqY3Lco7xkgb5qli97-RgfxxeWUb29OJdLl8VeWoxN-0DyTYtlgJey2bNf-CtEjdNIP74nyFuXXJhPp3JcPZgKwDuQnbBPvrjK3GwlBd4i0YbLzQgnZhCpmJSj2mN5mY1h76dbPJQdEn5hslB3fc4jR4ZGodHkTrOFyWqyScXpEWQODeiyR8hWIEvPi5_9YvqbdC3zGGLED2HQ9QK0dKOd2hUcjTEA",
      author_name: "Marcus Vance",
      tags: ["Artificial Intelligence", "Security", "SaaS Strategy"],
      published_at: "2024-02-28T00:00:00Z"
    },
    {
      id: 3,
      title: "Design as a Performance Metric: UI/UX in SaaS",
      summary: "How refined user experience directly impacts retention rates and long-term customer lifetime value in B2B software.",
      content: "Historically, enterprise software has prioritised features over form. However, a major shift is underway. Today's B2B clients demand the same ease-of-use and visual delight that they experience in B2C apps.\n\nGood UI/UX is no longer just aesthetic; it's a performance metric. Streamlined user paths directly reduce user errors, decrease onboarding training costs, and increase retention rates. When B2B software is delightful and intuitive, users stick around longer, positively impacting client lifetime value.",
      cover_image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA2ylHT_3wkVlq-5LZKE3QTT7HvePyFo2oGnHMLEQysgdqyRvlhdiex7lOCutP7QsBEddToe3-9ZIXq6dnfza9cOP7drkaAQE1hd6nZVto6lOaR6ODFa4CucwJzq4x5zOj8PUs3nw9rt75iI5QI591iutDMhxbWqSRKNTqaVYMP4xqWPO9iX5wacYhEUhkV5h6ouSGjFNWCeeapitMKFz_GlNGOZLwSxZV3epvwa-AbQepEBViE7TIWOw",
      author_name: "Elena Rostova",
      tags: ["UI Design System", "SaaS Growth", "User Experience"],
      published_at: "2024-02-15T00:00:00Z"
    }
  ];

  const displayBlogs = blogs.length > 0 ? blogs : defaultBlogs;

  return (
    <div className="min-h-screen pt-xxl bg-background text-on-background">
      <div className="max-w-container-max mx-auto px-gutter py-20">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-md">
          <div className="inline-flex items-center px-sm py-xs bg-primary/10 rounded-full mb-md">
            <span className="text-primary font-label-sm text-label-sm px-sm">RESEARCH &amp; ANALYSIS</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg md:text-display-lg md:font-display-lg text-on-surface">Industry Insights</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Stay ahead of the curve with our expert analysis on emerging technologies and market trends.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayBlogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-2xl overflow-hidden border border-outline-variant hover:shadow-xl transition-all duration-300 flex flex-col h-full">
              <div className="relative aspect-video w-full overflow-hidden bg-surface-container-low shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={blog.cover_image}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-[11px] text-on-surface-variant/80 mb-3">
                  <span className="flex items-center gap-1 font-semibold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-primary text-[14px]">calendar_today</span>
                    {formatDate(blog.published_at)}
                  </span>
                  <span className="flex items-center gap-1 font-semibold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-primary text-[14px]">person</span>
                    {blog.author_name}
                  </span>
                </div>
                <h3
                  className="font-headline-md text-headline-md text-on-surface mb-3 hover:text-primary transition-colors cursor-pointer leading-snug"
                  onClick={() => setSelectedBlog(blog)}
                >
                  {blog.title}
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                  {blog.summary}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {blog.tags.map((tag, idx) => (
                    <span key={idx} className="bg-surface-container text-primary font-mono text-[10px] px-2.5 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedBlog(blog)}
                  className="inline-flex items-center justify-between py-sm border-t border-surface-variant text-primary font-label-md group cursor-pointer text-left w-full"
                >
                  <span>Read Article</span>
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">chevron_right</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reader Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-outline-variant rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="sticky top-0 right-0 p-4 flex justify-between items-center border-b border-outline-variant bg-white/95 backdrop-blur z-20">
              <span className="font-semibold text-xs text-primary uppercase tracking-widest">Currently Reading</span>
              <button
                onClick={() => setSelectedBlog(null)}
                className="p-1 rounded-lg bg-surface-container-low border border-outline-variant/60 text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all cursor-pointer flex items-center justify-center"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                <span className="flex items-center gap-1 font-semibold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-primary text-[14px]">calendar_today</span>
                  {formatDate(selectedBlog.published_at)}
                </span>
                <span className="flex items-center gap-1 font-semibold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-primary text-[14px]">person</span>
                  {selectedBlog.author_name}
                </span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface leading-tight">
                {selectedBlog.title}
              </h2>
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedBlog.cover_image}
                  alt={selectedBlog.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-on-surface-variant text-sm leading-relaxed whitespace-pre-line space-y-4 font-body-md pt-2">
                {selectedBlog.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
