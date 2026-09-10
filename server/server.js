require('dotenv').config()

const express = require('express')
const cors = require('cors')

const connectDatabase = require('./db')

const userRoutes = require('./routes/users')
const circleRoutes = require('./routes/circles')
const contributionRoutes = require('./routes/contributions')

const app = express()

const PORT =
  process.env.PORT || 3000

app.use(
  cors({
    origin: true,
  }),
)

app.use(express.json())

/*
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    service: 'NimCircle API',
    status: 'healthy',
  })
})

/*
 * API routes
 */
app.use(
  '/api/users',
  userRoutes,
)

app.use(
  '/api/circles',
  circleRoutes,
)

app.use(
  '/api/contributions',
  contributionRoutes,
)

/*
 * 404 handler
 */
app.use(
  (req, res) => {
    res.status(404).json({
      error: 'Route not found',
    })
  },
)

/*
 * Global error handler
 */
app.use(
  (error, req, res, next) => {
    console.error(
      'Unhandled server error:',
      error,
    )

    res.status(500).json({
      error:
        'Internal server error',
    })
  },
)

async function startServer() {
  const connected =
    await connectDatabase()

  if (!connected) {
    console.error(
      'NimCircle API stopped because MongoDB could not be reached.',
    )

    process.exit(1)
  }

  app.listen(
    PORT,
    '0.0.0.0',
    () => {
      console.log(
        `NimCircle API running on port ${PORT}`,
      )
    },
  )
}

startServer()