import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI;
if (!MONGODB_URI) {
    throw new Error("no URI for mongo");
}

let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    } 
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI);
    } 
    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectDB;
