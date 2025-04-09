import { NextResponse } from "next/server";
import { render } from '@react-email/components';
import sgMail from '@sendgrid/mail';
import Invitation from "@/app/components/Email/Invitation";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);  // Make sure you set your SendGrid API key in .env.local

export async function POST(req) {
  try {
    const { email } = await req.json(); // Get email and fname from the request body

    const emailHtml = await render(<Invitation email={email} />);

    const msg = {
      to: email,
      from: `${process.env.PRODUCTIVIO_EMAIL}`,  // Replace with a verified sender email from SendGrid
      //from: "sunchit333@gmail.com",
      subject: 'You have been invited to join!',
      html: emailHtml,
    };

    // Send the email via SendGrid
    await sgMail.send(msg);

    // Respond with success
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
