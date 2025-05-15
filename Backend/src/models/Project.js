import mongoose from 'mongoose';

const collaboratorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true }
});

const componentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  link: { type: String, required: true },
  image: { type: String, required: true }
});

const discussionSchema = new mongoose.Schema({
  author: { type: String, required: true },
  image: { type: String, required: true },
  comment: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const detailDescriptionSchema = new mongoose.Schema({
  description: {
    summary: { type: String, required: true },
    notice: { type: String, required: true }
  },
  components: [componentSchema],
  tools: [componentSchema],
  apps: [componentSchema],
  code: {
    repository: { type: String, required: true },
    language: { type: String, required: true },
    files: [{ type: String }]
  },
  documentation: {
    guide: { type: String, required: true },
    pdf: { type: String, required: true },
    video_tutorial: { type: String, required: true }
  },
  discussion: [discussionSchema]
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  card_image: { type: String, required: true },
  description: { type: String, required: true },
  views: { type: Number, default: 0 },
  likes_count: { type: Number, default: 0 },
  comments_count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  collaborators: [collaboratorSchema],
  detail_description: detailDescriptionSchema
}, {
  timestamps: true
});

export default mongoose.model('Project', projectSchema); 