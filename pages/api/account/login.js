import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {connect} from "../../../utils/mongodbConnection";
import User from '../../../models/User';

function validateFields(username, password) {
    if (!username?.trim()) {
        return { error: "username empty"};
    }
    if (!password?.trim()) {
        return { error: "password empty"};
    }
    return null;
}

export default async function handler(request, resource) {
    if (request.method !== "POST") {
        console.log("wrong method")
        return resource.status(400).json({error: "only POST method allowed"})
    }

    try {
        await connect();

        const {username, password } = request.body;

        // CHECK FIELDS
        const res = validateFields(username, password)
        if (res) {
            console.log("failed validation checks")
            return resource.status(400).json(res)
        }

        // CHECK IF ACCOUNT EXISTS
        const user = await User.findOne({username})
        if (!user) {
            console.log("account doesnt exist")
            return resource.status(400).json({error: "user not found"})
        }

        // CHECK PASSWORD FOR ACCOUNT
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatch) {
            console.log("incorrect password")
            return resource.status(400).json({error: "incorrect password"})
        }

        // JWT TOKEN
        const token = jwt.sign(
            {userId: user._id},
            process.env.JWT_KEY,
            {expiresIn: "3d"}
        );
        console.log("logged in")
        return resource.status(200).json({id: user._id, token: token})
    }
    catch(error) {
        console.error(error);
        return resource.status(500).json({error: "backend error"})
    }
}