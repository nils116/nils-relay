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

  const domains = [
    {
      name: "NTD Consulting",
      description: "Innovation lab, product prototyping, app development, AI systems",
      files: ["README.md", "DESIGN.md", "TECH-STACK.md", "ACTIVE-PROJECTS.md", "PRODUCT-BUILD-LOG.md"],
    },
    {
      name: "Worlds Finest (WF)",
      description: "Luxury real estate, strategic development, investor relations",
      files: ["Domain overview", "Projects", "Contacts"],
    },
    {
      name: "Health & Performance",
      description: "Longevity, strength, running, golf performance tracking",
      files: ["Training logs", "Golf Diaries app", "Health metrics"],
    },
    {
      name: "Investing & Crypto",
      description: "Capital allocation, risk management, crypto exposure",
      files: ["Portfolio", "Research", "Strategy"],
    },
  ];

  return NextResponse.json(domains);
}
