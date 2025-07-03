import jwt from "jsonwebtoken";

// middleware, runs between request and actual route handler
export function authenticate(handler) {
    return async function (request, resource) {
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return resource.status(401).json({message: "missing token"})
        }

        const token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            request.user = decoded; // add new user property to request object 
            return handler(request, resource);
        }
        catch (error) {
            return resource.status(401).json({message: "invalid or expired token"})
        }
    }


}