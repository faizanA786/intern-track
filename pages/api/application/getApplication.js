import Application from "../../../models/Application";
import { connect } from "../../../utils/mongodbConnection";
import { verifyToken } from "../../../utils/lastSeen";
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
        const app = await Application.findOne({_id: id, userId: userId});
        if (!app) {
            console.log("app doesnt exist")
            return resource.status(400).json({error: "app doesnt exist"});
        }
        return resource.status(200).json(app);
    }
    catch(error) {
        console.error(error);
        return resource.status(500).json({error: "internal server error"});
    }
}