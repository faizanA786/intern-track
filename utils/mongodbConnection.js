
import mongoose from 'mongoose';

let cachedConnection = false;
export async function connect() {
  if (cachedConnection) {
      console.log("using cached connection")
      return;
  }
  else {
    try {
      console.log("creating new connection")
      await mongoose.connect(process.env.MONGO_KEY);
      cachedConnection = true
      return;
    }
    catch (error) {
      console.log(error)
    }
  }
}