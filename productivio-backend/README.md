# Productivio Backend

## Overview

The Productivio backend is a RESTful API built with **Node.js** and **Express**. It is designed to serve as the backend for the Productivio platform, which helps users manage their collaborative tasks and journals. The backend is integrated with **Auth0** for secure authentication and utilizes JWT (JSON Web Tokens) for protecting certain routes.

## Features

- **User Authentication**: Secure user sign-in and token management using Auth0.
- **Protected Routes**: Secure access to specific endpoints using JWT tokens.
- **API**: A RESTful API to interact with the front-end for managing user-related data.

## Tech Stack

- **Node.js**: JavaScript runtime used for server-side scripting.
- **Express**: Framework for building REST APIs.
- **Auth0**: Authentication and authorization service used to manage users and protect endpoints.
- **JWT (JSON Web Tokens)**: Used for secure authentication and authorization.
- **Cors**: To allow cross-origin requests.
- **Helmet**: For security headers to protect the app from web vulnerabilities.
- **Compression**: For HTTP response compression.

## Setup & Installation

### Prerequisites

Make sure you have the following installed:

- **Node.js** (version 14.x or later)
- **npm** (Node package manager)

### Steps to Set Up

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/your-repository-url.git
   cd productivio-backend
   ```

2. Install the necessary dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables by creating a `.env` file in the root directory. Example:

   ```env
   AUTH0_DOMAIN=your-auth0-domain
   AUTH0_AUDIENCE=your-auth0-audience
   ```

4. Run the server:

   ```bash
   npm start
   ```

   The backend will be accessible at `http://localhost:8080`.

## Usage

### Protected Routes

Routes under `/v1` are protected and require a valid JWT token in the Authorization header. For example:

- **GET** `/v1/tasks`

  This endpoint will return a message only if the request includes a valid JWT.

  Example of a request with JWT token:

  ```
  Authorization: Bearer <your_jwt_token>
  ```

### Health Check

The API exposes a simple health check endpoint at `/`. You can test the API by navigating to:

```
GET http://localhost:8080/
```

This will return a JSON response with server status, version, and author information.

### Error Handling

In case of errors, the API responds with appropriate HTTP status codes and a JSON error message. For example:

- **404 Not Found**: If the route is not defined.
- **401 Unauthorized**: If the JWT is invalid or missing.
- **500 Internal Server Error**: For general server issues.

### Endpoints

| Method | Route           | Description                                    |
| ------ | --------------- | ---------------------------------------------- |
| GET    | `/`             | Health check endpoint                          |
| GET    | `/api/v1/tasks` | A protected route requiring JWT authentication |

## Development

To run the application in development mode with auto-reload:

```bash
npm run dev
```

This will use **nodemon** to automatically restart the server on file changes.

## Contributing

1. Fork the repository.
2. Clone your fork to your local machine.
3. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. Commit your changes:
   ```bash
   git commit -m "Your commit message"
   ```
5. Push your changes:
   ```bash
   git push origin feature/your-feature-name
   ```
6. Open a pull request from your fork to the main repository.

Please ensure all pull requests are reviewed by a team member before merging.
