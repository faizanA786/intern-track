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
    const ip = request.headers.get("x-real-ip")
    if (rateLimiter(ip)) {
        console.log("timeout")
        return
    }

    //PUBLIC 
    if (route.startsWith("/api/account/")) {
        return NextResponse.next()
    }

    // PROTECTED (jwt auth)
    if (route.startsWith("/api/application/")) {
        const userId = await verifyToken(request)
        if (!userId) {
            const loginURL = new URL("/Login-Page", request.url)
            return NextResponse.redirect(loginURL)
        }

        const res = NextResponse.next()
        res.headers.set("user-id", String(userId))
        return res
    }
}