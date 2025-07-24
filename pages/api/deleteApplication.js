import { authenticate } from "../../utils/auth";
import Application from "../../models/Application";
import connectDb from "../../utils/connectDb";

async function handler(request, resource) {
    try {
        await connectDb();

        const userId = request.user?.id;
        if (!userId) {
            return resource.status(401).json({ message: "unauthorized" });
        }

        if (request.method === "POST") { // GET APP DATA
            const {id} = request.body;
            const app = await Application.findByIdAndDelete(id);
            if (!app) {
                return resource.status(404).json({error: "not found"});
            }
            return resource.status(200).json({ message: "deleted"});
        }
    }
    catch(error) {
        console.error(error);
        return resource.status(500).json({message: "internal server error"});
    }
    
    resource.status(405).end(); // method not allowed
}

export default authenticate(handler)