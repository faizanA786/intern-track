// translates to a mongodb query
import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
    title: {type: String, required: true},
    company: {type: String, required: true},
    type: {type: String, enum: ["Internship", "Placement"], required: true},
    status: { type: String, enum: ["Applied", "Interview", "Rejected", "Offer"], default: "Applied", required: true },
    link: String,
    appliedDate: {type: Date, default: Date.now},
    folder: { type: String, default: "default" }, // folder name or ID
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true } // reference user table
}, { versionKey: false, collection: 'applications'});

export default mongoose.models.Application || mongoose.model("Application", ApplicationSchema);