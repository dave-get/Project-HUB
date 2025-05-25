import Project from '../models/Project.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to handle multiple file uploads for project creation/update
export const uploadProjectFiles = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'toolImages', maxCount: 20 },
  { name: 'appLogos', maxCount: 20 },
  { name: 'documentationFiles', maxCount: 1 }
]);

// Helper function to upload files to Cloudinary
const uploadToCloudinary = async (file, options = {}) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    }).end(file.buffer);
  });
};

// Get all projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: true });
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single project
export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to safely parse JSON
const safeParseJSON = (data) => {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('JSON parse error:', e);
      return data;
    }
  }
  return data;
};

// Create project
export const createProject = async (req, res) => {
  try {
    const { 
      title, 
      elevatorPitch, 
      collaborators, 
      toolsAndMachines, 
      appsAndPlatforms, 
      projectDescription, 
      code, 
      documentation, 
      noToolsUsed,
      reviewedByTeacherId  // Add this to destructuring
    } = req.body;
    const files = req.files;

    // Arrays to hold all Cloudinary upload promises
    const uploadPromises = [];

    // Parse JSON strings from form-data
    const parsedTeamMembers = safeParseJSON(req.body.teamMembers);
    const parsedToolsAndMachines = safeParseJSON(req.body.toolsAndMachines);
    const parsedAppsAndPlatforms = safeParseJSON(req.body.appsAndPlatforms);
    const parsedCodeAndDocumentation = safeParseJSON(req.body.codeAndDocumentation);
    const parsedTags = safeParseJSON(req.body.tags);

    // Process team/collaborators
    let processedCollaborators = [];
    if (parsedTeamMembers) {
      try {
        // Handle both string and array formats
        const teamMembersArray = Array.isArray(parsedTeamMembers) ? parsedTeamMembers : JSON.parse(parsedTeamMembers);
        if (Array.isArray(teamMembersArray)) {
          processedCollaborators = teamMembersArray.map((member) => {
            if (!member.id) {
              throw new Error('Team member ID is required');
            }
            return {
              id: member.id,
              name: member.name,
              role: member.role
            };
          });
        }
      } catch (error) {
        console.error('Error parsing team members:', error);
        throw new Error('Invalid team members format');
      }
    }

    // Process app logos
    let processedApps = parsedAppsAndPlatforms || [];
    if (Array.isArray(processedApps)) {
      processedApps = processedApps.map((app, index) => {
        const appLogoFile = files && files.appLogos && files.appLogos[index];
        if (appLogoFile) {
          const uploadPromise = uploadToCloudinary(appLogoFile, { folder: 'project_apps' }).then(result => {
            app.logo = result.secure_url;
          }).catch(error => {
            console.error('Cloudinary upload error for app logo:', error);
            app.logo = null;
            console.error('Cloudinary upload error for app logo:', error);
            app.logo = null;
          });
          uploadPromises.push(uploadPromise);
        }
        return app;
        return app;
      });
    }

    // Process tool images when noToolsUsed is false
    let processedTools = [];
    if (!noToolsUsed) {
      const toolsData = parsedToolsAndMachines || { noToolsUsed: false, tools: [] };
      if (Array.isArray(toolsData.tools)) {
        processedTools = toolsData.tools.map((tool, index) => {
          const toolImageFile = files && files.toolImages && files.toolImages[index];
          if (toolImageFile) {
            const uploadPromise = uploadToCloudinary(toolImageFile, { folder: 'project_tools' }).then(result => {
              tool.image = result.secure_url;
            }).catch(error => {
              console.error('Cloudinary upload error for tool image:', error);
              tool.image = null;
            });
            uploadPromises.push(uploadPromise);
          }
          return tool;
        });
      }
    }

    // Process documentation files
    let processedDocumentation = safeParseJSON(documentation) || [];
    if (Array.isArray(processedDocumentation)) {
      processedDocumentation = processedDocumentation.map((docItem, index) => {
        const docFile = files && files.documentationFiles && files.documentationFiles[index];
        if (docFile) {
          const uploadPromise = uploadToCloudinary(docFile, { folder: 'project_documentation', resource_type: 'raw' }).then(result => ({
            fileName: docFile.originalname,
            fileSize: result.bytes,
            fileUrl: result.secure_url
          })).catch(error => {
            console.error('Cloudinary upload error for documentation file:', error);
            return null;
          });
          uploadPromises.push(uploadPromise);
        }
        return docItem;
      });
    }

    // Wait for ALL Cloudinary uploads to complete
    await Promise.all(uploadPromises);

    // Upload cover image (this was already awaited correctly)
    let coverImage = undefined;
    if (files && files.coverImage && files.coverImage[0]) {
      const result = await uploadToCloudinary(files.coverImage[0], { folder: 'project_covers' });
      coverImage = result.secure_url;
    }

    const project = new Project({
      // Required fields
      title,
      elevatorPitch,
      
      // Optional fields with defaults
      tags: parsedTags || [],
      coverImage,
      projectDescription,
      
      // Team and collaboration
      teamMembers: processedCollaborators,
      
      // Tools and machines
      toolsAndMachines: noToolsUsed 
        ? { noToolsUsed: true, tools: [] } 
        : { noToolsUsed: false, tools: processedTools },
      
      // Apps and platforms
      appsAndPlatforms: processedApps,
      projectDescription,
      code: safeParseJSON(code) || [],
      documentation: processedDocumentation,
      noToolsUsed,
    });

    const savedProject = await project.save();
    res.status(201).json({ project: savedProject });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(400).json({ message: error.message });
  }
};

