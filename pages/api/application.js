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

        const allowed = await rateLimiter(request, resource, "newApp");
        if (!allowed) return;

        if (request.method === "POST") { // SUBMISSION
            const {title, company, type, status, link, appliedDate, folder} = request.body;
            
            if (!title?.trim()) {
                return resource.status(400).json({ message: "title"});
            }
            if (!company?.trim()) {
                return resource.status(400).json({ message: "company"});
            }
            if (!type?.trim()) {
                return resource.status(400).json({ message: "type"});
            }
            if (!status?.trim()) {
                return resource.status(400).json({ message: "status"});
            }
            if (!appliedDate?.trim()) {
                return resource.status(400).json({ message: "date"});
            }
            if (!folder?.trim()) {
                return resource.status(400).json({ message: "folder"});
            }
            
            const newApp = await Application.create({
                title,
                company,
                type,
                status,
                link,
                appliedDate,
                folder,
                userId
            })
            return resource.status(201).json(newApp);
        }
    }
    catch(error) {
        console.error(error);
        return resource.status(500).json({message: "internal server error"});
    }
    
    resource.status(405).end(); // method not allowed
}

export default authenticate(handler)