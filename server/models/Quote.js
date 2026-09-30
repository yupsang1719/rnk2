import mongoose from 'mongoose'

const PROJECT_TYPES = ['Extension', 'Conversion', 'New Build', 'Design only']

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
    enum: PROJECT_TYPES
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
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export const PROJECT_TYPE_VALUES = PROJECT_TYPES
export default mongoose.model('Quote', quoteSchema)
