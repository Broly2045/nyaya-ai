import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json();

    if (!["pro", "chamber"].includes(plan)) {
      return NextResponse.json({ message: "Invalid plan" }, { status: 400 });
    }

    await connectToDatabase();

    // Simulate network delay for fake payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const planLimits = {
      pro: Infinity,
      chamber: Infinity,
    };

    await User.findByIdAndUpdate(session.user.id, {
      subscription: plan,
      documentsLimit: planLimits[plan as keyof typeof planLimits],
      documentsUsed: 0,
    });

    return NextResponse.json({ message: "Subscription upgraded successfully" }, { status: 200 });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
