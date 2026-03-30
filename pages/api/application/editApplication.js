import Application from "../../../models/Application";
import { verifyToken } from "../../../utils/lastSeen";
import { connect } from "../../../utils/mongodbConnection";
import { updateLastSeen } from "../../../utils/lastSeen";

function validateFields(title, company, type, status, link, appliedDate, folder) {
    if (!title?.trim()) {
        return { error: "title"}
    }
    if (!company?.trim()) {
        return { error: "company"}
    }
    if (!type?.trim()) {
        return { error: "type"}
    }
    if (!status?.trim()) {
        return { error: "status"}
    }
    if (!appliedDate?.trim()) {
        return { error: "date"}
    }
    if (!folder?.trim()) {
        return { error: "folder"}
    }
}

export default async function handler(request, resource) {
    if (request.method !== "POST") {
        console.log("wrong method")
        return resource.json({error: "only POST methods allowed!"});
    }

    try {
        await connect();
        
        const userId = request.headers["user-id"]
        updateLastSeen(userId)

        const {title, company, type, status, link, appliedDate, folder} = request.body;
        const res = validateFields(title, company, type, status, link, appliedDate, folder)
        if (res) {
            return resource.status(400).json(res);
        }

        const{id} = request.body;
        const app = await Application.findOne({_id: id, userId: userId});

        app.title = title;
        app.company = company;
        app.type = type;
        app.status = status;
        app.link = link;
        app.appliedDate = appliedDate;
        app.folder = folder;

        await app.save();

        return resource.status(200).json(app);
    }
    catch(error) {
        console.error(error);
        return resource.status(500).json({error: "backend error"});
    }
}