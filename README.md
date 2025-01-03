# Twitter Clone Backend

This is the backend for a Twitter Clone application. It is built using **Node.js** and **Express** and includes authentication, user management, and tweet handling functionality.

## Features

- **User Authentication**: Secure login and registration using JSON Web Tokens (JWT).
- **Password Hashing**: Passwords are encrypted with bcryptjs for security.
- **Tweet Management**: Create, read, update, and delete tweets.
- **Real-time Updates**: Real-time notifications and updates using Socket.IO.
- **Google OAuth**: Login via Google using Passport.js.
- **Database Integration**: MongoDB is used to store user, tweet, and session data.
- **Environment Configuration**: Environment variables managed with dotenv.
- **Cross-Origin Requests**: CORS is enabled for secure API access.

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: Passport.js, JWT
- **Real-time**: Socket.IO
- **Environment Management**: dotenv
- **HTTP Requests**: Axios

---

## Installation

### Prerequisites

- Node.js installed (version 16 or later recommended)
- MongoDB instance running locally or in the cloud
- A Google Cloud Project with OAuth 2.0 credentials for Google authentication

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/twitter-clone-backend.git
   cd twitter-clone-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```env
   PORT=5000
   MONGO_URI=your-mongodb-uri
   JWT_SECRET=your-jwt-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

4. Start the application:
   - For development:
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```

---

## API Endpoints

### **Authentication**
- `POST /auth/register`: Register a new user.
- `POST /auth/login`: Login and receive a JWT.
- `GET /auth/google`: Login with Google OAuth.

### **Users**
- `GET /users/:id`: Get user profile by ID.
- `PUT /users/:id`: Update user profile.
- `DELETE /users/:id`: Delete user account.

### **Tweets**
- `POST /tweets`: Create a new tweet.
- `GET /tweets`: Get all tweets.
- `GET /tweets/:id`: Get a tweet by ID.
- `PUT /tweets/:id`: Update a tweet.
- `DELETE /tweets/:id`: Delete a tweet.

---

## Scripts

- **`npm start`**: Start the server in production mode.
- **`npm run dev`**: Start the server in development mode with live reload using `nodemon`.
- **`npm run build`**: Placeholder for future build tools.

---

## Dependencies

| Package            | Version  | Description                                |
|--------------------|----------|--------------------------------------------|
| axios              | ^1.7.7   | HTTP client for making API requests.       |
| bcryptjs           | ^2.4.3   | Password hashing library.                  |
| body-parser        | ^1.20.3  | Middleware to parse request bodies.        |
| cors               | ^2.8.5   | Middleware for enabling CORS.              |
| dotenv             | ^16.4.7  | Manage environment variables.              |
| express            | ^4.21.1  | Web framework for Node.js.                 |
| express-session    | ^1.18.1  | Session management middleware.             |
| googleapis         | ^144.0.0 | Google API client library.                 |
| jsonwebtoken       | ^9.0.2   | JWT implementation for authentication.     |
| mongodb            | ^6.11.0  | MongoDB driver for Node.js.                |
| mongoose           | ^8.8.2   | ODM for MongoDB.                           |
| passport           | ^0.7.0   | Authentication middleware.                 |
| passport-google-oauth20 | ^2.0.0 | Google OAuth 2.0 strategy for Passport.   |

---

## Dev Dependencies

| Package   | Version  | Description                                |
|-----------|----------|--------------------------------------------|
| nodemon   | ^3.1.7   | Development tool for live-reloading server.|
| socket.io | ^4.8.1   | Real-time communication library.           |

---

## Folder Structure

```
twitter-clone-backend/
├── src/
│   ├── controllers/    # Logic for handling requests
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── utils/          # Helper functions
│   ├── index.js        # Entry point of the app
├── .env                # Environment variables
├── package.json        # Project configuration
├── README.md           # Project documentation
```

---

## Future Enhancements

- Add a notification system for user interactions.
- Implement advanced search and filtering for tweets.
- Enable image and video uploads.
- Add rate-limiting and API throttling for security.

---

## Contributing

1. Fork the repository.
2. Create a new branch for your feature/bugfix.
3. Commit your changes.
4. Push the branch and create a pull request.

---

## License

This project is licensed under the **ISC License**.
