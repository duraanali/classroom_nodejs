# Student Records System API Documentation

## Overview

The Student Records System API is a RESTful web service built with Node.js, Express.js, and Prisma. It provides authentication and note management functionality for students.

**Base URL:** `https://classroom-nodejs.onrender.com` (or your deployed server URL)

## Table of Contents

1. [Authentication](#authentication)
2. [Data Models](#data-models)
3. [Error Handling](#error-handling)
4. [Authentication Endpoints](#authentication-endpoints)
5. [Notes Endpoints](#notes-endpoints)
6. [Environment Variables](#environment-variables)
7. [Testing with Postman](#testing-with-postman)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Most endpoints require a valid JWT token in the Authorization header.

### Authentication Header Format

```
Authorization: Bearer <your-jwt-token>
```

### Token Details

- **Token Type:** JWT
- **Expiration:** 24 hours
- **Payload:** Contains `studentId` field

## Data Models

### Student Model

```json
{
  "id": "string (cuid)",
  "name": "string",
  "email": "string (unique)",
  "password": "string (hashed)",
  "age": "integer (optional)",
  "grade": "string (optional)",
  "major": "string (optional)",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Note Model

```json
{
  "id": "string (cuid)",
  "title": "string",
  "content": "string",
  "studentId": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

## Error Handling

All API responses follow a consistent format:

### Success Response Format

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    /* response data */
  }
}
```

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (development only)"
}
```

### HTTP Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Authentication Endpoints

### 1. Register a New Student

**Endpoint:** `POST /api/auth/register`

**Description:** Creates a new student account and returns a JWT token.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "age": 20,
  "grade": "A",
  "major": "Computer Science"
}
```

**Required Fields:** `name`, `email`, `password`
**Optional Fields:** `age`, `grade`, `major`

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Student registered successfully",
  "data": {
    "student": {
      "id": "clx1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "age": 20,
      "grade": "A",
      "major": "Computer Science",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

- `400` - Missing required fields or email already exists
- `500` - Server error

### 2. Login Student

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticates a student and returns a JWT token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Required Fields:** `email`, `password`

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "student": {
      "id": "clx1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "age": 20,
      "grade": "A",
      "major": "Computer Science",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

- `400` - Missing email or password
- `401` - Invalid credentials
- `500` - Server error

### 3. Get Student Profile

**Endpoint:** `GET /api/auth/profile`

**Description:** Retrieves the authenticated student's profile information.

**Authentication:** Required (JWT token)

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "student": {
      "id": "clx1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "age": 20,
      "grade": "A",
      "major": "Computer Science"
    }
  }
}
```

**Error Responses:**

- `401` - Missing or invalid token
- `500` - Server error

## Notes Endpoints

All notes endpoints require authentication. Students can only access their own notes.

### 1. Get All Notes

**Endpoint:** `GET /api/notes`

**Description:** Retrieves all notes for the authenticated student.

**Authentication:** Required (JWT token)

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Notes retrieved successfully",
  "data": [
    {
      "id": "note123456789",
      "title": "My First Note",
      "content": "This is the content of my first note.",
      "studentId": "clx1234567890",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Error Responses:**

- `401` - Missing or invalid token
- `500` - Server error

### 2. Get Note by ID

**Endpoint:** `GET /api/notes/:id`

**Description:** Retrieves a specific note by ID for the authenticated student.

**Authentication:** Required (JWT token)

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**URL Parameters:**

- `id` (string, required) - The note ID

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Note retrieved successfully",
  "data": {
    "id": "note123456789",
    "title": "My First Note",
    "content": "This is the content of my first note.",
    "studentId": "clx1234567890",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

- `401` - Missing or invalid token
- `404` - Note not found
- `500` - Server error

### 3. Create a New Note

**Endpoint:** `POST /api/notes`

**Description:** Creates a new note for the authenticated student.

**Authentication:** Required (JWT token)

**Headers:**

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "My New Note",
  "content": "This is the content of my new note."
}
```

**Required Fields:** `title`, `content`

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Note created successfully",
  "data": {
    "id": "note123456789",
    "title": "My New Note",
    "content": "This is the content of my new note.",
    "studentId": "clx1234567890",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

- `400` - Missing title or content
- `401` - Missing or invalid token
- `500` - Server error

### 4. Update a Note

**Endpoint:** `PUT /api/notes/:id`

**Description:** Updates an existing note for the authenticated student.

**Authentication:** Required (JWT token)

**Headers:**

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**URL Parameters:**

- `id` (string, required) - The note ID

**Request Body:**

```json
{
  "title": "Updated Note Title",
  "content": "This is the updated content of my note."
}
```

**Required Fields:** `title`, `content`

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Note updated successfully",
  "data": {
    "id": "note123456789",
    "title": "Updated Note Title",
    "content": "This is the updated content of my note.",
    "studentId": "clx1234567890",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Error Responses:**

- `400` - Missing title or content
- `401` - Missing or invalid token
- `404` - Note not found
- `500` - Server error

### 5. Delete a Note

**Endpoint:** `DELETE /api/notes/:id`

**Description:** Deletes a note for the authenticated student.

**Authentication:** Required (JWT token)

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**URL Parameters:**

- `id` (string, required) - The note ID

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

**Error Responses:**

- `401` - Missing or invalid token
- `404` - Note not found
- `500` - Server error

## Environment Variables

The following environment variables should be configured:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/student_records"

# JWT Secret (required for production)
JWT_SECRET="your-super-secret-jwt-key"

# Server Port (optional, defaults to 3000)
PORT=3000

# Environment (optional)
NODE_ENV="development"
```

## Testing with Postman

### Setting Up Postman

1. **Create a new Collection** named "Student Records API"
2. **Set up Environment Variables:**
   - `baseUrl`: `http://localhost:3000`
   - `token`: (will be set after login)

### Authentication Flow

#### Step 1: Register a New Student

- **Method:** POST
- **URL:** `{{baseUrl}}/api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "age": 20,
  "grade": "A",
  "major": "Computer Science"
}
```

- **Save the token** from the response to your environment variable `token`

#### Step 2: Login (Alternative to registration)

- **Method:** POST
- **URL:** `{{baseUrl}}/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

- **Save the token** from the response to your environment variable `token`

#### Step 3: Get Profile

- **Method:** GET
- **URL:** `{{baseUrl}}/api/auth/profile`
- **Headers:** `Authorization: Bearer {{token}}`

### Notes Operations

#### Get All Notes

- **Method:** GET
- **URL:** `{{baseUrl}}/api/notes`
- **Headers:** `Authorization: Bearer {{token}}`

#### Get Note by ID

- **Method:** GET
- **URL:** `{{baseUrl}}/api/notes/{{noteId}}`
- **Headers:** `Authorization: Bearer {{token}}`
- **Note:** Replace `{{noteId}}` with an actual note ID from your database

#### Create a New Note

- **Method:** POST
- **URL:** `{{baseUrl}}/api/notes`
- **Headers:**
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **Body (raw JSON):**

```json
{
  "title": "My First Note",
  "content": "This is the content of my first note."
}
```

#### Update a Note

- **Method:** PUT
- **URL:** `{{baseUrl}}/api/notes/{{noteId}}`
- **Headers:**
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **Body (raw JSON):**

```json
{
  "title": "Updated Note Title",
  "content": "This is the updated content of my note."
}
```

#### Delete a Note

- **Method:** DELETE
- **URL:** `{{baseUrl}}/api/notes/{{noteId}}`
- **Headers:** `Authorization: Bearer {{token}}`

### Postman Tips

1. **Environment Variables:** Use `{{variableName}}` syntax to reference environment variables
2. **Pre-request Scripts:** You can add scripts to automatically extract tokens from responses
3. **Tests:** Add tests to verify response status codes and data structure
4. **Collection Runner:** Use the collection runner to test all endpoints in sequence

## Additional Information

### Security Features

- Password hashing using bcryptjs (10 salt rounds)
- JWT token authentication
- CORS enabled for all routes
- Input validation for required fields
- Student isolation (students can only access their own notes)

### CORS

CORS is enabled for all routes. For production, consider configuring specific origins.

### Error Logging

Errors are logged to the console. Consider implementing proper logging for production use.

---

**Last Updated:** September 2025
