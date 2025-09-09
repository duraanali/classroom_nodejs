import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// Register a new student
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, age, grade, major } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // Check if student already exists
    const existingStudent = await prisma.student.findUnique({
      where: { email },
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student with this email already exists",
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new student
    const newStudent = await prisma.student.create({
      data: {
        name,
        email,
        password: hashedPassword,
        age: age ? parseInt(age) : null,
        grade: grade || null,
        major: major || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        grade: true,
        major: true,
        createdAt: true,
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { studentId: newStudent.id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      data: {
        student: newStudent,
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Error registering student",
      error: error.message,
    });
  }
});

// Login student
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find student by email
    const student = await prisma.student.findUnique({
      where: { email },
    });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, student.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { studentId: student.id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    // Return student data (without password) and token
    const { password: _, ...studentData } = student;

    res.json({
      success: true,
      message: "Login successful",
      data: {
        student: studentData,
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error during login",
      error: error.message,
    });
  }
});

// Get student profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    // The student data is already available from the authenticateToken middleware
    // No need to query the database again since we have the student info in req.student

    res.json({
      success: true,
      message: "Profile retrieved successfully",
      data: {
        student: req.student,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving profile",
      error: error.message,
    });
  }
});

export default router;
