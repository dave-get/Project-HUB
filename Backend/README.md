# Project HUB Backend

A backend API for managing projects with detailed information, components, tools, and discussions.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/project-hub
NODE_ENV=development
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Projects

- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get a single project
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

### Additional Functionality

- `POST /api/projects/:id/view` - Increment project views
- `POST /api/projects/:id/like` - Add a like to a project
- `POST /api/projects/:id/comment` - Add a comment to a project

## Project Schema

The project schema includes:
- Basic information (title, category, description)
- Card image
- View count, likes count, and comments count
- Collaborators
- Detailed description with:
  - Components
  - Tools
  - Apps
  - Code repository information
  - Documentation
  - Discussion/comments

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- CORS for cross-origin requests
- Environment variables with dotenv