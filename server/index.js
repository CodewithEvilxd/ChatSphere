import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import setupSocket from "./socket.js";
import authRoutes from "./src/routes/auth.routes.js";
import contactsRoutes from "./src/routes/contact.routes.js";
import messageRoutes from "./src/routes/messages.routes.js";
import channelRoutes from "./src/routes/channel.routes.js";


dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(
    cors({
        origin: [process.env.ORIGIN],
        methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());


// routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/channel", channelRoutes);



app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

app.get("/", (req, res) => {
    res.send(`
        <html">
          <head>
            <title>API Status</title>
            <script>
              function updateTime() {
                const date = new Date();
                const idn = new Intl.DateTimeFormat('en-IN', {
                  dateStyle: 'full',
                  timeStyle: 'long',
                  timeZone: 'Asia/Kolkata',
                }).format(date);
                document.getElementById("timestamp").textContent = idn;
              }
              setInterval(updateTime, 1000);
            </script>
          </head>
          <body style="font-family: Arial, sans-serif; background:#999999; color:#000000; text-align: center; width:100%; height:100vh; display:flex; justify-content:center; align-items:center; overflow:hidden;">
            <h1>API is running</h1>
            <p>Status: <strong>success</strong></p>
            <p>Timestamp: <strong id="timestamp">${new Date().toISOString()}</strong></p>
            <img src="https://nexwebsites.com/images/blog/api.png" alt="API Image" style="width:100px; height:100px; margin-top: 20px;">
          </body>
        </html>
      `);
      
});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Success connect to DB");
    } catch (error) {
        console.log(error);
    }
};

app.get('*', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

const server = app.listen(PORT, () => {
    connectDB();

    console.log("Server is running in port " + PORT);
});

setupSocket(server);