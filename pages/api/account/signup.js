// PROCESSING USER SIGN UPS

import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import User from "../../../models/User";
import {connect} from "../../../utils/mongodbConnection";

function validateFields(username, password, confirmPassword, termsAgreed) {
    if (!termsAgreed) {
        return {error: "terms"}
    }

    if (!username?.trim()) {
        return {error: "empty username"};
    }
    if(!password?.trim()) {
        return {error: "empty password"}
    }
    if(!confirmPassword?.trim()) {
        return {error: "empty confirm password"}
    }
    if (password != confirmPassword) {
        return {error: "passwords dont match"}
    }
    
    if (username.length < 6) {
        return {error: "username length"}
    }
    if (password.length < 6) {
        return {error: "password length"}
    }

    return null

}

export default async function handler(request, resource) {
    if (request.method !== "POST") {
        console.log("wrong method")
        return resource.json({error: "only POST methods allowed!"});
    }

    const {username, password, confirmPassword, termsAgreed} = request.body;

    // CHECK FIELDS
    const res = validateFields(username, password, confirmPassword, termsAgreed)
    if (res) {
        console.log("failed validation checks")
        return resource.status(400).json(res)
    }
    console.log("passed validation checks")

    // CREATE NEW ACCOUNT
    try {
        await connect();

        // CHECK FOR EXISTING ACCOUNTS
        const existingUser = await User.findOne({username: username});
        if (existingUser) {
            console.log("user already exists")
            return resource.status(400).json({error: "user already exists"});
        }

        // CREATE NEW ACCOUNT IN THE DATABASE
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await User({
            // auto-id
            username,
            passwordHash,
            lastSeen: new Date()
        })
        const userFinal = await newUser.save();

        // JWT TOKEN
        const token = jwt.sign(
            {userId: userFinal._id},
            process.env.JWT_KEY,
            {expiresIn: "3d"}
        );

        console.log("user created")
        return resource.status(200).json({token: token});
    }
    catch (error) {
        console.log(error);
        return resource.status(500).json({error: "backend error"})
    }
}