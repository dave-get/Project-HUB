import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized - No Token Provided" 
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            _id: decoded.userId,
            email: decoded.email,
            fullName: decoded.fullName,
            role: decoded.role,
            department: decoded.department,
            headline: decoded.headline,
            bio: decoded.bio,
            phone: decoded.phone,
            location: decoded.location,
            imageUrl: decoded.imageUrl,
            socialLinks: decoded.socialLinks,
            skills: decoded.skills
        };

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            console.log("JWT expired:", error.message);
            return res.status(401).json({ 
                success: false, 
                message: "Unauthorized - Token Expired" 
            });
        }

        console.log(`Error in protectRoute middleware: ${error.message}`);
        return res.status(401).json({ 
            success: false, 
            message: "Unauthorized - Invalid Token" 
        });
    }
};
