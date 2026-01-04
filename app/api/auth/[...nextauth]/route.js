// Auth route - temporarily disabled
// Uncomment when ready to enable authentication
//
// import { handlers } from "@/libs/auth"
// export const { GET, POST } = handlers

import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        message: "Authentication is not enabled yet",
        status: "disabled"
    });
}

export async function POST() {
    return NextResponse.json({
        message: "Authentication is not enabled yet",
        status: "disabled"
    });
}
