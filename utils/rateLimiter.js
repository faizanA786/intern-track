import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export async function rateLimiter(ip) {
    const entry = await redis.get(ip)

    // if new ip
    if (!entry) {
        await redis.set(ip, {requests: 10, firstReq: Date.now(), lastReq: Date.now()})
        return false
    }

    entry.lastReq = Date.now()
    // check if time to reset reqs
    if (Date.now() - entry.firstReq > 10000) {
        console.log("resetting requests")
        await redis.set(ip, { requests: 10, firstReq: Date.now(), lastReq: Date.now() })
        return false
    }
    entry.requests--

    // check num of reqs left
    if (entry.requests <= 0) {
        console.log("no more requests")
        await redis.set(ip, entry)
        return true
    }

    // update num of requests
    await redis.set(ip, entry)
    console.log("requests left " + entry.requests)
    return false
}