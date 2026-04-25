import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Message from '@/models/Message'

// Send email reply using fetch (supports SendGrid, Resend, or custom SMTP API)
async function sendEmailReply(
  to: string,
  subject: string,
  adminReply: string
) {
  try {
    // If using Resend (recommended for Vercel)
    if (process.env.RESEND_API_KEY) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'noreply@njbsictclub.com',
          to,
          subject: `Re: ${subject}`,
          html: `
            <h2>Thank you for contacting us!</h2>
            <p>We have received your message about: <strong>${subject}</strong></p>
            <hr />
            <h3>Our Reply:</h3>
            <p>${adminReply.replace(/\n/g, '<br>')}</p>
            <hr />
            <p>Best regards,<br>NJBS ICT Club Team</p>
          `,
        }),
      })

      if (!response.ok) {
        throw new Error(`Resend API error: ${response.statusText}`)
      }

      console.log('[v0] Reply email sent via Resend to:', to)
      return true
    }

    // If using SendGrid
    if (process.env.SENDGRID_API_KEY) {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: process.env.EMAIL_FROM || 'noreply@njbsictclub.com' },
          subject: `Re: ${subject}`,
          content: [
            {
              type: 'text/html',
              value: `
                <h2>Thank you for contacting us!</h2>
                <p>We have received your message about: <strong>${subject}</strong></p>
                <hr />
                <h3>Our Reply:</h3>
                <p>${adminReply.replace(/\n/g, '<br>')}</p>
                <hr />
                <p>Best regards,<br>NJBS ICT Club Team</p>
              `,
            },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error(`SendGrid API error: ${response.statusText}`)
      }

      console.log('[v0] Reply email sent via SendGrid to:', to)
      return true
    }

    console.warn('[v0] Email not configured (no RESEND_API_KEY or SENDGRID_API_KEY)')
    return false
  } catch (error: any) {
    console.error('[v0] Failed to send email:', error.message)
    return false
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { id } = await params
    const { adminReply } = await req.json()

    if (!adminReply || adminReply.trim() === '') {
      return NextResponse.json(
        { error: 'Reply message is required' },
        { status: 400 }
      )
    }

    const message = await Message.findById(id)

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    // Update message status and add reply
    message.status = 'replied'
    message.adminReply = adminReply
    message.repliedAt = new Date()
    await message.save()

    // Send email reply to user
    const emailSent = await sendEmailReply(
      message.email,
      message.subject,
      adminReply
    )

    return NextResponse.json({
      success: true,
      message: 'Reply sent successfully',
      data: message,
    })
  } catch (error: any) {
    console.error('[v0] Reply API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send reply' },
      { status: 500 }
    )
  }
}
