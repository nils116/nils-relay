import { NextRequest, NextResponse } from "next/server";
import { store, LocationData } from "@/lib/store";

// API key validation
function validateAuth(request: NextRequest): boolean {
  const API_KEY = process.env.API_KEY;
  // Allow if no API_KEY is set (development mode)
  if (!API_KEY) return true;
  
  const authHeader = request.headers.get("x-api-key");
  return authHeader === API_KEY;
}

// Parse location from various formats
function parseLocation(body: any): { lat?: number; lon?: number; accuracy?: number; placeName?: string } | null {
  // If lat/lon are provided directly
  if (typeof body.lat === "number" && typeof body.lon === "number") {
    return {
      lat: body.lat,
      lon: body.lon,
      accuracy: body.accuracy,
      placeName: body.placeName,
    };
  }

  // If location is sent as a string (Shortcuts "Current Location")
  if (typeof body.location === "string") {
    // Try to parse "Lat: 50.1109, Lon: 8.6821" format
    const latMatch = body.location.match(/Lat:\s*(-?\d+\.?\d*)/i);
    const lonMatch = body.location.match(/Lon:\s*(-?\d+\.?\d*)/i);
    
    if (latMatch && lonMatch) {
      return {
        lat: parseFloat(latMatch[1]),
        lon: parseFloat(lonMatch[1]),
        accuracy: body.accuracy,
        placeName: body.placeName,
      };
    }

    // Try to parse comma-separated "50.1109, 8.6821" format
    const coords = body.location.match(/(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/);
    if (coords) {
      return {
        lat: parseFloat(coords[1]),
        lon: parseFloat(coords[2]),
        accuracy: body.accuracy,
        placeName: body.placeName,
      };
    }
    
    // If it looks like a street address (contains letters, not just numbers/commas)
    // Store it as placeName without coordinates
    if (/[a-zA-Z]/.test(body.location)) {
      return {
        placeName: body.location,
        accuracy: body.accuracy,
      };
    }
  }

  // If address is provided in placeName field
  if (typeof body.placeName === "string" && body.placeName.length > 0) {
    return {
      lat: body.lat,
      lon: body.lon,
      accuracy: body.accuracy,
      placeName: body.placeName,
    };
  }

  return null;
}

// GET /api/location - Get latest location
export async function GET(request: NextRequest) {
  // Check auth
  if (!validateAuth(request)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (!store.location) {
    return NextResponse.json(
      { error: "No location data available" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    location: store.location,
    lastUpdated: store.lastUpdated,
  });
}

// POST /api/location - Update location
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
    
    // Parse location from various formats
    const parsed = parseLocation(body);
    
    if (!parsed) {
      return NextResponse.json(
        { error: "Could not parse location. Send {location: 'Current Location'} or {lat: 50, lon: 8}" },
        { status: 400 }
      );
    }

    const locationData: LocationData = {
      lat: parsed.lat || 0,
      lon: parsed.lon || 0,
      accuracy: parsed.accuracy,
      timestamp: body.timestamp || new Date().toISOString(),
      source: body.source || "ios-shortcut",
      battery: body.battery,
      placeName: parsed.placeName || "Unknown location",
    };

    // Update store
    store.location = locationData;
    store.lastUpdated = new Date().toISOString();

    console.log("[Location Update]", locationData);

    return NextResponse.json({
      success: true,
      received: locationData,
    });
  } catch (error) {
    console.error("[Location Error]", error);
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