// Increment views
export const incrementViews = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle like for a project
export const addLike = async (req, res) => {
  try {
    const projectId = req.params.id;
    // In a real application, the userId would come from the authenticated user
    // For testing purposes, we assume userId is sent in the request body
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required to like/unlike.' });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    const userIdObj = new mongoose.Types.ObjectId(userId); // Convert userId string to ObjectId

    // Check if the user has already liked the project
    const userLikedIndex = project.likes.findIndex(like => like.equals(userIdObj));

    if (userLikedIndex === -1) {
      // User has not liked the project, so add their like
      project.likes.push(userIdObj);
      project.likes_count = project.likes.length; // Update the count
      await project.save();
      res.json({ message: 'Project liked successfully.', project });
    } else {
      // User has already liked the project, so remove their like (unlike)
      project.likes.splice(userLikedIndex, 1);
      project.likes_count = project.likes.length; // Update the count
      await project.save();
      res.json({ message: 'Project unliked successfully.', project });
    }

  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ message: error.message });
  }
};

// Add comment
export const addComment = async (req, res) => {
  try {
    // Get project ID from params and comment data from body
    const projectId = req.params.id;
    const { commenterId, name, image, text } = req.body; // Added name and image here

    // Create a new comment object based on the schema
    const newComment = {
      commenterId: commenterId, // Use the commenterId from the request body
      name: name, // Include name from request body
      image: image, // Include image from request body
      text: text, // Use the comment text from the request body
      // likes will default to 0
      // created_at will default to Date.now (if you add it back to schema)
    };

    // Find the project by ID and push the new comment to the comments array
    const project = await Project.findByIdAndUpdate(
      projectId,
      { $push: { comments: newComment } }, // Push the new comment object to the comments array
      { new: true } // Return the updated document
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Return the updated project
    res.json({ project });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update project status by reviewer
export const updateProjectStatus = async (req, res) => {
  try {
    const projectId = req.params.id; // Get project ID from URL parameters
    const { status, reviewedByTeacherId } = req.body; // Get new status and reviewer ID from request body

    // In a real application, you would add authentication/authorization middleware here
    // to ensure only authorized reviewers can change the status.

    // Find the project by ID and update its status and reviewer ID
    const project = await Project.findByIdAndUpdate(
      projectId,
      { status: status, reviewedByTeacherId: reviewedByTeacherId }, // Update status and reviewer ID
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project status updated successfully.', project });
  } catch (error) {
    console.error('Error updating project status:', error);
    res.status(400).json({ message: error.message });
  }
}; 