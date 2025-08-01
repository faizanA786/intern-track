// PROCESSING USER SIGN UPS

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../../models/User";
import connectDb from "../../../utils/connectDb";
import { rateLimiter } from "../../../utils/rateLimit";

// export default - vercel knows this is function to run for this API endpoint
// async - allow for use of await inside body
// request - incoming HTTP object
// resource - response object to send back to client

export default async function handler(request, resource) {
    if (request.method !== "POST") return resource.status(405).json({message: "method not allowed"});

    const allowed = await rateLimiter(request, resource, "signup");
    if (!allowed) return;

    // take body object from request, extract and assign to email and password consts
    const {forename, email, password} = request.body;
    if (!forename?.trim()) {
        return resource.status(400).json({ message: "forename"});
    }
    if (!email?.trim()) {
        return resource.status(400).json({ message: "email"});
    }
    if (!password?.trim()) {
        return resource.status(400).json({ message: "password"});
    }
    
    if (!email || !password || password.length < 6) {
        return resource.status(400).json({message: "missing or invalid fields"})
    }

    try {
        await connectDb();
        
        const existingUser = await User.findOne({ email});
        if (existingUser) {
            return resource.status(409).json({message: "user already exists"});
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await User({
            // auto-id
            forename,
            email,
            passwordHash,
            timestamp: new Date()
        })
        const result = await newUser.save();

        // create JWT token
        const token = jwt.sign(
            {userId: result._id, email: result.email},
            process.env.JWT_SECRET,
            {expiresIn: "3d"}
        );

        // return HTTP response with unique ID and stored email
        return resource.status(201).json({id: result.insertedId, email, token});
    }
    catch (error) {
        console.error(error);
        return resource.status(500).json({message: "internal server error"})
    }
}