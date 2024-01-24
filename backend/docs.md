# Project Documentation

## Overview

This is a backend server for a cinema application. It's built with Node.js and Express, and uses MongoDB for data storage. The server provides various endpoints for user registration, login, and movie-related operations.

## Getting Started

### Prerequisites

- Node.js
- npm
- optional: Docker (for running MongoDB)

### Installation

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up `config.env` ([details](#configenv))
4. Start the server with `npm start`

## API Endpoints

- `/register`:Uuser registration
  - **POST** `/register`:  
    Request body: `{ email, firstName, lastName, password }`  
    Response:
    - `201, { message: 'success' }`
    - `400, { message: 'invalid form data' }`
    - `400, { message: 'account with this email already exists' }`
- `/login`: User login
  - **POST** `/login`:  
    Request body: `{ email, password }`  
    Response:
    - `200, { message: 'success', isAdmin: bool, token: 'Bearer <token>' }`
    - `400, { message: 'invalid email or password' }`
    - `404, { message: 'account does not exist' }`
- `/movies`: Fetching all movies
  - **GET** `/movies`:  
    Request body: `{ date: 'YYYY-MM-DD' }` (optional for fetching screenings for a specific day, otherwise today's date is used)  
    Response:
    - `200, [ { title, year, genres: [], director, actors: [], screenings: [], photoUrl, galleryPhotoUrls: [], isCurrentlyScreening } ]`
- `/movie` Operations related to a single movie.

- `/movies`: Operations related to multiple movies.

## Project Structure

## Scripts

- `npm start`: Starts the dev server with nodemon for automatic reloading.

## Dependencies

- `express`: For building the server.
- `cors`: For handling Cross-Origin Resource Sharing (CORS).
- `dotenv`: For loading environment variables from a `.env` file.
- `mongoose`: For MongoDB object modeling.
- `nodemon`: For automatically restarting the server on file changes.
- `jsonwebtoken`: For creating and verifying JWTs.
- `multer`: For handling `multipart/form-data`, used for file upload.
- `cloudinary`: For image hosting.

## config.env

`MONGO_URI` - URI to MongoDB database  
`PORT` - Port on which the app should be served  
`JWT_SECRET` - JSON Web Token secret phrase  
`CLOUDINARY_CLOUD_NAME`,  
`CLOUDINARY_API_KEY`,  
`CLOUDINARY_API_SECRET` - Cloudinary account keys required for uploading images to cloud functionality
`ADMIN_EMAIL` - email address of admin account for managing the app through the website

## Local MongoDB in Docker

You can use below command to set up a local MongoDB Docker container

```sh
docker run -d -p 27017:27017 --name mongo-cinema-database -v cinema-data-vol:/data/db mongo:latest
```
