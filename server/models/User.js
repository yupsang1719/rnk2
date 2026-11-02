import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

export const MIN_PASSWORD_LENGTH = 10

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, maxlength: 80, default: '' },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    passwordHash: { type: String, required: true },
    // Bumped on password change so existing sessions are invalidated.
    tokenVersion: { type: Number, default: 0 },
    lastLoginAt: Date
  },
  { timestamps: true }
)

userSchema.methods.setPassword = async function setPassword(password) {
  this.passwordHash = await bcrypt.hash(password, 12)
  this.tokenVersion = (this.tokenVersion || 0) + 1
}

userSchema.methods.checkPassword = function checkPassword(password) {
  return bcrypt.compare(password, this.passwordHash)
}

userSchema.methods.toSafeJSON = function toSafeJSON() {
  return { id: this._id, name: this.name, email: this.email, lastLoginAt: this.lastLoginAt }
}

export default mongoose.model('User', userSchema)
