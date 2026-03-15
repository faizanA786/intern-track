let limits = {}

export function rateLimiter(ip) {
    // new ip
    if (!(ip in limits)) {
        limits[ip] = {requests: 10, firstReq: Date.now(), lastReq: Date.now()}
        return false
    } 
    else {
        limits[ip].lastReq = Date.now()

        // check if time to reset reqs
        const firstReqTime = limits[ip].firstReq
        if (Date.now() - firstReqTime > 10000) {
            limits[ip] = {requests: 10, firstReq: Date.now()}
            return false
        }
        
        let requests = limits[ip].requests
        requests--
        limits[ip].requests = requests

        // check num of reqs left
        if (requests <= 0) {
            return true
        }
    }
    return false;
}