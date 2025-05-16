import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const signUp = async (req,res) => {
    const { email, password, role, ...otherFields } = req.body

    try {
        // Validate required fields
        if (!email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Email, password, and role are required"
            })
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)){
            return res.status(400).json({ 
                success: false,
                message: "Invalid email format" 
            })
        }
        
        // Validate password length
        if (password.length < 6){
            return res.status(400).json({ 
                success: false,
                message: "Password must be at least 6 characters" 
            })
        }

        // Validate role
        if (!['student', 'teacher', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Must be student, teacher, or admin"
            })
        }

        // Check if email already exists
        const existingUser = await User.findOne({email})
        if (existingUser){
            return res.status(400).json({ 
                success: false,
                message: "Email already exists" 
            })
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create base user object
        const userData = {
            email,
            password: hashedPassword,
            fullName: otherFields.fullName || email.split('@')[0],
            role
        }

        // Add role-specific fields
        if (role === 'student') {
            Object.assign(userData, {
                department: otherFields.department,
                bio: otherFields.bio,
                imageUrl: otherFields.imageUrl || "default-profile.jpg",
                phone: otherFields.phone,
                location: otherFields.location,
                socialLinks: otherFields.socialLinks || [],
                skills: otherFields.skills || {
                    technical: [],
                    soft: []
                }
            })
        }

        // Create and save user
        const newUser = new User(userData)
        await newUser.save()
        
        const token = generateToken(newUser, res)

        res.status(201).json({
            success: true,
            message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`,
            data: {
                accessToken: token
            }
        })
    } catch (error) {
        console.log(`Error in signup controller ${error.message}`);
        return res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
}

// signin
export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: "Email and password are required" 
            })
        }

        // Find user by email only
        const user = await User.findOne({ email })
        
        if(!user){
            return res.status(400).json({ 
                success: false,
                message: "Invalid credentials" 
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({ 
                success: false,
                message: "Invalid credentials" 
            })
        }

        const token = generateToken(user, res)

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                accessToken: token,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.fullName
                }
            }
        })
    } catch (error) {
        console.log(`Error in login controller: ${error}`)
        return res.status(500).json({ 
            success: false,
            message: "Internal Server Error" 
        })
    }
}

export const logout = async (req,res) => {
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({ 
            success: true,
            message: "Logged Out Successfully" 
        })
    } catch (error) {
        console.log(`Error in logout controller ${error.message}`);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error" 
        })
    }
}

export const getProfile = async (req, res) => {
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

        // Verify token and get user data
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - Invalid Token"
            });
        }

        // Get user from database
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Return user data based on role
        const userData = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            imageUrl: user.imageUrl || "default-profile.jpg"
        };

        // Add role-specific fields
        if (user.role === 'student') {
            Object.assign(userData, {
                department: user.department,
                bio: user.bio,
                phone: user.phone,
                location: user.location,
                socialLinks: user.socialLinks || [],
                skills: user.skills || {
                    technical: [],
                    soft: []
                }
            });
        }

        res.status(200).json({
            success: true,
            data: userData
        });
    } catch (error) {
        console.log(`Error in getProfile controller: ${error.message}`);
        res.status(401).json({
            success: false,
            message: "Unauthorized - Invalid Token"
        });
    }
};