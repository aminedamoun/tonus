import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const GMAIL_USER = process.env.GMAIL_USER || 'tonosdxb@gmail.com';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { fullName, phone, email, date, time, guests, seatingArea, seatingType, specialRequests } =
      await request.json();

    if (!fullName || !phone || !email || !date || !time || !guests) {
      return NextResponse.json({ error: 'All required fields must be filled' }, { status: 400 });
    }

    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
          <tr>
            <td style="background:linear-gradient(135deg,#1E3A5F,#2a4a6f);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:1px;">TONO'S</h1>
              <p style="margin:6px 0 0;color:#89CFF0;font-size:13px;letter-spacing:2px;text-transform:uppercase;">New Table Reservation</p>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 24px;color:#6b7280;font-size:14px;line-height:1.6;">A new reservation has been made through your website.</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f9ff;border-radius:12px;border:1px solid #e0f2fe;">
                <tr>
                  <td style="padding:24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                      <tr>
                        <td width="33%" style="text-align:center;padding:12px 8px;background:#ffffff;border-radius:10px;">
                          <span style="color:#6b7280;font-size:10px;text-transform:uppercase;letter-spacing:1px;font-weight:600;display:block;">Date</span>
                          <span style="color:#1E3A5F;font-size:15px;font-weight:700;display:block;margin-top:4px;">${formattedDate}</span>
                        </td>
                        <td width="4"></td>
                        <td width="33%" style="text-align:center;padding:12px 8px;background:#ffffff;border-radius:10px;">
                          <span style="color:#6b7280;font-size:10px;text-transform:uppercase;letter-spacing:1px;font-weight:600;display:block;">Time</span>
                          <span style="color:#1E3A5F;font-size:15px;font-weight:700;display:block;margin-top:4px;">${time}</span>
                        </td>
                        <td width="4"></td>
                        <td width="33%" style="text-align:center;padding:12px 8px;background:#ffffff;border-radius:10px;">
                          <span style="color:#6b7280;font-size:10px;text-transform:uppercase;letter-spacing:1px;font-weight:600;display:block;">Guests</span>
                          <span style="color:#1E3A5F;font-size:15px;font-weight:700;display:block;margin-top:4px;">${guests}</span>
                        </td>
                      </tr>
                    </table>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr><td style="padding:10px 0;border-bottom:1px solid #e0f2fe;">
                        <span style="color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Guest Name</span><br/>
                        <span style="color:#1a1a1a;font-size:16px;font-weight:600;">${fullName}</span>
                      </td></tr>
                      <tr><td style="padding:10px 0;border-bottom:1px solid #e0f2fe;">
                        <span style="color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Phone</span><br/>
                        <a href="tel:${phone}" style="color:#1a1a1a;font-size:16px;font-weight:600;text-decoration:none;">${phone}</a>
                      </td></tr>
                      <tr><td style="padding:10px 0;border-bottom:1px solid #e0f2fe;">
                        <span style="color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Email</span><br/>
                        <a href="mailto:${email}" style="color:#3b82f6;font-size:16px;font-weight:600;text-decoration:none;">${email}</a>
                      </td></tr>
                      <tr><td style="padding:10px 0;border-bottom:1px solid #e0f2fe;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td width="50%">
                              <span style="color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Seating Area</span><br/>
                              <span style="color:#1a1a1a;font-size:15px;font-weight:600;">${seatingArea === 'non-smoking' ? 'Non-Smoking' : 'Smoking'}</span>
                            </td>
                            <td width="50%">
                              <span style="color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Seating Type</span><br/>
                              <span style="color:#1a1a1a;font-size:15px;font-weight:600;text-transform:capitalize;">${seatingType}</span>
                            </td>
                          </tr>
                        </table>
                      </td></tr>
                      ${specialRequests ? `<tr><td style="padding:12px 0 0;">
                        <span style="color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Special Requests</span><br/>
                        <p style="margin:6px 0 0;color:#1a1a1a;font-size:14px;line-height:1.6;white-space:pre-wrap;">${specialRequests}</p>
                      </td></tr>` : ''}
                    </table>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                <tr><td align="center">
                  <a href="mailto:${email}?subject=Your Reservation at Tono's - ${formattedDate} at ${time}" style="display:inline-block;background-color:#89CFF0;color:#1a1a1a;padding:14px 28px;border-radius:50px;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.5px;margin:0 6px;">Email Guest</a>
                  <a href="tel:${phone}" style="display:inline-block;background-color:#1E3A5F;color:#ffffff;padding:14px 28px;border-radius:50px;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.5px;margin:0 6px;">Call Guest</a>
                </td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">This reservation was made through tonosdxb.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await transporter.sendMail({
      from: `"Tono's Website" <${GMAIL_USER}>`,
      to: GMAIL_USER,
      replyTo: email,
      subject: `New Reservation: ${fullName} - ${formattedDate} at ${time} (${guests} guests)`,
      html,
    });

    return NextResponse.json({ success: true, message: 'Reservation sent successfully' });
  } catch (error) {
    console.error('Reservation email error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send reservation' },
      { status: 500 }
    );
  }
}
