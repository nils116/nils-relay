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

  // Real domains from workspace/domains/ and ntd-consulting/
  const domains = [
    {
      name: "1️⃣ Worlds Finest (WF)",
      description: "Luxury real estate and strategic development. Strategic planning, investor communication, market research, operational systems, AI integration, event planning.",
      files: ["Domain overview", "Projects", "Contacts", "wf-salesportal repo"],
      status: "active",
    },
    {
      name: "2️⃣ NTD Consulting",
      description: "Innovation lab and product builds. App development, AI systems, technical architecture, revenue model design, sprint planning.",
      files: ["README.md", "DESIGN.md", "TECH-STACK.md", "ACTIVE-PROJECTS.md", "PRODUCT-BUILD-LOG.md"],
      status: "active",
      projects: ["BYD Champion game", "nils-relay endpoint", "Mission Control Center"],
    },
    {
      name: "3️⃣ Health & Performance",
      description: "Long-term optimization. Longevity, strength, running, golf performance, sustainable lifestyle.",
      files: ["Training logs", "Golf Diaries app (golfdiaries-ccode)", "Apple Health data", "Whoop recovery"],
      status: "active",
      projects: ["Golf Diaries v0.4 - Social features"],
    },
    {
      name: "4️⃣ Investing, Money & Crypto",
      description: "Capital allocation and risk management. Capital preservation, risk-adjusted return, structured allocation, core-satellite model.",
      files: ["Portfolio", "Research", "Strategy", "Revolut", "Amex Platinum", "Miles & More"],
      status: "active",
    },
    {
      name: "5️⃣ Weckmarkt IV & Abroad",
      description: "Shared life operations with girlfriend. Home management, travel planning, shared projects, annual planning.",
      files: ["Travel plans", "Home management", "Shared projects"],
      status: "active",
    },
  ];

  return NextResponse.json(domains);
}
