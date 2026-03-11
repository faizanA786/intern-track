import jwt from "jsonwebtoken";
import { connect } from "./mongodbConnection";
import User from "../models/User";

async function updateLastSeen(decodedId) {
    await connect();

    const user = await User.findOne({_id: decodedId})
    user.lastSeen = new Date()
    user.save()
}

export async function verifyToken(request) {
    const token = request.headers.authorization.split(" ")[1]

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_KEY)

        updateLastSeen(decodedToken.userId);
        return decodedToken.userId;
    }
    catch(error) {
        console.log("expired/invalid token")
    }
}