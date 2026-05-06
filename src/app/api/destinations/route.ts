import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Destinations are hardcoded in frontend for optimal performance",
    count: 90,
    districts: [
      "Shimla", "Kullu", "Kangra", "Chamba", "Mandi", "Solan", 
      "Sirmaur", "Bilaspur", "Hamirpur", "Una", "Kinnaur", "Lahaul & Spiti"
    ],
  });
}
