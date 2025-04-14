# Project Technical Documentation

## Project Overview
**Project Name**: Productivio  
**Platform**: Web  
**Technology Stack**:  
- **Frontend**: Next.js, React, Tailwind CSS  
- **Backend**: Next.js API routes  
- **Authentication**: Auth0  
- **Database**: MongoDB (via Mongoose)  
- **Email**: SendGrid for email sending  
- **Hosting**: Vercel (for frontend)  

**Project Purpose**:  
Productivio is a productivity platform designed to streamline team collaboration. It offers functionalities for managing teams, tasks, and team members. The app provides a user-friendly interface with the ability to send invites, manage users, and track team activities.

## Architecture Overview
The application follows a **Client-Server Architecture**:
- **Frontend**: Built with Next.js, React, and Tailwind CSS, the frontend is designed to be highly responsive and modern, with pages to handle team management, task tracking, and user authentication.
- **Backend**: API routes within Next.js handle all backend logic, including user authentication (via Auth0), task management, and email invitations (via SendGrid).
- **Database**: MongoDB is used for persistent data storage, with collections for users, teams, tasks, and lists. Mongoose is used to interact with the database.

## Core Features
1. **User Authentication**:  
   - Users can sign up and log in using Auth0.

2. **Team Management**:  
   - Users can create and manage teams.
   - Admins can invite others to join teams.
   - Admins can remove members or transfer ownership of a team.

3. **Task Management**:  
   - Users can create, assign, and manage tasks.
   - Tasks can be assigned to users with due dates, priorities, and other relevant details.

4. **Email Notifications**:  
   - SendGrid is used for sending email invitations to users.
   - The platform sends emails for task assignments, team invitations, and other key notifications.

## Technologies Used
### Frontend
- **Next.js**: A React-based framework for building server-rendered applications.
- **React**: JavaScript library for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for building custom designs.
- **Auth0**: Authentication and authorization service for secure login functionality.
  
### Backend (API routes in Next.js)
- **Next.js API Routes**: Handles backend operations for user management, team management, task creation, and email notifications.
- **SendGrid**: Email service provider used for sending email invitations and notifications.
- **MongoDB**: NoSQL database used to store application data.
- **Mongoose**: MongoDB object modeling tool used for database interactions.

### Deployment
- **Vercel**: The application is deployed using Vercel, providing seamless integration with Next.js for automatic serverless deployment.
- **MongoDB Atlas**: Managed cloud database solution for MongoDB hosting.

## Authentication
- **Auth0** is used to handle authentication. Users authenticate using Auth0's Universal Login UI.
- Auth0 JWT tokens are used for secure API communication.

## Database Design
### Collections
1. **User**:
   - Fields: `_id`, `email`, `profilePicture`, `connection` (auth0 or google-oauth2), `tasks` (array of task IDs), `lists` (array of list IDs), `teams` (array of team IDs)
2. **Team**:
   - Fields: `_id`, `title`, `description`, `admin` (user ID), `members` (array of user IDs), `tasks` (array of task IDs)
3. **Task**:
   - Fields: `_id`, `title`, `description`, `assignedTo` (user ID), `createdBy` (user ID), `list` (list ID), `team` (team ID), `isCompleted`, `isTrash`, `dueDate`, `priority`
4. **List**:
   - Fields: `_id`, `name`, `emoji`, `tasks` (array of task IDs), `createdBy` (user ID)


## Environment Variables

### Authentication (Auth0)
- `AUTH0_SECRET`: Secret key used by Auth0 for signing and verifying JWT tokens.
- `AUTH0_BASE_URL`: The base URL of the application, used for authentication redirects.
- `AUTH0_ISSUER_BASE_URL`: The Auth0 domain used for OAuth authentication.
- `AUTH0_DOMAIN`: The domain of your Auth0 tenant.
- `AUTH0_CLIENT_ID`: The client ID of your Auth0 application.
- `AUTH0_CLIENT_SECRET`: The client secret for your Auth0 application.
- `AUTH0_AUDIENCE`: The API audience used by Auth0 for validating tokens.
- `AUTH0_API_IDENTIFIER`: The unique identifier for the Auth0 API.
- `AUTH0_SCOPE`: Scopes required for Auth0 authentication (usually includes `openid`, `profile`, `email`).

### Database (MongoDB)
- `MONGO_URI`: MongoDB connection string for connecting to the MongoDB Atlas cluster.

### Application URLs
- `NEXT_PUBLIC_APP_URL`: The URL of the application (usually for the frontend).
- `NEXT_PUBLIC_AUTH0_DOMAIN`: The domain of your Auth0 authentication provider for frontend usage.
- `NEXT_PUBLIC_AUTH0_CLIENT_ID`: The client ID used by the frontend for Auth0 authentication.

### Email
- `SENDGRID_API_KEY`: API key for sending emails using SendGrid.
- `PRODUCTIVIO_EMAIL`: Email address used for sending system emails (e.g., invitation emails) (email used for SendGrid account).


## Key Endpoints
### Authentication
- **POST /api/auth/login**: Logs the user in using Auth0.
- **POST /api/auth/logout**: Logs the user out.

### User
- **GET /api/users**: Fetch all users.
- **POST /api/users**: Create a new user (via Auth0).
- **GET /api/users/:id**: Fetch a specific user's details.

### Team
- **POST /api/teams**: Create a new team.
- **GET /api/teams/:id**: Fetch a specific team's details.
- **PATCH /api/teams/:id**: Update team information (e.g., add/remove members).

### Task
- **POST /api/tasks**: Create a new task.
- **GET /api/tasks/:id**: Fetch a specific task's details.
- **PATCH /api/tasks/:id**: Update task details, including assignment and due dates.

## Error Handling
- Custom error messages are returned with status codes indicating the type of error (e.g., 400 for client errors, 500 for server errors).

## Testing and Validation
- **Unit Tests**: Tests are written using Jest for both frontend and backend components.
- **Validation**: All user inputs are validated both client-side (using React validation) and server-side (using Mongoose schema validation).

## Performance Optimization
- API routes are optimized to minimize database queries by using Mongoose population and indexing where necessary.
- Static pages are generated using Next.js's built-in `getStaticProps` and `getServerSideProps`.

## Future Enhancements
- **Task Reminders**: Adding notifications for tasks nearing their due dates.
- **Team Analytics**: Providing insights into team performance and activity.
- **Multi-language Support**: Translating the application for international users.

## Conclusion
This document provides a comprehensive overview of the technical architecture, features, technologies, and deployment of the Productivio project. It serves as a guideline for future development and helps onboard new developers to the project.
