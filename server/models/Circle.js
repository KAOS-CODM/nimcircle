const mongoose = require('mongoose')

const circleSchema = new mongoose.Schema(
  {
    circleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },

    // Amount is stored in Luna, the smallest NIM unit.
    targetAmount: {
      type: Number,
      required: true,
      min: 1,
    },

    deadline: {
      type: Date,
      required: true,
    },

    creatorWallet: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
    },

    creatorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    recipientWallet: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        'active',
        'completed',
        'expired',
        'cancelled',
      ],
      default: 'active',
      index: true,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('Circle', circleSchema)