import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {verifyToken} from "./utils/verifyToken.js"
import {rateLimiter} from "./utils/rateLimiter.js"

export const config = {
    matcher: ['/api/:path*'],
}

export async function middleware(request: NextRequest) {
    const route = request.nextUrl.pathname
    // RATE LIMITER
    const ip = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")
    if (await rateLimiter(ip)) {
        console.log("timeout")
        return NextResponse.json({error: "timeout"}, {status: 400})
    }

    //PUBLIC 
    if (route.startsWith("/api/account/")) {
        return NextResponse.next()
    }

    // PROTECTED (jwt auth)
    if (route.startsWith("/api/application/")) {
        const userId = await verifyToken(request)
        if (!userId) {
            return NextResponse.json({ error: "invalid/expired token" }, { status: 400 })
        }

        const res = NextResponse.next()
        res.headers.set("user-id", String(userId))
        return res
    }
}