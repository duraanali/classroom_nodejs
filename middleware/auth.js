import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Middleware to validate JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    // Get student from database
    const student = await prisma.student.findUnique({
      where: { id: decoded.studentId },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        grade: true,
        major: true,
      },
    });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Invalid token - student not found",
      });
    }

    // Add student info to request
    req.student = student;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
