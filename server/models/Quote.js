import mongoose from 'mongoose'

const quoteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 120
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    maxlength: 20
  },
  projectType: {
    type: String,
    required: true,
    trim: true,
    // Choices are edited in the CMS (Site content → Get a quote) and checked
    // against the published list in routes/quotes.js.
    maxlength: 60
  },
  postcode: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    maxlength: 10
  },
  message: {
    type: String,
    trim: true,
    maxlength: 2000,
    default: ''
  },
  consent: {
    type: Boolean,
    required: true,
    validate: {
      validator: (v) => v === true,
      message: 'Consent to the Privacy Policy is required.'
    }
  },
  consentAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Quote', quoteSchema)
