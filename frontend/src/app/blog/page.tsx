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

  const displayBlogs = blogs;

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
