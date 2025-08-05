import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({ // connect to upstash redis
    url: process.env.UPSTASH_URL,
    token: process.env.UPSTASH_TOKEN,
})

const configs = {
    signup: new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(5, "60s")}),
    newApp: new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(10, "40s")}),
    editApp: new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(15, "40s")}),
    getApp: new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(10, "10s")}),
}

export async function rateLimiter(request, resource, configName) {
    const rateLimit = configs[configName];
    if (!rateLimit) {
        res.status(500).json({ message: "invalid rate limit config" });
    }

    const ip = request.headers["x-forwarded-for"] || request.socket.remoteAddress || "unknown";
    const result = await rateLimit.limit(ip);

    if (!result.success) {
        resource.status(429).json({ message: "too many requests"});
        return false;
    }
    return true;
}