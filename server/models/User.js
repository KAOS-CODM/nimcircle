const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },

    displayName: {
      type: String,
      trim: true,
      maxlength: 30,
      default: '',
    },

    avatar: {
      type: String,
      trim: true,
      default: '',
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 160,
      default: '',
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('User', userSchema)