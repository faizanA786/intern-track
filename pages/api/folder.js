import { authenticate } from "../../utils/auth";
import Application from "../../models/Application";
import connectDb from "../../utils/connectDb";

async function handler(request, resource) {
    try {
        await connectDb();

        const userId = request.user?.id; // from auth middleware
        if (!userId) {
            return resource.status(401).json({ message: "unauthorized" });
        }

        if (request.method === "POST") {
            const folder = request.body.folder;
            if (folder === "all") { // all
                const apps = await Application.find({
                    userId
                }).sort({ appliedDate: -1});
                return resource.status(201).json(apps);
            }
            
            const apps = await Application.find({ // specific
                folder,
                userId
            }).sort({ appliedDate: -1});
            console.log(folder);
            return resource.status(201).json(apps);
        }
    }
    catch(error) {
        console.error(error);
        return resource.status(500).json({message: "internal server error"});
    }
    
    resource.status(405).end(); // method not allowed
}

export default authenticate(handler)