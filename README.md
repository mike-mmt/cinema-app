# OmniKino - cinema web app

A full stack web application for a cinema, created using React (TypeScript with Vite), Express (Node.js) and MongoDB. The app allows users to view movies, register and log in to an account and book tickets by choosing seats for a specific showing. It also includes an admin account for managing movies, showings and checking sales statistics. The app uses Tailwind CSS for styling, JWT for authentication and Cloudinary for image storage.

The site is currently deployed and available to use at [omnikino.onrender.com](https://omnikino.onrender.com/).

## Installation

`npm install` in both frontend and backend directories to install dependencies.

`npm start` in the backend directory to start the server.

`npm run dev` in the frontend directory to start the React frontend, or `npm run build` to build the frontend for production.

The app requires a MongoDB database and a Cloudinary account to store images.

Refer to [Environment Variables](#environment-variables) for the required environment variables.

## Usage

The app is straightforward to use. To access admin functionality, create a new account using the admin email specified in the environment variables.

## Environment Variables

### Backend

config.env:\
`MONGO_URI` - MongoDB connection string.\
`PORT`- Port for the server to listen on.\
`JWT_SECRET` - Secret for JWT token.\
`CLOUDINARY_URL`, `CLOUDINARY_CLOUD_NAME`,
`CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` - Cloudinary account details.\
`ADMIN_EMAIL` - Email for the admin account.\
`DEV` - Set to `true` to skip JWT authentication for development purposes.

### Frontend

.env:\
`VITE_BACKEND_URL` - URL for the backend server.
