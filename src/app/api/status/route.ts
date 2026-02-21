import { NextResponse } from "next/server";
import { getStoreSnapshot } from "@/lib/store";

// GET /api/status - Health check and store status
export async function GET() {
  const snapshot = getStoreSnapshot();

  return NextResponse.json({
    status: "ok",
    service: "nils-relay",
    timestamp: new Date().toISOString(),
    store: snapshot,
    endpoints: {
      location: {
        get: "/api/location",
        post: "/api/location",
        description: "Get or update location data (requires x-api-key header)",
      },
      ping: {
        get: "/api/ping?type=<type>&limit=<n>",
        post: "/api/ping",
        description: "Get or send ping events (requires x-api-key header)",
      },
    },
    security: "API key required via x-api-key header",
  });
}
