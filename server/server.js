import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import quotesRouter from './routes/quotes.js'

const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rnk2-properties'
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

const app = express()

app.use(cors({ origin: CLIENT_ORIGIN }))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, status: 'RNK2 Properties API is running' })
})

app.use('/api/quotes', quotesRouter)

app.use((_req, res) => {
  res.status(404).json({ ok: false, errors: { form: 'Not found.' } })
})

async function start() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')
    app.listen(PORT, () => {
      console.log(`RNK2 Properties API listening on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Failed to start server:', err.message)
    process.exit(1)
  }
}

start()
