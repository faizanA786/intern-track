import Application from "../../../models/Application";
import { connect } from "../../../utils/mongodbConnection";
import { verifyToken } from "../../../utils/verifyToken";

export default async function handler(request, resource) {
    if (request.method !== "POST") {
        console.log("wrong method")
        return resource.json({error: "only POST methods allowed!"});
    }

    try {
        await connect();

        const userId = await verifyToken(request);
        if (!userId) {
            return resource.status(400).json({ error: "invalid/expired token" });
        }

        const {id} = request.body;
        const app = await Application.findById(id);
        if (!app) {
            return resource.status(400).json({error: "app doesnt exist"});
        }
        return resource.status(200).json(app);
    }
    catch(error) {
        console.error(error);
        return resource.status(500).json({error: "internal server error"});
    }
}