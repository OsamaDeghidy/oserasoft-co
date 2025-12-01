import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // التحقق من البيانات المطلوبة
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      )
    }

    // إعداد Nodemailer
    // ملاحظة: يجب إضافة متغيرات البيئة في Vercel
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // محتوى البريد الإلكتروني
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      subject: `رسالة جديدة من ${name}: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">رسالة جديدة من موقع Portfolio</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>الاسم:</strong> ${name}</p>
            <p><strong>البريد الإلكتروني:</strong> ${email}</p>
            <p><strong>الموضوع:</strong> ${subject}</p>
            <p><strong>الرسالة:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #666; font-size: 12px;">
            هذه رسالة تلقائية من موقع Portfolio. يرجى الرد على ${email}
          </p>
        </div>
      `,
      replyTo: email,
    }

    // إرسال البريد الإلكتروني
    // إذا لم تكن متغيرات البيئة موجودة، نعيد نجاح وهمي للاختبار
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions)
    } else {
      // في حالة عدم وجود إعدادات البريد، نطبع البيانات في الكونسول (للتطوير فقط)
      console.log('Contact Form Submission:', {
        name,
        email,
        subject,
        message,
      })
      console.log(
        'Note: Email not sent. Please configure SMTP environment variables.'
      )
    }

    return NextResponse.json(
      { message: 'تم إرسال الرسالة بنجاح' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال الرسالة' },
      { status: 500 }
    )
  }
}

