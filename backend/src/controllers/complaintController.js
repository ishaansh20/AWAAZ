import Complaint from '../models/complaintModel.js';

// Get all complaints with filtering
export const getAllComplaints = async (req, res) => {
  try {
    // Build query
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    let query = Complaint.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Execute query
    const complaints = await query.populate({
      path: 'user',
      select: 'username email profilePicture'
    });

    // Send response
    res.status(200).json({
      status: 'success',
      results: complaints.length,
      data: {
        complaints
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get complaint by ID
export const getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate([
      {
        path: 'user',
        select: 'username email profilePicture'
      },
      {
        path: 'assignedTo',
        select: 'username email profilePicture'
      },
      {
        path: 'comments.user',
        select: 'username email profilePicture'
      }
    ]);

    if (!complaint) {
      return res.status(404).json({
        status: 'fail',
        message: 'No complaint found with that ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        complaint
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Create a new complaint
export const createComplaint = async (req, res) => {
  try {
    const newComplaint = await Complaint.create({
      ...req.body,
      user: req.user.id
    });

    res.status(201).json({
      status: 'success',
      data: {
        complaint: newComplaint
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Update complaint
export const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        status: 'fail',
        message: 'No complaint found with that ID'
      });
    }

    // Only admin or the owner can update
    if (req.user.role !== 'admin' && complaint.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to update this complaint'
      });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        complaint: updatedComplaint
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Delete complaint
export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        status: 'fail',
        message: 'No complaint found with that ID'
      });
    }

    // Only admin or the owner can delete
    if (req.user.role !== 'admin' && complaint.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to delete this complaint'
      });
    }

    await Complaint.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Add a comment to a complaint
export const addComment = async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({
        status: 'fail',
        message: 'Comment cannot be empty'
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        status: 'fail',
        message: 'No complaint found with that ID'
      });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            user: req.user.id,
            comment
          }
        }
      },
      {
        new: true,
        runValidators: true
      }
    ).populate({
      path: 'comments.user',
      select: 'username email profilePicture'
    });

    res.status(200).json({
      status: 'success',
      data: {
        complaint: updatedComplaint
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Vote for a complaint
export const voteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        status: 'fail',
        message: 'No complaint found with that ID'
      });
    }

    // Check if user has already voted
    const hasVoted = complaint.voters.includes(req.user.id);

    let updateOperation;
    if (hasVoted) {
      // Remove vote
      updateOperation = {
        $inc: { votes: -1 },
        $pull: { voters: req.user.id }
      };
    } else {
      // Add vote
      updateOperation = {
        $inc: { votes: 1 },
        $push: { voters: req.user.id }
      };
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updateOperation,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        complaint: updatedComplaint
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Assign complaint to admin/staff
export const assignComplaint = async (req, res) => {
  try {
    const { assignedTo } = req.body;

    if (!assignedTo) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide a user ID to assign the complaint'
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        status: 'fail',
        message: 'No complaint found with that ID'
      });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        assignedTo,
        status: 'in-progress'
      },
      {
        new: true,
        runValidators: true
      }
    ).populate({
      path: 'assignedTo',
      select: 'username email profilePicture'
    });

    res.status(200).json({
      status: 'success',
      data: {
        complaint: updatedComplaint
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Update complaint status
export const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'in-progress', 'resolved', 'rejected'].includes(status)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide a valid status'
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        status: 'fail',
        message: 'No complaint found with that ID'
      });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        complaint: updatedComplaint
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
}; 