# Awaaz Backend API

This is the backend API for the Awaaz Complaint Management System. It provides endpoints for user authentication, complaint management, and administration.

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Create a .env file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/awaaz_db
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   ```

### Database Seeding

To populate the database with sample data for testing:

```
npm run seed
```

This will create:
- 3 users (1 admin, 2 regular users)
- 20 sample complaints

#### Default Users

1. Admin User:
   - Email: admin@example.com
   - Password: admin123

2. Regular User 1:
   - Email: user1@example.com
   - Password: password123

3. Regular User 2:
   - Email: user2@example.com
   - Password: password123

### Running the Server

Development mode (with hot reload):
```
npm run dev
```

Production mode:
```
npm start
```

The server will start on port 5000 (or the port specified in your .env file).

## API Endpoints

### Authentication

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login a user
- GET `/api/auth/me` - Get current user (requires token)
- PATCH `/api/auth/update-password` - Update password (requires token)

### Users

- GET `/api/users` - Get all users (admin only)
- GET `/api/users/:id` - Get user by ID (admin only)
- PATCH `/api/users/update-profile` - Update user profile (requires token)
- PATCH `/api/users/:id/make-admin` - Make a user admin (admin only)
- DELETE `/api/users/:id` - Delete user (admin only)

### Complaints

- GET `/api/complaints` - Get all complaints (with filtering)
- GET `/api/complaints/:id` - Get complaint by ID
- POST `/api/complaints` - Create a new complaint (requires token)
- PATCH `/api/complaints/:id` - Update complaint (requires token)
- DELETE `/api/complaints/:id` - Delete complaint (requires token)
- POST `/api/complaints/:id/comments` - Add a comment to a complaint (requires token)
- PATCH `/api/complaints/:id/vote` - Vote for a complaint (requires token)
- PATCH `/api/complaints/:id/assign` - Assign complaint to admin/staff (admin only)
- PATCH `/api/complaints/:id/status` - Update complaint status (admin only) 