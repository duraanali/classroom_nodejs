import prisma from "../lib/prisma.js";

// Get all notes for a specific student
export async function getNotesByStudentId(studentId) {
  try {
    return await prisma.note.findMany({
      where: {
        studentId: studentId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    throw new Error("Error fetching notes");
  }
}

// Get a specific note by ID for a student
export async function getNoteById(noteId, studentId) {
  try {
    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        studentId: studentId,
      },
    });

    if (!note) {
      throw new Error("Note not found");
    }

    return note;
  } catch (error) {
    throw error;
  }
}

// Create a new note for a student
export async function createNote(noteData, studentId) {
  try {
    const { title, content } = noteData;

    // Basic validation
    if (!title || !content) {
      throw new Error("Title and content are required");
    }

    return await prisma.note.create({
      data: {
        title,
        content,
        studentId: studentId,
      },
    });
  } catch (error) {
    throw error;
  }
}

// Update a note for a student
export async function updateNote(noteId, updateData, studentId) {
  try {
    const { title, content } = updateData;

    // Basic validation
    if (!title || !content) {
      throw new Error("Title and content are required");
    }

    // Check if note exists and belongs to the student
    const existingNote = await prisma.note.findFirst({
      where: {
        id: noteId,
        studentId: studentId,
      },
    });

    if (!existingNote) {
      throw new Error("Note not found");
    }

    return await prisma.note.update({
      where: { id: noteId },
      data: {
        title,
        content,
      },
    });
  } catch (error) {
    throw error;
  }
}

// Delete a note for a student
export async function deleteNote(noteId, studentId) {
  try {
    // Check if note exists and belongs to the student
    const existingNote = await prisma.note.findFirst({
      where: {
        id: noteId,
        studentId: studentId,
      },
    });

    if (!existingNote) {
      throw new Error("Note not found");
    }

    await prisma.note.delete({
      where: { id: noteId },
    });

    return existingNote;
  } catch (error) {
    throw error;
  }
}
