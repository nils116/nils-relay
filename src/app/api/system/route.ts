import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.API_KEY;

function validateAuth(request: NextRequest): boolean {
  if (!API_KEY) return true;
  const authHeader = request.headers.get("x-api-key") || request.headers.get("authorization")?.replace("Bearer ", "");
  return authHeader === API_KEY;
}

export async function GET(request: NextRequest) {
  if (!validateAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const info = {
    version: "2026.2.21-2",
    model: "kimi-coding/k2p5",
    workspace: "/root/.openclaw/workspace",
    uptime: "Since 2026-02-22",
  };

  return NextResponse.json(info);
}
