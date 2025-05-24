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

// Create project
export const createProject = async (req, res) => {
  try {
    const { title, elevatorPitch, collaborators, componentsAndSupplies, toolsAndMachines, appsAndPlatforms, projectDescription, code, downloadableFiles, documentation, noToolsUsed, noFilesToAdd } = req.body;
    const files = req.files; // Files uploaded by Multer

    // Check if a project with the same title already exists
    const existingProject = await Project.findOne({ title });
    if (existingProject) {
      return res.status(400).json({ message: 'A project with this title already exists.' });
    }

    // Helper function to safely parse JSON
    const safeParseJSON = (data) => {
      if (typeof data === 'string') {
        try {
          return JSON.parse(data);
        } catch (e) {
          // console.error('JSON parse error:', e);
          return data;
        }
      }
      return data;
    };

    // Arrays to hold all Cloudinary upload promises
    const uploadPromises = [];

    // Process team/collaborators
    let processedCollaborators = [];
    if (collaborators) {
      const parsedCollaborators = safeParseJSON(collaborators);
      // console.log('Parsed collaborators data before processing:', parsedCollaborators);

      if (Array.isArray(parsedCollaborators)) {
        processedCollaborators = parsedCollaborators.map((member, index) => {
          const teamImageFile = files && files.teamImages && files.teamImages[index];
          if (teamImageFile) {
            // Start upload and push the promise to the array
            const uploadPromise = uploadToCloudinary(teamImageFile, { folder: 'project_team' }).then(result => {
              member.image = result.secure_url; // Update the image URL when upload is complete
            }).catch(error => {
              console.error('Cloudinary upload error for team image:', error);
              member.image = null; // Handle error by setting image to null or similar
            });
            uploadPromises.push(uploadPromise);
          }
          return member; // Return the member object immediately
        });
      }
    }
    // console.log('Processed collaborators array after mapping (promises not yet resolved):', processedCollaborators);

    // Process components and supplies
    let processedComponents = safeParseJSON(componentsAndSupplies) || [];
    if (Array.isArray(processedComponents)) {
      processedComponents = processedComponents.map((item, index) => {
        const componentImageFile = files && files.componentImages && files.componentImages[index];
        if (componentImageFile) {
          const uploadPromise = uploadToCloudinary(componentImageFile, { folder: 'project_components' }).then(result => {
            item.image = result.secure_url;
          }).catch(error => {
            console.error('Cloudinary upload error for component image:', error);
            item.image = null;
          });
          uploadPromises.push(uploadPromise);
        }
        return item;
      });
    }
     // console.log('Processed components array after mapping (promises not yet resolved):', processedComponents);

    // Process downloadable files
    let processedDownloadableFiles = safeParseJSON(downloadableFiles) || [];
    if (Array.isArray(processedDownloadableFiles)) {
      processedDownloadableFiles = processedDownloadableFiles.map((fileItem, index) => {
        const downloadableFile = files && files.downloadableFiles && files.downloadableFiles[index];
        if (downloadableFile) {
          const uploadPromise = uploadToCloudinary(downloadableFile, { folder: 'project_downloads', resource_type: 'raw' }).then(result => {
            fileItem.value = result.secure_url;
          }).catch(error => {
            console.error('Cloudinary upload error for downloadable file:', error);
            fileItem.value = null;
          });
          uploadPromises.push(uploadPromise);
        }
        return fileItem;
      });
    }

    // Process documentation files
    let processedDocumentation = safeParseJSON(documentation) || [];
    if (Array.isArray(processedDocumentation)) {
      processedDocumentation = processedDocumentation.map((docItem, index) => {
        const docFile = files && files.documentationFiles && files.documentationFiles[index];
        if (docFile) {
          const uploadPromise = uploadToCloudinary(docFile, { 
            folder: 'project_documentation',
            resource_type: 'raw'
          }).then(result => {
            docItem.fileUrl = result.secure_url;
            docItem.fileSize = result.bytes;
            docItem.fileName = result.original_filename;
          }).catch(error => {
            console.error('Cloudinary upload error for documentation file:', error);
            docItem.fileUrl = null;
            docItem.fileSize = null;
            docItem.fileName = null;
          });
          uploadPromises.push(uploadPromise);
        }
        return docItem;
      });
    }

    await Promise.all(uploadPromises);

    // Upload cover image (this was already awaited correctly)
    let coverImage = undefined;
    if (files && files.coverImage && files.coverImage[0]) {
      const result = await uploadToCloudinary(files.coverImage[0], { folder: 'project_covers' });
      coverImage = result.secure_url;
    }

    const project = new Project({
      title,
      elevatorPitch,
      coverImage,
      collaborators: processedCollaborators,
      toolsAndMachines: safeParseJSON(toolsAndMachines) || [],
      appsAndPlatforms: safeParseJSON(appsAndPlatforms) || [],
      projectDescription,
      code: safeParseJSON(code) || [],
      documentation: processedDocumentation,
      noToolsUsed,
    });

    const savedProject = await project.save();

    // Transform the saved project into the new format
    const transformedProject = {
      project: {
        title: savedProject.title || "",
        tags: [],
        coverImage: savedProject.coverImage || null,
        elevatorPitch: savedProject.elevatorPitch || "",
        projectDescription: savedProject.projectDescription || "",
        teamMembers: (savedProject.collaborators || []).map(member => ({
          id: member._id?.toString() || "",
          name: member.name || "",
          role: member.role || ""
        })),
        toolsAndMachines: {
          noToolsUsed: savedProject.toolsAndMachines?.noToolsUsed || false,
          tools: (savedProject.toolsAndMachines?.tools || []).map(tool => ({
            name: tool.name || "",
            description: tool.description || "",
            image: tool.image || null
          }))
        },
        appsAndPlatforms: (savedProject.appsAndPlatforms || []).map(app => ({
          title: app.title || "",
          description: app.description || "",
          logo: app.logo || null
        })),
        codeAndDocumentation: {
          repositoryLink: (savedProject.code || []).find(item => item.type === 'repository')?.link || "",
          documentation: savedProject.documentation?.length > 0 ? {
            fileName: savedProject.documentation[0].fileName || "",
            fileSize: savedProject.documentation[0].fileSize || "",
            fileUrl: savedProject.documentation[0].fileUrl || null
          } : {
            fileName: "",
            fileSize: "",
            fileUrl: null
          }
        }
      }
    };

    res.status(201).json(transformedProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update project
export const updateProject = async (req, res) => {
  try {
    const { title, description, collaborators, componentsAndSupplies, toolsAndMachines, appsAndPlatforms, projectDescriptionFull, code, downloadableFiles, documentation, noToolsUsed, noFilesToAdd, status, reviewedByTeacherId } = req.body;
    const files = req.files; // Files uploaded by Multer

    // Arrays to hold all Cloudinary upload promises for update
    const uploadPromises = [];

    // Handle cover image upload for update
    let coverImage = undefined;
    if (files && files.coverImage && files.coverImage[0]) {
      const result = await uploadToCloudinary(files.coverImage[0], { folder: 'project_covers' });
      coverImage = result.secure_url;
    }

    // Process team/collaborators for update
     let processedCollaborators = [];
     if (collaborators) {
       const parsedCollaborators = safeParseJSON(collaborators);
       if (Array.isArray(parsedCollaborators)) {
         processedCollaborators = parsedCollaborators.map((member, index) => {
           const teamImageFile = files && files.teamImages && files.teamImages[index];
           if (teamImageFile) {
             const uploadPromise = uploadToCloudinary(teamImageFile, { folder: 'project_team' }).then(result => {
               member.image = result.secure_url;
             }).catch(error => {
               console.error('Cloudinary upload error for team image:', error);
               member.image = null;
             });
             uploadPromises.push(uploadPromise);
           }
           return member;
         });
       }
     }

   // Process components with images for update
   let processedComponents = safeParseJSON(componentsAndSupplies) || [];
   if (Array.isArray(processedComponents)) {
     processedComponents = processedComponents.map((item, index) => {
         const componentImageFile = files && files.componentImages && files.componentImages[index];
         if (componentImageFile) {
           const uploadPromise = uploadToCloudinary(componentImageFile, { folder: 'project_components' }).then(result => {
            item.image = result.secure_url;
           }).catch(error => {
             console.error('Cloudinary upload error for component image:', error);
             item.image = null;
           });
           uploadPromises.push(uploadPromise);
         }
         return item;
       });
   }

  // Process downloadable files for update
  let processedDownloadableFiles = safeParseJSON(downloadableFiles) || [];
  if (Array.isArray(processedDownloadableFiles)) {
    processedDownloadableFiles = processedDownloadableFiles.map((fileItem, index) => {
        const downloadableFile = files && files.downloadableFiles && files.downloadableFiles[index];
        if (downloadableFile) {
          const uploadPromise = uploadToCloudinary(downloadableFile, { folder: 'project_downloads', resource_type: 'raw' }).then(result => {
           fileItem.value = result.secure_url;
          }).catch(error => {
            console.error('Cloudinary upload error for downloadable file:', error);
            fileItem.value = null;
          });
          uploadPromises.push(uploadPromise);
        }
        return fileItem;
      });
  }

  // Wait for ALL Cloudinary uploads to complete before updating the project
  await Promise.all(uploadPromises);

    const updateData = {
      title,
      description,
      coverImage: coverImage, // Use the uploaded file path/URL here
      // category: req.body.category, // If category is still needed
      collaborators: processedCollaborators, // Use processed team data with image URLs
      componentsAndSupplies: processedComponents, // Use processed components data with image URLs
      toolsAndMachines: safeParseJSON(toolsAndMachines) || [], // Assuming similar processing needed here
      appsAndPlatforms: safeParseJSON(appsAndPlatforms) || [], // Assuming similar processing needed here
      projectDescriptionFull: projectDescriptionFull,
      code: safeParseJSON(code) || [],
      downloadableFiles: processedDownloadableFiles, // Use processed downloadable files data with URLs
      documentation: safeParseJSON(documentation) || [],
      noToolsUsed,
      noFilesToAdd,
      status,
      reviewedByTeacherId,
    };

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ project });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
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