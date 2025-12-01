import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // التحقق من بيانات الدخول
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // إنشاء session token
      const sessionToken = crypto.randomUUID()
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24) // 24 ساعة

      // حفظ الجلسة في Supabase (إذا كان متاحاً)
      const supabase = createServerClient()
      if (supabase) {
        const { error } = await supabase
          .from('admin_sessions')
          .insert({
            session_token: sessionToken,
            expires_at: expiresAt.toISOString(),
            created_at: new Date().toISOString(),
          })

        if (error) {
          console.error('Error creating session:', error)
        }
      } else {
        console.log('Using cookie-based session (database disabled)')
      }

      // حفظ في cookie
      const cookieStore = await cookies()
      cookieStore.set('admin_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'اسم المستخدم أو كلمة المرور غير صحيحة' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في تسجيل الدخول' },
      { status: 500 }
    )
  }
}

