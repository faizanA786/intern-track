import clientPromise from "../../../utils/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(request, resource) {
    if (request.method !== "POST") {
        return resource.status(400).json({message: "missing email or password"})
    }

    try {
        const client = await clientPromise;
        const db = client.db("interntrack");

        const { email, password } = request.body;
        const user = await db.collection("users").findOne({email});

        if (!user) {
            return resource.status(401).json({message: "invalid credentials"})
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatch) {
            return resource.status(401).json({message: "invalid credentials"})
        }

        // create JWT token
        const token = jwt.sign(
            {userId: user._id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        );
        return resource.status(200).json({token})
    }
    catch(error) {
        console.error(error);
        return resource.status(500).json({message: "internal server error"})
    }
}