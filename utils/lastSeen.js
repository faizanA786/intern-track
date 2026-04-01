import { connect } from "./mongodbConnection";
import User from "../models/User";

export async function updateLastSeen(userId) {
    await connect();

    const user = await User.findOne({_id: userId})
    if (!user) {
        return
    }

    user.lastSeen = new Date()
    user.save()
}

