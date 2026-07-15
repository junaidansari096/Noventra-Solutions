"use client";

import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";

interface Service {
  id: number;
  title: string;
  price_range: string;
  description: string;
}

interface Offer {
  id: number;
  title: string;
  discount_percentage: number;
  coupon_code: string;
  ends_at: string;
  is_active: boolean;
}

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

interface CustomerProject {
  id: number;
  title: string;
  progress_percent: number;
  status: string;
  hosting_status: string;
}

interface SupportTicket {
  id: number;
  subject: string;
  status: string;
}

interface Message {
  id: number;
  sender_id: number;
  message: string;
  created_at: string;
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState("admin@noventra.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"services" | "offers" | "progress" | "contacts" | "chat">("services");

  // Admin Data lists
  const [services, setServices] = useState<Service[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [customerProjects, setCustomerProjects] = useState<CustomerProject[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState("");

  // Form states
  const [newService, setNewService] = useState({ title: "", description: "", price_range: "", icon: "Code2", features: [""] });
  const [activeOffer, setActiveOffer] = useState<Offer | null>(null);
  const [selectedProject, setSelectedProject] = useState<CustomerProject | null>(null);

  useEffect(() => {
    // Check active admin session cookie on load
    fetch(`${API_URL}/api/auth/me`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("No active session");
        return res.json();
      })
      .then((data) => {
        if (data.role !== "admin") throw new Error("Not authorized");
        setToken("admin_session_active");
        fetchAdminData();
      })
      .catch(() => {
        setToken(null);
      });
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid credentials");
        return res.json();
      })
      .then((data) => {
        setToken("admin_session_active");
        fetchAdminData();
      })
      .catch((err) => setError(err.message));
  };

  const handleLogout = () => {
    fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    })
      .then(() => {
        setToken(null);
      })
      .catch((err) => console.log(err));
  };

  const fetchAdminData = () => {
    // Services
    fetch(`${API_URL}/api/services/all`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setServices(data))
      .catch((err) => console.log(err));

    // Offers
    fetch(`${API_URL}/api/offers/all`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setOffers(data);
        if (data.length > 0) setActiveOffer(data[0]);
      })
      .catch((err) => console.log(err));

    // Customer Projects
    fetch(`${API_URL}/api/customer-projects/`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setCustomerProjects(data);
        if (data.length > 0) setSelectedProject(data[0]);
      })
      .catch((err) => console.log(err));

    // Contacts
    fetch(`${API_URL}/api/contacts/`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setContacts(data))
      .catch((err) => console.log(err));

    // Tickets
    fetch(`${API_URL}/api/tickets/`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setTickets(data);
        if (data.length > 0) {
          setSelectedTicketId(data[0].id);
          fetchTicketMessages(data[0].id);
        }
      })
      .catch((err) => console.log(err));
  };

  const fetchTicketMessages = (ticketId: number) => {
    fetch(`${API_URL}/api/tickets/${ticketId}`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setMessages(data.messages);
      })
      .catch((err) => console.log(err));
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    fetch(`${API_URL}/api/services/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newService,
        features: newService.features.filter((f) => f.trim() !== ""),
      }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setServices([...services, data]);
        setNewService({ title: "", description: "", price_range: "", icon: "Code2", features: [""] });
      })
      .catch((err) => console.log(err));
  };

  const handleSaveOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !activeOffer) return;

    fetch(`${API_URL}/api/offers/${activeOffer.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activeOffer),
      credentials: "include",
    })
      .then((res) => res.json())
      .then(() => {
        alert("Offer changes saved successfully!");
      })
      .catch((err) => console.log(err));
  };

  const handleSaveProjectProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedProject) return;

    fetch(`${API_URL}/api/customer-projects/${selectedProject.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        progress_percent: selectedProject.progress_percent,
        status: selectedProject.status,
        hosting_status: selectedProject.hosting_status,
      }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then(() => {
        alert("Project progress updated successfully!");
        fetchAdminData();
      })
      .catch((err) => console.log(err));
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !token || selectedTicketId === null) return;

    fetch(`${API_URL}/api/tickets/${selectedTicketId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: replyText }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages([...messages, data]);
        setReplyText("");
      })
      .catch((err) => console.log(err));
  };

  if (!token) {
    return (
      <div className="max-w-md mx-auto my-24 p-8 rounded-2xl bg-white border border-outline-variant/40 shadow-xl">
        <div className="text-center mb-8">
          <h2 className="font-headline-md text-headline-md text-on-surface">Admin Dashboard Login</h2>
          <p className="text-on-surface-variant text-xs mt-2">Manage agency services, campaigns, website progress trackers.</p>
        </div>
        {error && (
          <div className="bg-error-container border border-error/20 text-error text-xs p-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-2">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/55 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-2">Admin Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/55 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white font-semibold py-3.5 rounded-xl hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <span>Log In</span>
            <span className="material-symbols-outlined text-[18px]">login</span>
          </button>
        </form>
        <div className="text-center mt-6 text-xs text-on-surface-variant/85 leading-relaxed bg-surface-container-low p-3 rounded-xl border border-outline-variant/30">
          Demo Admin Account:<br />
          Email: <span className="text-primary font-bold font-mono">admin@noventra.com</span> / PW: <span className="text-primary font-bold font-mono">admin123</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto px-gutter py-12 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Agency Dashboard</h1>
          <p className="text-on-surface-variant text-xs mt-1">Console mode / Logged in as administrator</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-surface-container-low border border-outline-variant/30 text-on-surface-variant font-semibold text-xs px-5 py-3 rounded-xl hover:text-primary transition-colors"
        >
          Disconnect console
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-8 border-b border-outline-variant/30 pb-4">
        {[
          { id: "services", name: "Create Services", icon: "add_circle" },
          { id: "offers", name: "Sales & Offers", icon: "percent" },
          { id: "progress", name: "Website Trackers", icon: "settings" },
          { id: "contacts", name: "Contact Submissions", icon: "mail" },
          { id: "chat", name: "Customer Support Logs", icon: "forum" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 pb-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === tab.id
                ? "border-primary text-primary font-extrabold"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === "services" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1 bg-white p-8 rounded-2xl border border-outline-variant/30 shadow-sm space-y-6">
            <h3 className="font-headline-md text-headline-md text-on-surface">Create New Service</h3>
            <form onSubmit={handleCreateService} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-2">Service Title</label>
                <input
                  type="text"
                  value={newService.title}
                  onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  placeholder="e.g. Mobile App Dev"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-2">Price Range</label>
                <input
                  type="text"
                  value={newService.price_range}
                  onChange={(e) => setNewService({ ...newService, price_range: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  placeholder="e.g. $1999 - $4999"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-2">Description</label>
                <textarea
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary resize-none"
                  rows={3}
                  placeholder="Describe details..."
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-2">Service features (list, one per line)</label>
                <textarea
                  value={newService.features.join("\n")}
                  onChange={(e) => setNewService({ ...newService, features: e.target.value.split("\n") })}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary resize-none"
                  rows={4}
                  placeholder="100% Unique Design&#10;Next.js Tech Stack"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:opacity-95 text-white font-semibold py-3 rounded-xl transition-colors text-xs cursor-pointer"
              >
                Publish Service Element
              </button>
            </form>
          </div>

          {/* List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-2">Active Services Catalog</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((s) => (
                <div key={s.id} className="bg-white p-6 rounded-xl border border-outline-variant/30 shadow-sm">
                  <h4 className="font-bold text-on-surface text-base mb-1">{s.title}</h4>
                  <div className="text-primary text-xs font-bold mb-3">{s.price_range}</div>
                  <p className="text-on-surface-variant text-xs leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "offers" && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-outline-variant/30 shadow-sm space-y-6">
          <h3 className="font-headline-md text-headline-md text-on-surface">Edit Active Discount Campaign</h3>
          {activeOffer ? (
            <form onSubmit={handleSaveOffer} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-2">Campaign Title</label>
                <input
                  type="text"
                  value={activeOffer.title}
                  onChange={(e) => setActiveOffer({ ...activeOffer, title: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-on-surface-variant mb-2">Discount Percentage</label>
                  <input
                    type="number"
                    value={activeOffer.discount_percentage}
                    onChange={(e) => setActiveOffer({ ...activeOffer, discount_percentage: parseInt(e.target.value) })}
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-on-surface-variant mb-2">Coupon Promo Code</label>
                  <input
                    type="text"
                    value={activeOffer.coupon_code}
                    onChange={(e) => setActiveOffer({ ...activeOffer, coupon_code: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-2">Campaign Ends Date (ISO format)</label>
                <input
                  type="text"
                  value={activeOffer.ends_at}
                  onChange={(e) => setActiveOffer({ ...activeOffer, ends_at: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  checked={activeOffer.is_active}
                  onChange={(e) => setActiveOffer({ ...activeOffer, is_active: e.target.checked })}
                  className="w-4 h-4 text-primary focus:ring-primary rounded border-outline-variant"
                />
                <span className="text-xs text-on-surface-variant font-semibold">Enable offer visibility on homepage</span>
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:opacity-95 text-white font-semibold py-3 rounded-xl transition-colors text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Save Offer Campaign
              </button>
            </form>
          ) : (
            <div className="text-center py-10 text-on-surface-variant">No campaigns found.</div>
          )}
        </div>
      )}

      {activeTab === "progress" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Selector */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
            <h3 className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-2">Customer Projects</h3>
            <div className="space-y-2">
              {customerProjects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedProject?.id === p.id
                      ? "bg-surface-container-high border-primary text-on-surface"
                      : "bg-surface-container-low border-outline-variant/20 text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <div className="font-bold text-sm">{p.title}</div>
                  <div className="text-[10px] text-on-surface-variant/80 mt-1">Progress: {p.progress_percent}%</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form Editor */}
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-6">Modify Progress Tracking Metrics</h3>
            {selectedProject ? (
              <form onSubmit={handleSaveProjectProgress} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-on-surface-variant mb-2">Progress Percent (0-100)</label>
                    <input
                      type="number"
                      value={selectedProject.progress_percent}
                      onChange={(e) => setSelectedProject({ ...selectedProject, progress_percent: parseInt(e.target.value) })}
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                      min={0}
                      max={100}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-on-surface-variant mb-2">Status Description</label>
                    <input
                      type="text"
                      value={selectedProject.status}
                      onChange={(e) => setSelectedProject({ ...selectedProject, status: e.target.value })}
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-on-surface-variant mb-2">Cloud Hosting Status</label>
                  <select
                    value={selectedProject.hosting_status}
                    onChange={(e) => setSelectedProject({ ...selectedProject, hosting_status: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="Active">Active</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Pending Setup">Pending Setup</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary hover:opacity-95 text-white font-semibold py-3 rounded-xl transition-colors text-xs cursor-pointer"
                >
                  Update Customer Trackers
                </button>
              </form>
            ) : (
              <div className="text-center py-10 text-on-surface-variant">Select a project from the left to configure.</div>
            )}
          </div>
        </div>
      )}

      {activeTab === "contacts" && (
        <div className="space-y-4">
          <h3 className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-2">Client Inquiries</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts.map((c) => (
              <div key={c.id} className="bg-white p-6 rounded-xl border border-outline-variant/30 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-on-surface text-base">{c.name}</h4>
                    <p className="text-xs text-primary font-mono">{c.email}</p>
                  </div>
                  <time className="text-[10px] text-on-surface-variant">{new Date(c.created_at).toLocaleDateString()}</time>
                </div>
                <p className="text-on-surface-variant text-xs leading-relaxed bg-surface-container-low p-3 rounded-lg border border-outline-variant/20 whitespace-pre-line">
                  {c.message}
                </p>
              </div>
            ))}
            {contacts.length === 0 && (
              <div className="col-span-2 text-center py-10 text-on-surface-variant bg-white border border-outline-variant/20 rounded-2xl">
                No contact submissions found.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "chat" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px] items-stretch">
          {/* Tickets Sidebar */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-outline-variant/30 p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4 overflow-y-auto flex-grow mb-6">
              <h3 className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-2">Support Tickets Queue</h3>
              <div className="space-y-2">
                {tickets.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTicketId(t.id);
                      fetchTicketMessages(t.id);
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                      selectedTicketId === t.id
                        ? "bg-surface-container-high border-primary text-on-surface"
                        : "bg-surface-container-low border-outline-variant/20 text-on-surface-variant hover:border-primary/50 hover:text-on-surface"
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-sm truncate max-w-[150px]">{t.subject}</h4>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                        t.status === "Open"
                          ? "bg-rose-500/10 text-rose-600"
                          : t.status === "Resolved"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {t.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-outline-variant/30 flex flex-col justify-between overflow-hidden shadow-sm">
            {selectedTicketId !== null ? (
              <>
                {/* Messages log */}
                <div className="p-6 overflow-y-auto flex-grow space-y-4 bg-surface-container-low/20">
                  {messages.length > 0 ? (
                    messages.map((msg) => {
                      const isAgent = msg.sender_id === 1; // Sender 1 is admin, 2 is client
                      return (
                        <div key={msg.id} className={`flex ${isAgent ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed border ${
                              isAgent
                                ? "bg-primary border-primary text-white rounded-tr-none"
                                : "bg-surface-container border-outline-variant/30 text-on-surface rounded-tl-none"
                            }`}
                          >
                            <div className="font-semibold mb-1 text-[10px] opacity-75">
                              {isAgent ? "You (Agent)" : "Client"}
                            </div>
                            <div>{msg.message}</div>
                            <div className="text-[9px] opacity-60 text-right mt-1.5 font-mono">
                              {new Date(msg.created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-on-surface-variant py-12 text-xs">No messages yet in this ticket.</div>
                  )}
                </div>

                {/* Reply input */}
                <form onSubmit={handleSendReply} className="p-4 border-t border-outline-variant/30 bg-surface-container-low flex gap-2">
                  <input
                    type="text"
                    placeholder="Type console reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-grow bg-white border border-outline-variant rounded-xl px-4 py-3 text-xs text-on-surface focus:outline-none focus:border-primary"
                    required
                  />
                  <button
                    type="submit"
                    className="p-3 bg-primary hover:opacity-95 text-white rounded-xl transition-all cursor-pointer shrink-0 flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-on-surface-variant text-sm">
                Select a ticket on the left queue to respond.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
