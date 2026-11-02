// Creates (or resets the password of) a CMS user.
//
//   npm run create-admin -- someone@example.com "Their Name"
//
// You'll be asked for the password. For non-interactive use (e.g. a hosting
// console), set ADMIN_PASSWORD in the environment instead.
import readline from 'node:readline'
import mongoose from 'mongoose'
import { config } from '../config.js'
import User, { MIN_PASSWORD_LENGTH } from '../models/User.js'

function askHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true })
    rl._writeToOutput = (s) => {
      if (s.startsWith(question)) rl.output.write(s)
    }
    rl.question(question, (answer) => {
      rl.close()
      process.stdout.write('\n')
      resolve(answer)
    })
  })
}

async function main() {
  const [email, ...nameParts] = process.argv.slice(2)
  if (!email) {
    console.error('Usage: npm run create-admin -- someone@example.com "Their Name"')
    process.exit(1)
  }

  let password = process.env.ADMIN_PASSWORD
  if (!password) {
    password = await askHidden(`Password for ${email} (min ${MIN_PASSWORD_LENGTH} characters): `)
    const again = await askHidden('Repeat password: ')
    if (password !== again) {
      console.error('Passwords did not match.')
      process.exit(1)
    }
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    console.error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
    process.exit(1)
  }

  await mongoose.connect(config.mongoUri)
  let user = await User.findOne({ email: email.toLowerCase() })
  const isNew = !user
  if (!user) user = new User({ email, name: nameParts.join(' ') })
  else if (nameParts.length) user.name = nameParts.join(' ')
  await user.setPassword(password)
  await user.save()
  console.log(isNew ? `Created CMS user ${user.email}.` : `Reset password for ${user.email}.`)
  await mongoose.disconnect()
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
