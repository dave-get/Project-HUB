import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectRoute = async(req,res,next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized - No Token Provided" 
            });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized - No Token Provided" 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized - Invalid Token" 
            });
        }

        // Set user info directly from token
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
        }
        
        next()
    } catch (error) {
        console.log(`Error in protectRoute middleware: ${error.message}`)
        res.status(401).json({ 
            success: false,
            message: "Unauthorized - Invalid Token" 
        })
    }
}