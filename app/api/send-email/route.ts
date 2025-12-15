import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const { name, email, phone, eventDate, message } = await request.json();

        // Validate input
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const user = process.env.GMAIL_EMAIL;
        const pass = process.env.GMAIL_PASSWORD;

        if (!user || !pass) {
            return NextResponse.json(
                { error: 'Server configuration error: Missing email credentials' },
                { status: 500 }
            );
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user,
                pass,
            },
        });

        const mailOptions = {
            from: `"${name} via Deliciosa" <${user}>`,
            to: user, // Send to yourself
            replyTo: email, // Reply to customer
            subject: `New Inquiry from ${name} - Deliciosa`,
            text: `
NEW INQUIRY RECEIVED

Name: ${name}
Email: ${email}
Phone: ${phone}
Event Date: ${eventDate || 'Not specified'}

Message:
${message}
      `,
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #78350f;">New Inquiry Received</h2>
          <hr style="border: 1px solid #eee;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Event Date:</strong> ${eventDate || 'Not specified'}</p>
          <br/>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${message}</div>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: 'Failed to send email' },
            { status: 500 }
        );
    }
}
