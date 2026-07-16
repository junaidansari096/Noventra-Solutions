"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL } from "../../config";

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

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetch(`${API_URL}/api/projects/`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setProjects(data))
      .catch((err) => console.log("Failed to fetch projects", err));
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = filterCategory === "All" || project.category.toLowerCase() === filterCategory.toLowerCase();
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.tech_stack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (project.client_name && project.client_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const categories = Array.from(new Set([
    "All",
    ...projects.map((p) => p.category)
  ]));

  const displayProjects = filteredProjects;

  return (
    <div className="min-h-screen pt-20 bg-background">
      {/* Hero Section */}
      <section className="px-gutter pt-16 pb-12 text-center max-w-container-max mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-container-low rounded-full mb-6 border border-outline-variant/30">
          <span className="material-symbols-outlined text-[18px] text-primary">auto_awesome</span>
          <span className="font-semibold text-xs text-on-surface-variant uppercase tracking-widest">Case Studies</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg md:font-display-lg md:text-display-lg text-on-surface mb-4">Our Portfolio</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Explore our curated collection of digital experiences, where precision engineering meets innovative design to solve complex business challenges.
        </p>
      </section>

      {/* Filter and Search Section */}
      <section className="px-gutter pb-20 max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-6 py-2.5 rounded-full border font-semibold text-sm transition-all cursor-pointer ${
                  filterCategory === cat
                    ? "bg-primary border-primary text-white"
                    : "border-outline-variant hover:border-primary text-on-surface-variant bg-surface"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-[20px]">search</span>
            <input
              type="text"
              placeholder="Search stack, client, tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-xl py-2.5 pl-10 pr-4 text-sm text-on-surface focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Bento Grid Portfolio */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.length > 0 ? (
            displayProjects.map((proj) => (
              <div key={proj.id} className="group relative overflow-hidden rounded-xl bg-white border border-surface-variant shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full">
                <div className="aspect-[4/3] relative overflow-hidden bg-surface-container-low shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                    alt={proj.title}
                    src={proj.image_url}
                  />
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center justify-center bg-primary/5 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                      {proj.category}
                    </span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{proj.title}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 flex-grow">
                    {proj.description}
                  </p>
                  
                  {proj.tech_stack && proj.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {proj.tech_stack.map((tech, idx) => (
                        <span key={idx} className="bg-surface-container text-primary font-mono text-[10px] px-2 py-0.5 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 border-t border-outline-variant/20 flex justify-between items-center mt-auto">
                    {proj.preview_url ? (
                      <a
                        className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
                        href={proj.preview_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Project <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </a>
                    ) : (
                      <span className="text-on-surface-variant/50 text-xs">No public link</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-20 text-on-surface-variant font-body-lg">
              No matching projects found. Try checking other categories or keywords.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
