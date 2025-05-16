import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectTitle: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
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

const proposalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.status !== 'draft';
    }
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'approved', 'rejected'],
    default: 'Pending'
  },
  attachments: [{
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    }
  }],
  feedbackList: {
    type: [feedbackSchema],
    default: []
  }
}, {
  timestamps: true
});

// Add virtual for feedback
proposalSchema.virtual('feedback', {
  ref: 'Feedback',
  localField: '_id',
  foreignField: 'proposal'
});

// Ensure virtuals are included in JSON
proposalSchema.set('toJSON', { virtuals: true });
proposalSchema.set('toObject', { virtuals: true });


export default mongoose.model('Proposal', proposalSchema); 