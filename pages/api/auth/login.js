import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDb from '../../../utils/connectDb';
import User from '../../../models/User';

export default async function handler(request, resource) {
    if (request.method !== "POST") {
        return resource.status(405).json({message: "missing email or password"})
    }

    try {
        await connectDb();

        const {email, password } = request.body;
        const user = await User.findOne({email})

        if (!user) {
            return resource.status(404).json({message: "not found"})
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatch) {
            return resource.status(401).json({message: "incorrect password"})
        }

        // create JWT token
        const token = jwt.sign(
            {userId: user._id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: "3d"}
        );
        return resource.status(200).json({token})
    }
    catch(error) {
        console.error(error);
        return resource.status(500).json({message: "internal server error"})
    }
}