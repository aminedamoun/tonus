import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = 'tonosdxb@gmail.com';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1E3A5F,#2a4a6f);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:1px;">
                TONO'S
              </h1>
              <p style="margin:6px 0 0;color:#89CFF0;font-size:13px;letter-spacing:2px;text-transform:uppercase;">
                New Contact Message
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 24px;color:#6b7280;font-size:14px;line-height:1.6;">
                You have received a new message from the contact form on your website.
              </p>

              <!-- Info Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f9ff;border-radius:12px;border:1px solid #e0f2fe;">
                <tr>
                  <td style="padding:24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e0f2fe;">
                          <span style="color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Name</span><br/>
                          <span style="color:#1a1a1a;font-size:16px;font-weight:600;">${name}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e0f2fe;">
                          <span style="color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Email</span><br/>
                          <a href="mailto:${email}" style="color:#3b82f6;font-size:16px;font-weight:600;text-decoration:none;">${email}</a>
                        </td>
                      </tr>
                      ${phone ? `
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e0f2fe;">
                          <span style="color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Phone</span><br/>
                          <a href="tel:${phone}" style="color:#1a1a1a;font-size:16px;font-weight:600;text-decoration:none;">${phone}</a>
                        </td>
                      </tr>` : ''}
                      <tr>
                        <td style="padding:12px 0 0;">
                          <span style="color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Message</span><br/>
                          <p style="margin:6px 0 0;color:#1a1a1a;font-size:15px;line-height:1.7;white-space:pre-wrap;">${message}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Reply Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${email}?subject=Re: Your message to Tono's" style="display:inline-block;background-color:#89CFF0;color:#1a1a1a;padding:14px 32px;border-radius:50px;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.5px;">
                      Reply to ${name}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                This email was sent from the contact form at tonosdxb.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await resend.emails.send({
      from: "Tono's Website <onboarding@resend.dev>",
      to: [TO_EMAIL],
      replyTo: email,
      subject: `New Contact Message from ${name}`,
      html,
    });

    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact email error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    );
  }
}
