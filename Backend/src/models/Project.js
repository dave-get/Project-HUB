import mongoose from 'mongoose';

// Schema for comments
const commentSchema = new mongoose.Schema({
  commenterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  image: { type: String },
  text: { type: String, required: true },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Schema for team members
const teamMemberSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true }
});

// Schema for tools
const toolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String }
});

// Schema for tools and machines section
const toolsAndMachinesSchema = new mongoose.Schema({
  noToolsUsed: { type: Boolean, default: false },
  tools: [toolSchema]
});

// Schema for apps and platforms
const appPlatformSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  logo: { type: String }
});

// Schema for documentation
const documentationSchema = new mongoose.Schema({
  fileName: { type: String },
  fileSize: { type: String },
  fileUrl: { type: String }
});

// Schema for code and documentation section
const codeAndDocumentationSchema = new mongoose.Schema({
  repositoryLink: { type: String },
  documentation: documentationSchema
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tags: { type: [String], default: [] },
  coverImage: { type: String },
  elevatorPitch: { type: String, required: true }, // renamed from description
  projectDescription: { type: String }, // renamed from projectDescriptionFull
  teamMembers: [teamMemberSchema],
  toolsAndMachines: toolsAndMachinesSchema,
  appsAndPlatforms: [appPlatformSchema],
  codeAndDocumentation: codeAndDocumentationSchema,
  // Comments section
  comments: [commentSchema],
  // Additional fields for internal use
  views: { type: Number, default: 0 },
  status: { type: Boolean, default: false },
  reviewedByTeacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true
});

export default mongoose.model('Project', projectSchema); 