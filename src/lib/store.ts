// Simple in-memory store for MVP
// Note: Resets on server restart/cold start
// Upgrade path: Use Vercel KV or Upstash Redis for persistence

export interface LocationData {
  lat?: number;
  lon?: number;
  accuracy?: number;
  timestamp: string;
  source: string;
  battery?: number;
  placeName?: string;
}

export interface PingData {
  type: string;
  data: Record<string, any>;
  timestamp: string;
}

// In-memory storage
export const store = {
  location: null as LocationData | null,
  pings: [] as PingData[],
  lastUpdated: null as string | null,
};

// For debugging - list all stored data
export function getStoreSnapshot() {
  return {
    location: store.location,
    pingCount: store.pings.length,
    lastUpdated: store.lastUpdated,
  };
}
