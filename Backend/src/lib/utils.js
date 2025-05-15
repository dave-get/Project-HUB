import jwt from "jsonwebtoken"

export const generateToken = (user) => {
    return jwt.sign({
        userId: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        department: user.department,
        headline: user.headline,
        bio: user.bio,
        phone: user.phone,
        location: user.location,
        imageUrl: user.imageUrl,
        socialLinks: user.socialLinks,
        skills: user.skills
    }, process.env.JWT_SECRET, { expiresIn: "7d" })
}