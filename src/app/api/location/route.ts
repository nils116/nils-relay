import { NextRequest, NextResponse } from "next/server";
import { store, LocationData } from "@/lib/store";

// GET /api/location - Get latest location
export async function GET() {
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
  try {
    const body = await request.json();
    
    // Validate required fields
    if (typeof body.lat !== "number" || typeof body.lon !== "number") {
      return NextResponse.json(
        { error: "Missing required fields: lat, lon" },
        { status: 400 }
      );
    }

    const locationData: LocationData = {
      lat: body.lat,
      lon: body.lon,
      accuracy: body.accuracy,
      timestamp: body.timestamp || new Date().toISOString(),
      source: body.source || "ios-shortcut",
      battery: body.battery,
      placeName: body.placeName,
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
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }
}
