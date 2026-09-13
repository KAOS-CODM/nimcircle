require('dotenv').config()

const rateLimit = require('express-rate-limit')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

const connectDatabase = require('./db')

const userRoutes = require('./routes/users')
const circleRoutes = require('./routes/circles')
const contributionRoutes = require('./routes/contributions')
const configRoutes = require('./routes/config')

const app = express()

const PORT =
  process.env.PORT || 9000

/*
 * API rate limiter
 *
 * Limits each client to 300 requests
 * within a 15-minute window.
 */
const apiLimiter =
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error:
        'Too many requests. Please try again later.',
    },
  })

/*
 * Security headers
 */
app.use(
  helmet(),
)

/*
 * CORS
 *
 * Only allow the configured frontend origin
 * and local development origins.
 */
const allowedOrigins = (
  process.env.FRONTEND_URLS || ''
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(
  cors({
    origin(origin, callback) {
      /*
       * Requests without an Origin header can still be used
       * by server-to-server tools and health checks.
       */
      if (!origin) {
        return callback(null, true)
      }

      if (
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true)
      }

      return callback(null, false)
    },

    methods: [
      'GET',
      'POST',
      'PATCH',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  }),
)

/*
 * Limit incoming JSON payloads.
 */
app.use(
  express.json({
    limit: '100kb',
  }),
)

/*
 * Health check
 *
 * Kept outside the rate limiter so
 * monitoring can always reach it.
 */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    service: 'NimCircle API',
    status: 'healthy',
  })
})

/*
 * Rate-limit API routes.
 *
 * Health check remains unrestricted.
 */
app.use(
  '/api',
  apiLimiter,
)

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

app.use(
  '/api/config',
  configRoutes,
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

    /*
     * Don't expose internal error details
     * to clients.
     */

    res.status(500).json({
      error:
        'Internal server error',
    })
  },
)

/*
 * Start server
 */
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