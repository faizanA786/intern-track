import Application from "../../../models/Application";
import { verifyToken } from "../../../utils/lastSeen";
import { connect } from "../../../utils/mongodbConnection";
import { updateLastSeen } from "../../../utils/lastSeen";

export default async function handler(request, resource) {
    if (request.method !== "POST") {
        console.log("wrong method")
        return resource.json({error: "only POST methods allowed!"});
    }

    try {
        await connect();

        const userId = request.headers["user-id"]
        updateLastSeen(userId)

        const {id} = request.body;
        const app = await Application.findOneAndDelete({_id: id, userId: userId});
        if (!app) {
            return resource.status(400).json({error: "not found"});
        }
        return resource.status(200).end();
    }
    catch(error) {
        console.error(error);
        return resource.status(500).json({error: "backend error"});
    }
}