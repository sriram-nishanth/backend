import express from 'express'
import nodemailer from 'nodemailer' // Ensure you have nodemailer installed
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
 // Load environment variables from .env file
const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/send', async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { name, email, message } = req.body

  // Configure your SMTP transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email provider
    auth: {
      user: process.env.USER, // Your email address
      pass: process.env.PASS, // Use App Password if using Gmail
    },
  })

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.USER, // Your receiving email
      subject: 'Portfolio Contact Form Message',
      text: message,
      html: `<p><b>Name:</b> ${name}</p>
             <p><b>Email:</b> ${email}</p>
             <p><b>Message:</b> ${message}</p>`,
    })
    res.status(200).json({ message: 'Email sent successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to send email', error })
  }
})

const PORT = 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))