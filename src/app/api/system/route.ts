import { NextRequest, NextResponse } from "next/server";

function validateAuth(request: NextRequest): boolean {
  return true; // Frontend password protects the UI
}

export async function GET(request: NextRequest) {
  if (!validateAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Real system info from openclaw.json
  const info = {
    version: "2026.2.21-2",
    model: "kimi-coding/k2p5 (Kimi K2.5)",
    workspace: "/root/.openclaw/workspace",
    host: "iv-yefxq4joqo2kyw5djrpi (Linux)",
    node: "v22.22.0",
    uptime: "Since 2026-02-15",
    
    // Memory features
    memory: {
      flushEnabled: true,
      flushThreshold: "40k tokens",
      contextPruning: "6h TTL",
      hybridSearch: "Vector 70% + BM25 30%",
      sessionIndexing: true,
      sources: ["memory", "sessions"],
    },

    // Models available
    models: [
      { name: "Kimi K2.5", id: "kimi-coding/k2p5", context: "262k", primary: true },
      { name: "Sonnet 4.6", id: "anthropic/claude-sonnet-4-20250514", context: "200k", primary: false },
      { name: "Opus 4.6", id: "anthropic/claude-opus-4-20250514", context: "200k", primary: false },
    ],

    // Channels
    channels: {
      telegram: "enabled (5341127039)",
    },

    // Plugins
    plugins: ["memory-core", "kimi-claw", "kimi-search", "telegram"],
  };

  return NextResponse.json(info);
}
