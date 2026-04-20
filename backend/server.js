import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";

// Routes
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";

dotenv.config();

const app = express();

// ======================
// MIDDLEWARE
// ======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================
// CORS CONFIG
// ======================
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://thefolioproject-7lod.vercel.app"
    ],
    credentials: true,
  })
);

// ======================
// STATIC FILES (UPLOADS)
// ======================
app.use("/uploads", express.static("uploads"));

// ======================
// ROUTES
// ======================
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// ======================
// HEALTH CHECK
// ======================
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ======================
// DATABASE CONNECTION
// ======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });