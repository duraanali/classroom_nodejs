# Student Records System with Authentication and Notes

A simple student records system using Node.js, Express.js, and Prisma for teaching authentication and note management.

## Features

- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Notes Management**: Students can create, read, update, and delete their personal notes
- **Security**: Password hashing and JWT token validation

## Setup

1. Install dependencies:

```bash
npm install
```

2. Set up your database and update the `DATABASE_URL` in your environment variables

3. Generate Prisma client and push schema:

```bash
npm run db:generate
npm run db:push
```

4. Start the server:

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new student
- `POST /api/auth/login` - Login student
- `GET /api/auth/profile` - Get authenticated student's profile

### Notes (Authenticated Students)

- `GET /api/notes` - Get all notes for authenticated student
- `GET /api/notes/:id` - Get specific note by ID
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

## Authentication

### Register a Student

```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "age": 20,
  "grade": "Sophomore",
  "major": "Computer Science"
}
```

**Note**: Only `name`, `email`, and `password` are required. `age`, `grade`, and `major` are optional.

### Login

```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Using Authentication

Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Get Student Profile

```
GET /api/auth/profile
Authorization: Bearer <token>
```

## Notes Management

### Create a Note

```json
POST /api/notes
Authorization: Bearer <token>
{
  "title": "My First Note",
  "content": "This is the content of my note"
}
```

### Get All Notes

```
GET /api/notes
Authorization: Bearer <token>
```

### Update a Note

```json
PUT /api/notes/:id
Authorization: Bearer <token>
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

### Delete a Note

```
DELETE /api/notes/:id
Authorization: Bearer <token>
```

## Database Schema

### Student Model

- `id` (String, Primary Key)
- `name` (String, Required)
- `email` (String, Unique, Required)
- `password` (String, Hashed, Required)
- `age` (Int, Optional)
- `grade` (String, Optional)
- `major` (String, Optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Note Model

- `id` (String, Primary Key)
- `title` (String)
- `content` (String)
- `studentId` (String, Foreign Key)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

## Project Structure

```
classproject_complete/
├── server.js              # Main server file
├── package.json           # Project dependencies
├── README.md             # Project documentation
├── lib/
│   └── prisma.js        # Prisma client configuration
├── prisma/
│   └── schema.prisma    # Database schema
├── middleware/
│   └── auth.js          # Authentication middleware
├── routes/
│   ├── auth.js          # Authentication routes
│   └── notes.js         # Notes routes
└── services/
    └── noteService.js   # Notes business logic
```

## Technologies Used

- Node.js
- Express.js
- Prisma (ORM)
- PostgreSQL
- JWT (JSON Web Tokens)
- bcryptjs (Password Hashing)
- CORS

## Learning Objectives

This project demonstrates:

- RESTful API design
- Authentication and authorization
- Password security with bcrypt
- JWT token management
- Database relationships
- Middleware implementation
- Error handling
- Input validation
- Service layer architecture
