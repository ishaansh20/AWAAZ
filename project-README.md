# Awaaz - Complaint Management System

Awaaz is a comprehensive complaint management system that allows users to submit, track, and manage their complaints. The system includes user authentication, complaint submission and tracking, admin dashboard, and more.

## Project Structure

The project is divided into two main parts:

1. **Frontend**: A React application built with Vite, React Router, and TailwindCSS
2. **Backend**: A Node.js API built with Express, MongoDB, and JWT authentication

## Features

- User authentication (register, login, profile management)
- Submit and track complaints
- View and filter complaints
- Comment on complaints
- Vote for complaints
- Admin dashboard for managing complaints and users
- Responsive design for mobile and desktop

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/awaaz_db
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   ```

4. Seed the database with sample data (optional):
   ```
   npm run seed
   ```

5. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the project root directory.

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

## Default Accounts (After Seeding)

### Admin Account
- Email: admin@example.com
- Password: admin123

### Regular User Accounts
- Email: user1@example.com
- Password: password123

- Email: user2@example.com
- Password: password123

## Deployment

### Backend
The backend can be deployed to services like:
- Heroku
- Railway
- DigitalOcean
- AWS

### Frontend
The frontend can be deployed to services like:
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

## Technologies Used

### Frontend
- React
- React Router
- TailwindCSS
- Axios
- Vite

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing

## License

This project is licensed under the MIT License. 