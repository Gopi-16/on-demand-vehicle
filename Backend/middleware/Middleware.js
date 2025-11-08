import { verifyAccesToken } from "../utils/Jwt.js";      //next default fucniton

export default function RequireAuth(req, res, next) {
    const auth = req.headers.authorization || '';

    const token = auth.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No token" });

    try {
        const decoded = verifyAccesToken(token);
        req.user = decoded;
        next();
    }
    catch {
        return res.status(401).json({ message: "Invalid or token expired" });
    }
}
