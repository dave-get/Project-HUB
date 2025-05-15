import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        fullName:{
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
            unique: true
        },
        password:{
            type: String,
            required: true,
            minlength: 6
        },
        role:{
            type: String,
            required: true,
            enum: ['student', 'teacher', 'advisor']
        },
        // Student specific fields
        department: String,
        bio: String,
        imageUrl: {
            type: String,
            default: "default-profile.jpg"
        },
        phone: String,
        location: String,
        socialLinks: [{
            platform: String,
            url: String
        }],
        skills: {
            technical: [String],
            soft: [String]
        }
    },{ timestamps: true }
)

const User = mongoose.model("User",userSchema)
export default User