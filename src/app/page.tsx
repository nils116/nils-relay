"use client";

import { useState, useEffect } from "react";

interface Task {
  id: string;
  title: string;
  status: "active" | "completed" | "blocked" | "backlog";
  domain: string;
  created: string;
}

interface Domain {
  name: string;
  description: string;
  files: string[];
}

interface SystemInfo {
  version: string;
  model: string;
  workspace: string;
  uptime: string;
}

export default function MissionControl() {
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("tasks");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    // Simple password auth - in production use proper session management
    if (password === "clawbot2026") {
      setAuth(true);
      await fetchData();
    } else {
      alert("Invalid access code");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch from our API endpoints
      const [tasksRes, domainsRes, systemRes] = await Promise.all([
        fetch("/api/tasks"),
        fetch("/api/domains"),
        fetch("/api/system"),
      ]);

      if (tasksRes.ok) setTasks(await tasksRes.json());
      if (domainsRes.ok) setDomains(await domainsRes.json());
      if (systemRes.ok) setSystemInfo(await systemRes.json());
    } catch (e) {
      console.error("Failed to fetch data", e);
    }
    setLoading(false);
  };

  if (!auth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-8 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <ClawBotLogo />
          </div>
          <h1 className="text-2xl font-bold text-center text-cyan-400 mb-2">
            Mission Control Center
          </h1>
          <p className="text-slate-400 text-center mb-8">
            Authorized personnel only
          </p>

          <div className="space-y-4">
            <input
              type="password"
              placeholder="Enter access code"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && login()}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
            <button
              onClick={login}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors"
            >
              Access System
            </button>
          </div>

          <p className="text-xs text-slate-600 text-center mt-6">
            Kimi Claw v2026.2.21 • Secure Channel
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Header */}
      <header className="bg-slate-900 border-b border-cyan-500/30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ClawBotLogo small />
              <div>
                <h1 className="text-xl font-bold text-cyan-400">Mission Control Center</h1>
                <p className="text-xs text-slate-400">Kimi Claw Operations Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-400">Online</span>
              </div>
              <button
                onClick={() => setAuth(false)}
                className="text-sm text-slate-400 hover:text-white"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            {[
              { id: "tasks", label: "📋 Tasks", count: tasks.filter((t) => t.status === "active").length },
              { id: "domains", label: "🗂️ Domains" },
              { id: "system", label: "⚙️ System" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-slate-800 text-cyan-400 border-t border-x border-cyan-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {loading && (
          <div className="text-center py-12 text-slate-500">Loading...</div>
        )}

        {activeTab === "tasks" && !loading && (
          <TasksBoard tasks={tasks} />
        )}

        {activeTab === "domains" && !loading && (
          <DomainsView domains={domains} />
        )}

        {activeTab === "system" && !loading && systemInfo && (
          <SystemView info={systemInfo} />
        )}
      </main>
    </div>
  );
}

// ClawBot Logo SVG
function ClawBotLogo({ small = false }: { small?: boolean }) {
  const size = small ? "w-10 h-10" : "w-24 h-24";
  return (
    <svg viewBox="0 0 100 100" className={size}>
      {/* Robot body */}
      <rect x="30" y="40" width="40" height="35" rx="8" fill="#0891b2" />
      {/* Screen/face */}
      <rect x="35" y="48" width="30" height="20" rx="4" fill="#06b6d4" />
      {/* Eyes */}
      <circle cx="42" cy="58" r="4" fill="#22d3ee" className="animate-pulse" />
      <circle cx="58" cy="58" r="4" fill="#22d3ee" className="animate-pulse" />
      {/* Antenna */}
      <line x1="50" y1="40" x2="50" y2="25" stroke="#0891b2" strokeWidth="3" />
      <circle cx="50" cy="22" r="4" fill="#22d3ee" />
      {/* Claw arms */}
      <path d="M30 55 L15 45 M30 60 L12 60 M30 65 L15 75" stroke="#0891b2" strokeWidth="3" fill="none" />
      <path d="M70 55 L85 45 M70 60 L88 60 M70 65 L85 75" stroke="#0891b2" strokeWidth="3" fill="none" />
      {/* Base */}
      <rect x="25" y="75" width="50" height="8" rx="4" fill="#0e7490" />
    </svg>
  );
}

// Tasks Board Component
function TasksBoard({ tasks }: { tasks: Task[] }) {
  const columns = [
    { id: "active", title: "🟢 Active", color: "border-green-500/30 bg-green-500/5" },
    { id: "backlog", title: "📋 Backlog", color: "border-slate-500/30 bg-slate-500/5" },
    { id: "blocked", title: "🔴 Blocked", color: "border-red-500/30 bg-red-500/5" },
    { id: "completed", title: "✅ Completed", color: "border-cyan-500/30 bg-cyan-500/5" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((col) => (
        <div key={col.id} className={`rounded-xl border ${col.color} p-4`}>
          <h3 className="font-semibold mb-4 flex items-center justify-between">
            {col.title}
            <span className="text-xs bg-slate-800 px-2 py-1 rounded-full">
              {tasks.filter((t) => t.status === col.id).length}
            </span>
          </h3>

          <div className="space-y-3">
            {tasks
              .filter((t) => t.status === col.id)
              .map((task) => (
                <div
                  key={task.id}
                  className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 hover:border-cyan-500/30 transition-colors"
                >
                  <p className="text-sm font-medium">{task.title}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                    <span className="px-2 py-0.5 bg-slate-700 rounded">{task.domain}</span>
                    <span>{new Date(task.created).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Domains View
function DomainsView({ domains }: { domains: Domain[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {domains.map((domain) => (
        <div
          key={domain.name}
          className="bg-slate-900 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/30 transition-colors"
        >
          <h3 className="text-lg font-semibold text-cyan-400 mb-2">{domain.name}</h3>
          <p className="text-slate-400 text-sm mb-4">{domain.description}</p>

          <div className="space-y-2">
            {domain.files.map((file) => (
              <div
                key={file}
                className="flex items-center gap-2 text-sm text-slate-500"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {file}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// System View
function SystemView({ info }: { info: SystemInfo }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">🤖 Agent Info</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-400">Version</span>
            <span>{info.version}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Model</span>
            <span>{info.model}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Workspace</span>
            <span className="text-xs">{info.workspace}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Uptime</span>
            <span>{info.uptime}</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">🔒 Security</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span>API Key Authentication</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span>Password Protected Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span>Memory Flush Enabled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span>Hybrid Memory Search</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 md:col-span-2">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">📊 Memory Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-cyan-400">40k</div>
            <div className="text-xs text-slate-400">Flush Threshold</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-cyan-400">6h</div>
            <div className="text-xs text-slate-400">Context TTL</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-cyan-400">ON</div>
            <div className="text-xs text-slate-400">Session Indexing</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-cyan-400">Hybrid</div>
            <div className="text-xs text-slate-400">Search Mode</div>
          </div>
        </div>
      </div>
    </div>
  );
}
