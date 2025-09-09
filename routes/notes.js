import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  getNotesByStudentId,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from "../services/noteService.js";

const router = express.Router();

// Get all notes for the authenticated student
router.get("/", authenticateToken, async (req, res) => {
  try {
    const notes = await getNotesByStudentId(req.student.id);

    res.json({
      success: true,
      message: "Notes retrieved successfully",
      data: notes,
    });
  } catch (error) {
  
    res.status(500).json({
      success: false,
      message: "Error retrieving notes",
      error: error.message,
    });
  }
});

// Get a specific note by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const note = await getNoteById(id, req.student.id);

    res.json({
      success: true,
      message: "Note retrieved successfully",
      data: note,
    });
  } catch (error) {

    if (error.message === "Note not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Error retrieving note",
      error: error.message,
    });
  }
});

// Create a new note
router.post("/", authenticateToken, async (req, res) => {
  try {
    const newNote = await createNote(req.body, req.student.id);

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: newNote,
    });
  } catch (error) {
    if (error.message === "Title and content are required") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Error creating note",
      error: error.message,
    });
  }
});

// Update a note
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedNote = await updateNote(id, req.body, req.student.id);

    res.json({
      success: true,
      message: "Note updated successfully",
      data: updatedNote,
    });
  } catch (error) {
    if (error.message === "Title and content are required") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    if (error.message === "Note not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Error updating note",
      error: error.message,
    });
  }
});

// Delete a note
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await deleteNote(id, req.student.id);

    res.json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Delete note error:", error);
    if (error.message === "Note not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Error deleting note",
      error: error.message,
    });
  }
});

export default router;
