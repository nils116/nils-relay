import { NextRequest, NextResponse } from "next/server";
import { store, PingData } from "@/lib/store";

// API key validation
const API_KEY = process.env.API_KEY;

function validateAuth(request: NextRequest): boolean {
  // Allow if no API_KEY is set (development mode)
  if (!API_KEY) return true;
  
  const authHeader = request.headers.get("x-api-key");
  return authHeader === API_KEY;
}

// GET /api/ping - Get recent pings
export async function GET(request: NextRequest) {
  // Check auth
  if (!validateAuth(request)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const limit = parseInt(searchParams.get("limit") || "10");

  let pings = store.pings;

  // Filter by type if specified
  if (type) {
    pings = pings.filter((p) => p.type === type);
  }

  // Get most recent
  pings = pings.slice(-limit);

  return NextResponse.json({
    pings,
    count: pings.length,
    lastUpdated: store.lastUpdated,
  });
}

// POST /api/ping - Send a ping/event
export async function POST(request: NextRequest) {
  // Check auth
  if (!validateAuth(request)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    if (!body.type) {
      return NextResponse.json(
        { error: "Missing required field: type" },
        { status: 400 }
      );
    }

    const pingData: PingData = {
      type: body.type,
      data: body.data || {},
      timestamp: body.timestamp || new Date().toISOString(),
    };

    // Add to store
    store.pings.push(pingData);
    store.lastUpdated = new Date().toISOString();

    // Keep only last 100 pings to prevent memory bloat
    if (store.pings.length > 100) {
      store.pings = store.pings.slice(-100);
    }

    console.log("[Ping Received]", pingData);

    return NextResponse.json({
      success: true,
      received: pingData,
    });
  } catch (error) {
    console.error("[Ping Error]", error);
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }
}
