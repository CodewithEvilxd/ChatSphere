<p align="center">
  <a href="https://github.com/codewithEvilxd/ChatSphere/tree/main">
    <img src="https://github.com/codewithEvilxd/ChatSphere/blob/main/client/public/vite.svg" height="96">
    <h3 align="center">ChatSphere: Realtime Chat Application</h3>
  </a>
</p>

# ChatSphere

## Overview
ChatSphere is a Realtime Chat Application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It features message channels, direct messaging, emoji support, file uploads, and real-time interactions.

## Features
- Realtime Messaging
- Message Channels & Direct Messages
- Emoji Support
- File Uploads and Downloads
- Responsive UI

## Dependencies

### Frontend
- **vite**: For building and bundling the application
- **react-router-dom**: For routing
- **tailwindcss**: For styling
- **fetch**: For making HTTP requests
- **context API**: For state management
- **Socket.IO**: For real-time communication
- **Redux Toolkit**: For state management
- **cookie**: For authentication

### Backend
- **express**: For creating the server
- **mongoose**: For interacting with MongoDB
- **cors**: For handling Cross-Origin Resource Sharing
- **dotenv**: For managing environment variables
- **zod**: For user validation
- **bcryptjs**: For hashing passwords
- **jsonwebtoken**: For authentication
- **nodemon**: For automatic server restarts during development



## Environment Variables

### Client (.env file)
```bash
VITE_API_URL="http://localhost:3000"
```

### Server (.env file)
```bash
PORT=3000
ORIGIN="http://localhost:5173"
DATABASE_URL=
JWT_KEY=""
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```



## Setup Instructions
1. **Clone the repository:**
   ```bash
   git clone https://github.com/codewithEvilxd/ChatSphere.git
   cd ChatSphere

2. **Install dependencies for backend:**
   ```bash
    cd server
    npm install
3. **Install dependencies for frontend:**
   ```bash
    cd ../client
    npm install

4. **Run the application:**
    - **Start the backend server:**
      ```bash
          cd server
          npm start
    - **Start the frontend development server:**
      ```bash
        cd ../client
        npm start
## Technologies Used

- **MongoDB**: Database
- **Express.js**: Web framework for Node.js
- **React.js**: Frontend library
- **Node.js**: JavaScript runtime
- **Vite**: Development server and build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Socket.IO**: Real-time communication



## Deployment

Deploy the `dist` directory from the `client` folder to your hosting platform of choice. Ensure that your backend server is also deployed and properly configured.

