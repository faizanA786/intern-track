import mongoose from 'mongoose';
const {Schema, model} = mongoose;

const userSchema = new Schema(
    {
        username: { type: String, required: true, unique: true},
        passwordHash: { type: String, required: true },
        lastSeen: { type: Date, default: Date.now }
    }, 
    { 
        versionKey: false, 
        collection: "users"
    }
);

let User;
if (mongoose.models.User) {
    User = mongoose.models.User
}
else {
    User = model("User", userSchema);
}
export default User;