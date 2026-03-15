import {jwtVerify} from "jose";

export async function verifyToken(request) {
    const token = request.cookies.get("token")?.value
    if (!token) {
        console.log("no token")
        return
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_KEY) //secret must be encoded as Uint8Arr via textencoder
        const{payload} = await jwtVerify(token, secret)
        return payload.userId;
    }
    catch(error) {
        console.log(error)
        console.log("expired/invalid token")
    }
}