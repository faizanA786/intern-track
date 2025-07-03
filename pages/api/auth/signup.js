// PROCESSING USER SIGN UPS

import clientPromise from "../../../utils/mongodb";
import bcrypt from "bcryptjs";

// export default - vercel knows this is function to run for this API endpoint
// async - allow for use of await inside body
// request - incoming HTTP object
// resource - response object to send back to client

export default async function handler(request, resource) {
    if (request.method !== "POST") {
        return resource.status(405).json({message: "method not allowed"})
    }

    // take body object from request, extract and assign to email and password consts
    const {email, password} = request.body;
    
    if (!email || !password || password.length < 6) {
        return resource.status(400).json({message: "missing or invalid fields"})
    }

    try {
        const client = await clientPromise;
        const db = client.db("interntrack");
        const userTable = db.collection("users") 

        const existingUser = await userTable.findOne({ email});
        if (existingUser) {
            return resource.status(409).json({message: "user already exists"});
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const result = await userTable.insertOne({
            // auto-id
            email,
            passwordHash,
            timestamp: new Date()
        })

        // return HTTP response with unique ID and stored email
        return resource.status(201).json({id: result.insertedId, email});
    }
    catch (error) {
        console.error(error);
        return resource.status(500).json({message: "internal server error"})
    }
}