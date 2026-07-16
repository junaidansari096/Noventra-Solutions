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

  const defaultProjects = [
    {
      id: 1,
      title: "Nexus Global Banking",
      category: "Corporate",
      description: "Next-gen wealth management platform focused on transparency and security.",
      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCk1zyrHOh7_SSQOm0_Ax6d3b_NGz8SE5uwy0AVj-sZUp7b9rrihRsfyi0Gmsz7Nt0bI9xkLG_FA4hrg_fu0H-YGWndlFIiOcLAG_tuG29G7XACPSjFfw0ztYqegTHcuWdBnz-pTfClfqWLb6POV416jZueIW4K8jp3LC74tuya-YCR2QdKnN-ofjI9GFaGFFNg0gu3lqNdrLgkh9VKSwEX3rs5XlPT8tQYcG4e2lqvs6vxk44HfjL9JQ",
      preview_url: "#",
      tech_stack: ["Next.js", "FastAPI", "PostgreSQL", "TailwindCSS"],
      client_name: "Nexus Global",
      featured: true
    },
    {
      id: 2,
      title: "Lumière Boutique",
      category: "E-commerce",
      description: "Immersive direct-to-consumer experience with real-time inventory sync.",
      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9fBOuqkqNPlfa_QaQYpAN2GndsNolkzHqVByJC5zl-bhNE_FEcblH2Ea8f1crY4u2R6cvHVnLTY05b_qD7B8f8BvhRifMPXzp3YtnwNfzYiX61UGpXyaLG2HhSgsaMgMA0161paznyfjm51NWVhvu6-hcOaedtn2zU7B6joMwWE_KLK6qa8Wb1eW8RPAGTruWIGNLIjgkB6gmvqT5hhL7zh3T_6ayHIfXBBMrffxFDlxpuIzFaIQ1bw",
      preview_url: "#",
      tech_stack: ["React", "Node.js", "Shopify GraphQL API", "TailwindCSS"],
      client_name: "Lumière Fashion Group",
      featured: true
    },
    {
      id: 3,
      title: "FlowState Analytics",
      category: "Startup",
      description: "Unified data dashboard for agile marketing teams and growth specialists.",
      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3IC0fnYsKYB2RWDdNQAm4KOl0Qwmb3UTqssLZKgf3aghO4hnGff6sopxV1NBedrCsXCSBlvyzhK2dqIDMKL5o1GpgNd9zt0v2l3tx_nZ20FK0Ff9mpiiKa3f4Eqj-4-l_MsDzWRZJh4dZEyB2zr-f3LZFlxtqf-Gnj9GDXxzmC_RyomMM5DNUbS--Uxjs5IVZir0Oo7cQrdVGxdaQ0hNt8r3T6bjcdkW-fkAp9HCzlgrt3ClC8cJxqQ",
      preview_url: "#",
      tech_stack: ["Vite", "FastAPI", "Redis", "Chart.js"],
      client_name: "FlowState Inc.",
      featured: true
    },
    {
      id: 4,
      title: "Aether Cloud Infrastructure",
      category: "Tech",
      description: "Enterprise-grade cloud orchestration tool for global data centers.",
      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAC_R5emedeu-44oBAd8_cbsbcgxF_JyvEYrI9mg6n37GUPuDaYp3l5PK7LI4-BsF2UcGO0oTd4Q3rk7DWRaDXsYcSOn4r-ADOUIpQE-w252RZXzW1wrXY7mW_opl8dtNwrz9tjmwKCw4UXOie1fwePBxoQmhiVYJYy60EpiET_VBdi5iW5OvWqDDWYgSjwGlcKxgJ4Wt7HCMXWQ1Chyhb0x7iOpF4pPexoXjoK7zGjOKwDj3Zic38wyw",
      preview_url: "#",
      tech_stack: ["Go", "Kubernetes", "React", "gRPC"],
      client_name: "Aether Systems",
      featured: true
    },
    {
      id: 5,
      title: "GreenPeak Energy",
      category: "Corporate",
      description: "Interactive sustainability portal demonstrating global environmental impact.",
      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBr3zmd_aifnMNP0ZZpAg-YLy51VYCvXUtDjfWCLvRlGOEejIH-y9vrmjwn-BykA750LxZjD4e4rHjXQS3iD2K08vOb3u6jYZRvcn9Yh1IPHgMPJ8WlXBmhozn-9soNI-pbqal3tMKefxiPFX40a48rVNblqchcmIM3LPia_40VeLLqn1bTIbPP4DZpQi7C5F_lyr0VTfqC7YX2WURVNDT0fENqmsa8LWFj6P3EUc7HfQI5ScNFCoFy8w",
      preview_url: "#",
      tech_stack: ["Next.js", "D3.js", "FastAPI", "S3"],
      client_name: "GreenPeak Energy Corp",
      featured: true
    }
  ];

  const categories = Array.from(new Set([
    "All",
    ...projects.map((p) => p.category),
    ...defaultProjects.map((p) => p.category)
  ]));

  const displayProjects = projects.length > 0 ? filteredProjects : defaultProjects.filter((p) => {
    const matchesCategory = filterCategory === "All" || p.category.toLowerCase() === filterCategory.toLowerCase();
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tech_stack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

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
