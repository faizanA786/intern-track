// CREATE MONGO INSTANCE

import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error("missing uri");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") { // development mode
    if (!global._mongoClientPromise) { // check for cached connection promise
        client = new MongoClient(uri);
        global._mongoClientPromise = client.connect(); // save promise globally
    }
    clientPromise = global._mongoClientPromise;
}
else{ // create new instance and connect
    client = new MongoClient(uri);
    clientPromise = client.connect();
}

export default clientPromise; // other files can import it and await the connection before querying db