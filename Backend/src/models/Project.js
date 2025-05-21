import mongoose from 'mongoose';

// Schema for items with name, image, and description (e.g., Components, Tools, Apps, Collaborators)
const detailItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String }, // Optional image URL/path
  description: { type: String } // Optional description
});

// Schema for items that are links, embeds, or files (e.g., Code, Downloadable Files, Documentation)
const linkItemSchema = new mongoose.Schema({
  name: { type: String }, // Optional name or title
  value: { type: String, required: true } // The link, embed code, file path, etc.
});

// Schema for individual comments
const commentSchema = new mongoose.Schema({
  commenterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Assuming a User model exists
  name: { type: String, required: true }, // Added name field
  image: { type: String }, // Added optional image field
  text: { type: String, required: true },
  likes: { type: Number, default: 0 },
});

const collaboratorSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Explicitly adding ObjectId for clarity
  name: { type: String, required: true },
  image: { type: String, required: true },
  isAuthor: { type: Boolean, default: false }
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  coverImage: { type: String }, // Renamed from card_image
  description: { type: String, required: true }, // This will be for the short description
  views: { type: Number, default: 0 },
  comments: [commentSchema], // Replaced comments_count with an array of comments
  created_at: { type: Date, default: Date.now },
  collaborators: [collaboratorSchema],
  // Using the new schemas for the arrays
  componentsAndSupplies: [detailItemSchema],
  toolsAndMachines: [detailItemSchema],
  appsAndPlatforms: [detailItemSchema],
  projectDescriptionFull: { type: String }, // For the longer project description
  code: [linkItemSchema],
  downloadableFiles: [linkItemSchema],
  documentation: { type: [linkItemSchema], required: true },
  // Boolean flags from the form
  noToolsUsed: { type: Boolean, default: false },
  noFilesToAdd: { type: Boolean, default: false },
  // Approval status
  status: { type: Boolean, default: false }, // true if approved, false otherwise
  // Reviewer Teacher ID
  reviewedByTeacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assuming a 'User' model exists for teachers
  // Likes tracking
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Array to store user IDs who liked
}, {
  timestamps: true
});

export default mongoose.model('Project', projectSchema); 