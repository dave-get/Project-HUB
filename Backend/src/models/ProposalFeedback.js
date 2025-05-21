import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    proposal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proposal',
        required: true
    },
    projectTitle: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Approved', 'Rejected', 'Needs Revision', 'Pending'],
        default: 'Pending'
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    teacherInfo: {
        name: {
            type: String,
            required: true
        },
        department: {
            type: String,
            required: true
        }
    },
    sections: [{
        title: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        strengths: {
            type: String,
            required: true
        },
        areasForImprovement: {
            type: String,
            required: true
        },
        comments: {
            type: String,
            required: true
        }
    }],
    attachments: [{
        fileName: {
            type: String,
            required: true
        },
        size: {
            type: String,
            required: true
        },
        downloadLink: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

// Add a method to format the response
feedbackSchema.methods.toJSON = function() {
    return {
        feedback: {
            projectTitle: this.projectTitle,
            status: this.status,
            teacher: this.teacherInfo,
            sections: this.sections,
            attachments: this.attachments
        }
    };
};

// Add a method to populate teacher info
feedbackSchema.pre('save', async function(next) {
    if (this.isModified('teacher')) {
        const User = mongoose.model('User');
        const teacher = await User.findById(this.teacher);
        if (teacher) {
            this.teacherInfo = {
                name: teacher.fullName,
                department: teacher.department || 'Not specified'
            };
        }
    }
    next();
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback; 