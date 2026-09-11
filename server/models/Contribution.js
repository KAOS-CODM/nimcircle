const mongoose = require('mongoose')

const contributionSchema = new mongoose.Schema(
  {
    circleId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    contributorWallet: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
    },

    contributorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // The wallet that actually receives the contribution.
    recipientWallet: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    // Amount is stored in Luna.
    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    transactionHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    // Memo/data attached to the Nimiq transaction.
    // Used to associate the transaction with the Circle.
    memo: {
      type: String,
      trim: true,
      default: '',
    },

    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'failed',
      ],
      default: 'pending',
      index: true,
    },

    confirmedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model(
  'Contribution',
  contributionSchema,
)