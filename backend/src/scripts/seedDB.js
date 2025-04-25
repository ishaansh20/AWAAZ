import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
import Complaint from '../models/complaintModel.js';
import config from '../config/config.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(config.mongodbUri)
  .then(() => console.log('MongoDB connected for seeding...'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample data
const users = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    phoneNumber: '9876543210',
    address: 'Admin Office'
  },
  {
    username: 'user1',
    email: 'user1@example.com',
    password: 'password123',
    role: 'user',
    phoneNumber: '1234567890',
    address: '123 Main St'
  },
  {
    username: 'user2',
    email: 'user2@example.com',
    password: 'password123',
    role: 'user',
    phoneNumber: '9876543211',
    address: '456 Elm St'
  }
];

const categories = [
  'Electricity',
  'Water Supply',
  'Road',
  'Garbage Collection',
  'Public Transport',
  'Healthcare',
  'Education',
  'Others'
];

const statuses = ['pending', 'in-progress', 'resolved', 'rejected'];
const priorities = ['low', 'medium', 'high'];

// Function to create sample complaints
const createSampleComplaints = async (userIds) => {
  const complaints = [];

  for (let i = 0; i < 20; i++) {
    complaints.push({
      title: `Sample Complaint ${i + 1}`,
      description: `This is a sample complaint description for testing purposes. This is complaint number ${i + 1}.`,
      category: categories[Math.floor(Math.random() * categories.length)],
      location: `Location ${i + 1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      user: userIds[Math.floor(Math.random() * userIds.length)],
      votes: Math.floor(Math.random() * 50)
    });
  }

  return complaints;
};

// Seed function
const seedDB = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Complaint.deleteMany({});
    console.log('Previous data cleared');

    // Create users
    const createdUsers = [];
    for (const user of users) {
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(user.password, 12);
      const newUser = await User.create({
        ...user,
        password: hashedPassword
      });
      createdUsers.push(newUser);
    }
    console.log(`${createdUsers.length} users created`);

    // Get user IDs
    const userIds = createdUsers.map(user => user._id);

    // Create complaints
    const complaints = await createSampleComplaints(userIds);
    const createdComplaints = await Complaint.insertMany(complaints);
    console.log(`${createdComplaints.length} complaints created`);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed function
seedDB(); 