# HotTakes - Technical Documentation

## Overview

HotTakes is a web application designed for users to share and review spicy sauces. The project is divided into two main parts: the **back-end**, which provides a secure API connected to a NoSQL database, and the **front-end**, which offers a user-friendly interface for interacting with the application.

---

## Back-End

The back-end is built with **Node.js**, **Express.js**, and **Mongoose** with MongoDB. It provides a RESTful API for managing user accounts, sauces, and user interactions (likes/dislikes). The back-end ensures secure data handling and authentication.

### Key Features:
- **User Authentication**: Users can sign up and log in securely using hashed passwords and JSON Web Tokens (JWT).
- **Sauce Management**: Authenticated users can:
  - Add new sauces with details such as name, manufacturer, description, and an image.
  - Modify or delete sauces they created.
  - Like or dislike sauces.
- **File Uploads**: Images for sauces are uploaded and stored on the server using the `multer` middleware.
- **Data Validation**: Input data is validated to ensure consistency and security.
- **Database**: The application uses **MongoDB** for storing user and sauce data.

### API Endpoints:
- **Authentication**:
  - `POST /api/auth/signup`: Create a new user account.
  - `POST /api/auth/login`: Log in and receive a token.
- **Sauces**:
  - `GET /api/sauces`: Retrieve all sauces.
  - `GET /api/sauces/:id`: Retrieve a specific sauce.
  - `POST /api/sauces`: Add a new sauce (requires authentication and file upload).
  - `PUT /api/sauces/:id`: Modify an existing sauce (requires authentication).
  - `DELETE /api/sauces/:id`: Delete a sauce (requires authentication).
  - `POST /api/sauces/:id/like`: Like or dislike a sauce.

### Installation:
1. Navigate to the `back-end` directory.
2. Install dependencies:
   ```sh
   npm install
    ```
3. Start the server:
4. ```sh
   npx nodemon server.js
   ```
5. The server will run on `http://localhost:3000` by default.
6. Ensure MongoDB is running and connected to the application.
7. Use Postman or similar tools to test the API endpoints.
8. For production, ensure to set environment variables for sensitive data (e.g., JWT secret, MongoDB URI).

## Front-End
The front-end is built with Angular and provides an intuitive interface for users to interact with the application.

### Key Features:
**Responsive Design**: The interface is optimized for both desktop and mobile devices.
**Sauce Management**: Users can view, add, modify, and delete sauces.
**Authentication**: Users must log in to access the full functionality of the app.
**Real-Time Updates**: The app reloads automatically when changes are made.

### Installation:
1. Navigate to the ui directory.
2. Install dependencies:
    ```sh
    npm install
    npm install --save-dev run-script-os
    ```
3. Start the development server:
    ```sh
    npm start
    ```
5. The front-end will run on `http://localhost:8080` by default.
6. Open your browser and navigate to http://localhost:8080.
7. Ensure the back-end server is running and accessible.

## Technologies Used
### Back-End:
- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer
- JSON Web Tokens (JWT)
- bcrypt

### Front-End:
- Angular
- TypeScript
- SCSS

## How to Contribute
Feel free to fork this repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

### License
This project is licensed under the MIT License.