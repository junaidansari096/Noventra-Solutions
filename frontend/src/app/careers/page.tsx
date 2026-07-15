"use client";

import React, { useState } from "react";

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  requirements: string[];
}

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", portfolio: "", resumeName: "", coverLetter: "" });
  const [applied, setApplied] = useState(false);

  const jobs: Job[] = [
    {
      id: "frontend",
      title: "Senior Frontend Engineer (Next.js / React)",
      department: "Engineering",
      location: "Remote (Global)",
      type: "Full-Time",
      salary: "$80,000 - $110,000",
      requirements: ["5+ years React experience", "Deep knowledge of Next.js 15, SSR and RSCs", "Proficiency in Tailwind CSS and Framer Motion", "Experience building premium responsive UIs"],
    },
    {
      id: "devops",
      title: "Cloud Infrastructure Architect",
      department: "Operations",
      location: "Hybrid / Remote",
      type: "Full-Time",
      salary: "$90,000 - $120,000",
      requirements: ["AWS Certified Solution Architect preferred", "Infrastructure as Code (Terraform)", "Docker / Kubernetes cluster setup", "Experience managing Postgres scaling & backups"],
    },
    {
      id: "support",
      title: "Technical Customer Success Specialist",
      department: "Support",
      location: "Remote (EU/US hours)",
      type: "Part-Time / Full-Time",
      salary: "$25 - $40 / hour",
      requirements: ["Basic HTML/CSS understanding", "Experience managing Zendesk or active support chat channels", "Excellent written and verbal communication", "Ability to coordinate with project managers"],
    }
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setApplied(true);
    setTimeout(() => {
      setApplied(false);
      setSelectedJob(null);
      setFormData({ name: "", email: "", portfolio: "", resumeName: "", coverLetter: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen pt-xxl bg-background text-on-background">
      <div className="max-w-container-max mx-auto px-gutter py-20">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-md">
          <div className="inline-flex items-center px-sm py-xs bg-primary/10 rounded-full mb-md">
            <span className="text-primary font-label-sm text-label-sm px-sm">WE ARE HIRING</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg md:text-display-lg md:font-display-lg text-on-surface">Join the Noventra Team</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            We are always looking for talented designers, engineers, and support staff who want to build the future of the web.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Jobs List */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-2">Open Opportunities</h3>
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-6 md:p-8 rounded-2xl border border-outline-variant/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                    {job.department}
                  </span>
                  <h4 className="font-headline-md text-headline-md text-on-surface">{job.title}</h4>
                  <div className="flex flex-wrap gap-4 text-xs text-on-surface-variant">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <span className="material-symbols-outlined text-primary text-[14px]">map</span> {job.location}
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold">
                      <span className="material-symbols-outlined text-primary text-[14px]">schedule</span> {job.type}
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold">
                      <span className="material-symbols-outlined text-primary text-[14px]">payments</span> {job.salary}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedJob(job)}
                  className="bg-primary text-white font-semibold text-xs px-5 py-3 rounded-xl hover:opacity-95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  View &amp; Apply
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            ))}
          </div>

          {/* Benefits Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-outline-variant/30 shadow-sm space-y-6">
              <h3 className="font-headline-md text-headline-md text-on-surface">Why Work With Us?</h3>
              <ul className="space-y-4">
                {[
                  { title: "Remote-First", desc: "Work from anywhere in the world. We value outputs over hours." },
                  { title: "Learning Budget", desc: "We provide $1,500/year for books, courses, and conferences." },
                  { title: "Premium Hardware", desc: "A top-spec MacBook Pro and accessories for your home office." },
                  { title: "Annual Retreats", desc: "Meet the team in tropical destinations for brainstorming." },
                ].map((b, idx) => (
                  <li key={idx} className="space-y-1">
                    <h4 className="font-bold text-sm text-primary">{b.title}</h4>
                    <p className="text-on-surface-variant text-xs leading-relaxed">{b.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-outline-variant rounded-2xl max-w-xl w-full p-8 relative shadow-2xl">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Apply for Position</h3>
            <p className="text-on-surface-variant text-xs mb-6">{selectedJob.title}</p>

            {applied ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-[32px]">check_circle</span>
                </div>
                <h4 className="font-bold text-on-surface text-lg">Application Submitted!</h4>
                <p className="text-on-surface-variant text-xs">
                  Thank you for applying, {formData.name}. We will review your materials and contact you within 48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary"
                    placeholder="Jane Doe"
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
                    placeholder="jane.doe@example.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-2">Portfolio / Git Link</label>
                    <input
                      type="url"
                      value={formData.portfolio}
                      onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-2">Resume File Name</label>
                    <input
                      type="text"
                      required
                      value={formData.resumeName}
                      onChange={(e) => setFormData({ ...formData, resumeName: e.target.value })}
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary"
                      placeholder="resume_jane_doe.pdf"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-2">Why are you a good fit?</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.coverLetter}
                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary resize-none"
                    placeholder="Tell us about your background..."
                  />
                </div>
                <div className="flex gap-4 pt-2">
                  <button
                    type="submit"
                    className="flex-grow bg-primary text-white font-semibold py-3.5 rounded-xl hover:opacity-95 transition-all cursor-pointer text-center text-sm"
                  >
                    Submit Application
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    className="bg-surface-container-low border border-outline-variant text-on-surface-variant font-semibold px-6 py-3.5 rounded-xl hover:text-primary transition-all cursor-pointer text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
