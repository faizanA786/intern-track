import Application from "../../../models/Application";
import {connect} from "../../../utils/mongodbConnection";
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

        // GET ALL APPS
        const folder = request.body.folder;
        if (folder === "all") {
            const apps = await Application.find({userId: userId}).sort({appliedDate: -1});
            return resource.status(200).json(apps);
        }
        else{  // GET APPS FOR A SPECIFIC FOLDER
            const apps = await Application.find({folder: folder, userId: userId}).sort({ appliedDate: -1});
            return resource.status(200).json(apps);
        }
    }
    catch(error) {
        console.error(error);
        return resource.status(500).json({error: "backend error"});
    }
}