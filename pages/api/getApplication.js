import { authenticate } from "../../utils/auth";
import Application from "../../models/Application";
import connectDb from "../../utils/connectDb";
import { rateLimiter } from "../../utils/rateLimit";


async function handler(request, resource) {
    try {
        await connectDb();

        const userId = request.user?.id;
        if (!userId) {
            return resource.status(401).json({ message: "unauthorized" });
        }

        const allowed = await rateLimiter(request, resource, "editApp");
        if (!allowed) return;

        if (request.method === "POST") { // GET APP DATA
            const {id} = request.body;
            const app = await Application.findById(id);
            if (!app) {
                return resource.status(400).json({error: "error"});
            }
            return resource.status(200).json(app);
        }
    }
    catch(error) {
        console.error(error);
        return resource.status(500).json({message: "internal server error"});
    }
    
    resource.status(405).end(); // method not allowed
}

export default authenticate(handler)