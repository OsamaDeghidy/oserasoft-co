import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('admin_session')?.value

    if (sessionToken) {
      // حذف الجلسة من Supabase (إذا كان متاحاً)
      const supabase = createServerClient()
      if (supabase) {
        await supabase
          .from('admin_sessions')
          .delete()
          .eq('session_token', sessionToken)
      }
    }

    // حذف cookie
    cookieStore.delete('admin_session')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في تسجيل الخروج' },
      { status: 500 }
    )
  }
}

