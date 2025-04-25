import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for your complaint'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters long'],
      maxlength: [100, 'Title must not exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a description for your complaint'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters long']
    },
    category: {
      type: String,
      required: [true, 'Please select a category for your complaint'],
      enum: [
        'Electricity',
        'Water Supply',
        'Road',
        'Garbage Collection',
        'Public Transport',
        'Healthcare',
        'Education',
        'Others'
      ]
    },
    location: {
      type: String,
      required: [true, 'Please provide the location of the issue']
    },
    images: [
      {
        type: String
      }
    ],
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'resolved', 'rejected'],
      default: 'pending'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A complaint must belong to a user']
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    votes: {
      type: Number,
      default: 0
    },
    voters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        comment: {
          type: String,
          required: [true, 'Comment cannot be empty']
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create index for better performance on queries
complaintSchema.index({ user: 1, status: 1 });
complaintSchema.index({ category: 1 });
complaintSchema.index({ location: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint; 