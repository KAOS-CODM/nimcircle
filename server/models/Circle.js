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

    // Amounts are stored in Luna, the smallest NIM unit.
    targetAmount: {
      type: Number,
      required: true,
      min: 1,
    },

    deadline: {
      type: Date,
      required: true,
    },

    // The wallet that created the Circle.
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

    // The wallet that the goal is for and that receives contributions.
    goalOwnerWallet: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
    },

    goalOwnerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },

    // The creator's committed amount, stored in Luna.
    // This value is intended to be fixed after Circle creation.
    creatorCommitment: {
      type: Number,
      required: true,
      min: 0,
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