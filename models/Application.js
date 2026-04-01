import mongoose from "mongoose";
const {Schema, model} = mongoose;

const applicationSchema = new Schema(
    {
        title: {type: String, required: true},
        company: {type: String, required: true},
        type: {type: String, enum: ["Internship", "Placement"], required: true},
        status: { type: String, enum: ["Applied", "Interview", "Rejected", "Offer"], default: "Applied", required: true },
        link: String,
        appliedDate: {type: Date, default: Date.now},
        folder: { type: String, default: "default" }, // folder name
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true } // who app belongs to
    }, 
    { 
        versionKey: false, 
        collection: "applications"
    }
);

let Application;
if (mongoose.models.Application) {
    Application = mongoose.models.Application;
}
else {
    Application = model("Application", applicationSchema);
}
export default Application;