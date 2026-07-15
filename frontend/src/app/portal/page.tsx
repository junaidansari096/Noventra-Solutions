"use client";

import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";

interface CustomerProject {
  id: number;
  title: string;
  description: string;
  progress_percent: number;
  status: string;
  milestones: Record<string, boolean>;
  domain: string;
  hosting_status: string;
  renewal_date: string;
}

interface SupportTicket {
  id: number;
  subject: string;
  status: string;
  created_at: string;
}

interface Message {
  id: number;
  ticket_id: number;
  sender_id: number;
  message: string;
  created_at: string;
}

export default function PortalPage() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState("client@noventra.com");
  const [password, setPassword] = useState("client123");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"projects" | "support">("projects");

  const [projects, setProjects] = useState<CustomerProject[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newTicketSubject, setNewTicketSubject] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [userRole, setUserRole] = useState("customer");

  useEffect(() => {
    // Check if user has an active session cookie on page load
    fetch(`${API_URL}/api/auth/me`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("No active session");
        return res.json();
      })
      .then((data) => {
        setUserRole(data.role);
        setToken("session_active");
        fetchDashboardData();
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
        setToken("session_active");
        fetchDashboardData();
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
        setProjects([]);
        setTickets([]);
        setSelectedTicketId(null);
        setMessages([]);
      })
      .catch((err) => console.log(err));
  };

  const fetchDashboardData = () => {
    fetch(`${API_URL}/api/auth/me`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUserRole(data.role))
      .catch((err) => console.log(err));

    fetch(`${API_URL}/api/customer-projects/me`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setProjects(data))
      .catch((err) => console.log(err));

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

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject.trim() || !token) return;

    fetch(`${API_URL}/api/tickets/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject: newTicketSubject }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setTickets([...tickets, data]);
        setSelectedTicketId(data.id);
        setMessages([]);
        setNewTicketSubject("");
      })
      .catch((err) => console.log(err));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !token || selectedTicketId === null) return;

    fetch(`${API_URL}/api/tickets/${selectedTicketId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: chatMessage }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages([...messages, data]);
        setChatMessage("");
      })
      .catch((err) => console.log(err));
  };

  if (!token) {
    return (
      <div className="max-w-md mx-auto my-24 p-8 rounded-2xl bg-white border border-outline-variant/40 shadow-xl">
        <div className="text-center mb-8">
          <h2 className="font-headline-md text-headline-md text-on-surface">Client Portal Login</h2>
          <p className="text-on-surface-variant text-xs mt-2">Access domain status, progress tracking, and chat support.</p>
        </div>
        {error && (
          <div className="bg-error-container border border-error/20 text-error text-xs p-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/55 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-2">Password</label>
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
        <div className="text-center mt-6 text-xs text-on-surface-variant/80 leading-relaxed bg-surface-container-low p-3 rounded-xl border border-outline-variant/30">
          Demo Client Account:<br />
          Email: <span className="text-primary font-bold font-mono">client@noventra.com</span> / PW: <span className="text-primary font-bold font-mono">client123</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto px-gutter py-12 min-h-screen">
      {/* Welcome Header */}
      <section className="mb-xl flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Client Dashboard</h1>
          <p className="text-body-md text-on-surface-variant">Access your dynamic infrastructure metrics and support lines.</p>
        </div>
        <div className="flex gap-sm">
          <button
            onClick={() => fetchDashboardData(token)}
            className="p-3 bg-surface-container-low border border-outline-variant/30 text-primary rounded-xl hover:bg-surface-container-high transition-colors"
            title="Refresh Data"
          >
            <span className="material-symbols-outlined">sync</span>
          </button>
          <button
            onClick={handleLogout}
            className="bg-surface-container-low border border-outline-variant/30 text-on-surface-variant font-semibold text-xs px-5 py-3 rounded-xl hover:text-primary transition-colors"
          >
            Log Out
          </button>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-outline-variant/30 pb-4">
        {[
          { id: "projects", name: "Website Progress & Milestones", icon: "activity_zone" },
          { id: "support", name: "Help Chat & Support", icon: "forum" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 pb-2 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
              activeTab === tab.id
                ? "border-primary text-primary font-bold"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === "projects" ? (
        <div className="space-y-8">
          {projects.length > 0 ? (
            projects.map((proj) => (
              <div key={proj.id} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Progress Details */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-outline-variant/30 shadow-sm space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-headline-md text-headline-md text-on-surface">{proj.title}</h3>
                    <span className="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                      Status: {proj.status}
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{proj.description}</p>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-on-surface-variant">
                      <span>Development Progress</span>
                      <span className="text-primary">{proj.progress_percent}%</span>
                    </div>
                    <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden border border-outline-variant/20">
                      <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${proj.progress_percent}%` }} />
                    </div>
                  </div>

                  {/* Milestones list */}
                  <div className="space-y-3 pt-4 border-t border-outline-variant/25">
                    <h4 className="text-on-surface text-sm font-semibold">Milestones Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {proj.milestones &&
                        Object.entries(proj.milestones).map(([name, completed], idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-surface-container-low border border-outline-variant/20 p-4 rounded-xl">
                            <span
                              className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border text-[10px] font-bold ${
                                completed
                                  ? "bg-primary border-primary text-white"
                                  : "border-outline-variant text-transparent"
                              }`}
                            >
                              ✓
                            </span>
                            <span className={`text-xs ${completed ? "text-on-surface-variant/60 line-through" : "text-on-surface"}`}>
                              {name}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Domain & Hosting Card */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-6">
                    <h4 className="font-headline-md text-headline-md text-on-surface">Hosting &amp; Domains</h4>

                    <div className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">language</span>
                      <div>
                        <div className="text-xs text-on-surface-variant">Domain Name</div>
                        <a
                          href={proj.domain}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-on-surface hover:text-primary transition-colors"
                        >
                          {proj.domain || "No domain set"}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">security</span>
                      <div>
                        <div className="text-xs text-on-surface-variant">Cloud Hosting Status</div>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded ${
                            proj.hosting_status === "Active"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-amber-500/10 text-amber-600"
                          }`}
                        >
                          {proj.hosting_status || "Pending Setup"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">calendar_today</span>
                      <div>
                        <div className="text-xs text-on-surface-variant">Contract Renewal Date</div>
                        <div className="text-sm font-semibold text-on-surface">{proj.renewal_date || "N/A"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-on-surface-variant bg-white border border-outline-variant/20 rounded-2xl">
              No active website projects are currently assigned to your account.
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px] items-stretch">
          {/* Tickets Sidebar */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-outline-variant/30 p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4 overflow-y-auto flex-grow mb-6">
              <h3 className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-2">Your Support Tickets</h3>

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
                      <p className="text-[10px] text-on-surface-variant mt-1">
                        {new Date(t.created_at).toLocaleDateString()}
                      </p>
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

            {/* Create ticket form */}
            <form onSubmit={handleCreateTicket} className="border-t border-outline-variant/30 pt-4 space-y-3">
              <input
                type="text"
                placeholder="New ticket subject..."
                value={newTicketSubject}
                onChange={(e) => setNewTicketSubject(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                required
              />
              <button
                type="submit"
                className="w-full bg-primary hover:opacity-95 text-white font-semibold py-2.5 rounded-xl transition-colors text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                Raise Support Ticket
              </button>
            </form>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-outline-variant/30 flex flex-col justify-between overflow-hidden shadow-sm">
            {selectedTicketId !== null ? (
              <>
                {/* Messages log */}
                <div className="p-6 overflow-y-auto flex-grow space-y-4 bg-surface-container-low/20">
                  {messages.length > 0 ? (
                    messages.map((msg) => {
                      const isAdmin = userRole === "admin" ? msg.sender_id !== 2 : msg.sender_id === 1;
                      return (
                        <div key={msg.id} className={`flex ${isAdmin ? "justify-start" : "justify-end"}`}>
                          <div
                            className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed border ${
                              isAdmin
                                ? "bg-surface-container border-outline-variant/30 text-on-surface rounded-tl-none"
                                : "bg-primary border-primary text-white rounded-tr-none"
                            }`}
                          >
                            <div className="font-semibold mb-1 text-[10px] opacity-75">
                              {isAdmin ? "Noventra Support" : "You"}
                            </div>
                            <div>{msg.message}</div>
                            <div className="text-[9px] opacity-60 text-right mt-1.5">
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
                    <div className="text-center text-on-surface-variant py-12 text-xs">
                      No messages yet. Send a message to start support chat.
                    </div>
                  )}
                </div>

                {/* Send input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-outline-variant/30 bg-surface-container-low flex gap-2">
                  <input
                    type="text"
                    placeholder="Type message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
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
                Select a ticket on the left to start live chat support.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
