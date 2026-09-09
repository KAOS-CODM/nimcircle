const mongoose = require('mongoose')
const dns = require('dns')

/*
 * MongoDB Atlas SRV records can sometimes fail to resolve
 * correctly depending on the local DNS resolver.
 *
 * Use reliable public DNS servers for the connection.
 */
dns.setServers([
  '8.8.8.8',
  '1.1.1.1',
])

async function connectDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error(
      'MONGODB_URI is not defined in the environment.',
    )
  }

  try {
    await mongoose.connect(
      process.env.MONGODB_URI,
      {
        serverSelectionTimeoutMS: 5000,
      },
    )

    console.log(
      'MongoDB connected successfully',
    )

    return true
  } catch (error) {
    console.error(
      'MongoDB connection failed:',
      error.message,
    )

    return false
  }
}

mongoose.connection.on(
  'disconnected',
  () => {
    console.log(
      'MongoDB disconnected.',
    )
  },
)

mongoose.connection.on(
  'connected',
  () => {
    console.log(
      'MongoDB connection restored.',
    )
  },
)

module.exports = connectDatabase