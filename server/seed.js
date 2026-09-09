require('dotenv').config({
  path: '../.env',
})

const connectDatabase = require('./db')

const User = require('./models/User')
const Circle = require('./models/Circle')
const Contribution = require('./models/Contribution')

async function seed() {
  try {
    const connected = await connectDatabase()
    
    if (!connected) {
      throw new Error(
        'Could not connect to MongoDB.',
      )
    }

    // Clear previous dummy data
    await Contribution.deleteMany({
      transactionHash: {
        $regex: /^dummy-tx-/,
      },
    })

    await Circle.deleteMany({
      circleId: {
        $regex: /^circle-test-/,
      },
    })

    await User.deleteMany({
      username: {
        $in: ['alice', 'bob'],
      },
    })

    // Create users
    const alice = await User.create({
      walletAddress:
        'NQXXDUMMYALICE000000000000000000000000000',
      username: 'alice',
      displayName: 'Alice Johnson',
      avatar: '',
      bio: 'Saving for a new laptop.',
    })

    const bob = await User.create({
      walletAddress:
        'NQXXDUMMYBOB00000000000000000000000000000',
      username: 'bob',
      displayName: 'Bob Smith',
      avatar: '',
      bio: 'Helping friends reach their goals.',
    })

    // Create Circle
    const circle = await Circle.create({
      circleId: 'circle-test-001',
      name: "Alice's New Laptop",
      description: 'Saving together for a new laptop.',
      targetAmount: 1000000,
      deadline: new Date('2026-12-31T23:59:59.000Z'),
      creatorWallet: alice.walletAddress,
      creatorUserId: alice._id,
      recipientWallet: alice.walletAddress,
      status: 'active',
    })

    // Create contributions
    await Contribution.create([
      {
        circleId: circle.circleId,
        contributorWallet: alice.walletAddress,
        contributorUserId: alice._id,
        amount: 200000,
        transactionHash: 'dummy-tx-alice-001',
        status: 'confirmed',
        confirmedAt: new Date(),
      },
      {
        circleId: circle.circleId,
        contributorWallet: bob.walletAddress,
        contributorUserId: bob._id,
        amount: 300000,
        transactionHash: 'dummy-tx-bob-001',
        status: 'confirmed',
        confirmedAt: new Date(),
      },
      {
        circleId: circle.circleId,
        contributorWallet: bob.walletAddress,
        contributorUserId: bob._id,
        amount: 100000,
        transactionHash: 'dummy-tx-bob-002',
        status: 'confirmed',
        confirmedAt: new Date(),
      },
    ])

    console.log('\nDummy database seeded successfully!\n')

    console.log('Alice:', alice._id)
    console.log('Bob:', bob._id)
    console.log('Circle:', circle.circleId)
    console.log('Raised: 600000 Luna')
    console.log('Target: 1000000 Luna')

  } catch (error) {
    console.error('Seed failed:', error)
    process.exit(1)
  }
}

seed()