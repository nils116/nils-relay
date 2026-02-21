export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-2xl font-bold mb-2">Nils Relay</h1>
        <p className="text-gray-600 mb-6">Communication endpoint for iPhone → Kimi Claw</p>

        <div className="space-y-6">
          <section className="bg-gray-50 rounded-lg p-4">
            <h2 className="font-semibold mb-2">📍 Location Tracking</h2>
            <div className="text-sm space-y-1 text-gray-700">
              <p><strong>POST /api/location</strong> — Update location</p>
              <pre className="bg-gray-800 text-gray-100 p-3 rounded mt-2 overflow-x-auto">
{`{
  "lat": 50.1109,
  "lon": 8.6821,
  "accuracy": 10,
  "battery": 85,
  "placeName": "Frankfurt"
}`}
              </pre>
              <p className="mt-2"><strong>GET /api/location</strong> — Get latest location</p>
            </div>
          </section>

          <section className="bg-gray-50 rounded-lg p-4">
            <h2 className="font-semibold mb-2">📡 Event Pings</h2>
            <div className="text-sm space-y-1 text-gray-700">
              <p><strong>POST /api/ping</strong> — Send events</p>
              <pre className="bg-gray-800 text-gray-100 p-3 rounded mt-2 overflow-x-auto">
{`{
  "type": "arrived",
  "data": { "place": "Office", "duration": 30 },
  "timestamp": "2026-02-22T10:00:00Z"
}`}
              </pre>
              <p className="mt-2"><strong>GET /api/ping?type=arrived&limit=5</strong> — Query events</p>
            </div>
          </section>

          <section className="bg-gray-50 rounded-lg p-4">
            <h2 className="font-semibold mb-2">⚡ Quick Links</h2>
            <div className="flex gap-2">
              <a
                href="/api/status"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
              >
                Status
              </a>
              <a
                href="/api/location"
                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
              >
                Location
              </a>
              <a
                href="/api/ping"
                className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600"
              >
                Pings
              </a>
            </div>
          </section>

          <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"㻢>
            <h2 className="font-semibold mb-2 text-yellow-800">⚠️ Note</h2>
            <p className="text-sm text-yellow-700">
              Data is stored in-memory and resets on server restart. 
              For production use, upgrade to Vercel KV or Upstash Redis.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
