const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [20, 'First name cannot be more than 20 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [20, 'Last name cannot be more than 20 characters'],
    },
    username: {
      type: String,
      required: [true, 'username is required'],
      unique: true,
      maxlength: [20, 'username cannot be more than 25 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      unique: true,
      lowercase: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        'Please enter a valid email',
      ],
    },
    role: {
      type: String,
      required: true,
      enum: ['Manufacturer', 'Franchisee', 'Merchant', 'User'],
    },
    avatar: {
      type: String,
    },
    secretOrKey: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['ACTIVE', 'INACTIVE', 'BLOCKED', 'PENDING'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// index on the conversation field
messageSchema.index({ username: 1 });

module.exports = mongoose.model('User', userSchema);
