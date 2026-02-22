import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.API_KEY;

function validateAuth(request: NextRequest): boolean {
  if (!API_KEY) return true;
  const authHeader = request.headers.get("x-api-key") || request.headers.get("authorization")?.replace("Bearer ", "");
  return authHeader === API_KEY;
}

// GET /api/tasks - List all tasks from memory/active-tasks.md
export async function GET(request: NextRequest) {
  if (!validateAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Real tasks from active-tasks.md
  const tasks = [
    // Active
    {
      id: "byd-champion",
      title: "BYD Champion Game - iOS-native redesign",
      status: "active",
      domain: "NTD Consulting",
      created: "2026-02-21",
    },
    {
      id: "golf-diaries",
      title: "Golf Diaries - Social feed v0.4 features",
      status: "blocked",
      domain: "Health & Performance",
      created: "2026-02-22",
    },
    {
      id: "wf-salesportal",
      title: "WF Sales Portal - Review & enhancements",
      status: "backlog",
      domain: "Worlds Finest",
      created: "2026-02-22",
    },
    // Recently Completed
    {
      id: "memory-flush",
      title: "Memory flush enabled (40k tokens)",
      status: "completed",
      domain: "System",
      created: "2026-02-22",
    },
    {
      id: "context-pruning",
      title: "Context pruning enabled (6h TTL)",
      status: "completed",
      domain: "System",
      created: "2026-02-22",
    },
    {
      id: "hybrid-search",
      title: "Hybrid memory search enabled",
      status: "completed",
      domain: "System",
      created: "2026-02-22",
    },
    {
      id: "session-indexing",
      title: "Session transcript indexing enabled",
      status: "completed",
      domain: "System",
      created: "2026-02-22",
    },
    {
      id: "nils-relay",
      title: "nils-relay endpoint with API key security",
      status: "completed",
      domain: "NTD Consulting",
      created: "2026-02-22",
    },
    {
      id: "mission-control",
      title: "Mission Control Center dashboard",
      status: "completed",
      domain: "NTD Consulting",
      created: "2026-02-22",
    },
    {
      id: "ntd-domain",
      title: "NTD Consulting domain structure (DESIGN, TECH-STACK, etc.)",
      status: "completed",
      domain: "NTD Consulting",
      created: "2026-02-22",
    },
  ];

  return NextResponse.json(tasks);
}
