# Installation Packages and Instructions

## Prerequisites

Before installing and running the project, make sure you have the following installed on your system:

1. **Node.js** (v16.x.x or higher) - [Download Node.js](https://nodejs.org/en/download/)
2. **MongoDB** (if running locally) - [MongoDB Download Center](https://www.mongodb.com/try/download/community)
3. **Git** - [Download Git](https://git-scm.com/downloads)

You will also need access to the following services:

- **Auth0 Account** for authentication.
- **SendGrid Account** for sending emails.

## Installation Steps

### 1. Clone the Repository

First, clone the repository to your local machine using Git.

```bash
git clone https://github.com/sunchit03/PRJ666NAA-G6.git

cd productivio-frontned-restructured
```

## Install Dependencies
```bash
npm install
```
This will install all the necessary packages listed in `package.json`.


## Configure Environment Variables
Create a `.env` file in the root of your project and add the following:

```ini
# Auth0 Configuration
AUTH0_SECRET='your-auth0-secret'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://your-auth0-domain'
AUTH0_DOMAIN='your-auth0-domain'
AUTH0_CLIENT_ID='your-auth0-client-id'
AUTH0_CLIENT_SECRET='your-auth0-client-secret'
AUTH0_AUDIENCE='https://your-api-audience'
AUTH0_API_IDENTIFIER='https://your-api-identifier'
AUTH0_SCOPE='openid profile email'

# Database Configuration
MONGO_URI='your-mongo-uri'
JWT_SECRET='your-jwt-secret'

# Frontend Configuration
NEXT_PUBLIC_APP_URL='http://localhost:3000'
NEXT_PUBLIC_AUTH0_DOMAIN='your-auth0-domain'
NEXT_PUBLIC_AUTH0_CLIENT_ID='your-auth0-client-id'

# Email Service
SENDGRID_API_KEY='your-sendgrid-api-key'
PRODUCTIVIO_EMAIL='your-email-address'
```
Important: Never commit your `.env` file to version control. Add it to `.gitignore`.


## Set Up MongoDB
### Local MongoDB:
Ensure MongoDB is installed and running:
```bash
mongod
```
### MongoDB Atlas:
1. Create a free-tier cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Copy the connection string and update `MONGO_URI` in the `.env` file.


## Set Up Auth0
1. Create an account at [Auth0](https://auth0.com/).
2. Create a new application in the Auth0 dashboard.
3. Copy and update the `.env` file with:
   - **AUTH0_SECRET** (generate via Auth0 dashboard)
   - **AUTH0_CLIENT_ID & AUTH0_CLIENT_SECRET** (found in application settings)
   - **AUTH0_DOMAIN** (your Auth0 tenant domain)
   - **AUTH0_AUDIENCE** (your API audience)


## Set Up SendGrid
1. Create an account at [SendGrid](https://sendgrid.com/).
2. Obtain your SendGrid API Key and update the `.env` file.

## Running the Project Locally
Start the development server:
```bash
npm run dev
```
The app will be available at **[http://localhost:3000](http://localhost:3000)**.


## Running the Project in Production
### Build for Production:
```bash
npm run build
```
### Start the Production Server:
```bash
npm start
```
Ensure all production environment variables are set correctly.


## Testing the Application
Navigate to **[http://localhost:3000](http://localhost:3000)** and verify:
- Authentication works
- MongoDB connection is successful


## Stopping the Application
To stop the application, press **`Ctrl + C`** in the terminal.


## Troubleshooting
- **Environment Variables Not Loading?** Ensure they are correctly set.
- **MongoDB Connection Fails?** Verify `MONGO_URI` and MongoDB status.
- **Auth0 Authentication Issues?** Double-check `.env` configurations.
- **Emails Not Sending?** Verify SendGrid API key.


## Deployment Options
Deploy using:
- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [Heroku](https://www.heroku.com/)
- Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for cloud-based MongoDB.


## Conclusion
You should now have the application running locally or in production. If you face any issues, check the logs or seek support.


