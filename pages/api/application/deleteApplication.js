import Application from "../../../models/Application";
import { verifyToken } from "../../../utils/verifyToken";
import { connect } from "../../../utils/mongodbConnection";

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
        const app = await Application.findByIdAndDelete(id);
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