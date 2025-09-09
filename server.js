import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

// Import routes
import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/notes.js";

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Basic route for testing
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Student Records System API",
    version: "2.0.0",
    endpoints: {
      auth: "/api/auth",
      notes: "/api/notes",
    },
    features: {
      authentication: "Register and login with JWT",
      notes: "Create, read, update, delete notes (requires authentication)",
    },
    testing: "Use Postman to test the API endpoints",
  });
});

// Mount API routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// 404 handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
  console.log(`📝 Notes API: http://localhost:${PORT}/api/notes`);
});

export default app;
