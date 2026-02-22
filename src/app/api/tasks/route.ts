import { NextRequest, NextResponse } from "next/server";

// API key validation
const API_KEY = process.env.API_KEY;

function validateAuth(request: NextRequest): boolean {
  if (!API_KEY) return true;
  const authHeader = request.headers.get("x-api-key") || request.headers.get("authorization")?.replace("Bearer ", "");
  return authHeader === API_KEY;
}

// GET /api/tasks - List all tasks
export async function GET(request: NextRequest) {
  if (!validateAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Mock tasks - in production, read from memory/active-tasks.md
  const tasks = [
    {
      id: "1",
      title: "Build Mission Control Center",
      status: "active",
      domain: "NTD Consulting",
      created: "2026-02-22",
    },
    {
      id: "2",
      title: "Secure nils-relay endpoints",
      status: "completed",
      domain: "NTD Consulting",
      created: "2026-02-22",
    },
    {
      id: "3",
      title: "Set up iOS location shortcut",
      status: "active",
      domain: "NTD Consulting",
      created: "2026-02-22",
    },
    {
      id: "4",
      title: "Implement memory flush",
      status: "completed",
      domain: "System",
      created: "2026-02-22",
    },
    {
      id: "5",
      title: "Enable hybrid memory search",
      status: "completed",
      domain: "System",
      created: "2026-02-22",
    },
  ];

  return NextResponse.json(tasks);
}
