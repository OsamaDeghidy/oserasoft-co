import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('admin_session')?.value

    if (!sessionToken) {
      return NextResponse.json({ authenticated: false })
    }

    // التحقق من الجلسة في Supabase (إذا كان متاحاً)
    const supabase = createServerClient()
    if (supabase) {
      const { data, error } = await supabase
        .from('admin_sessions')
        .select('*')
        .eq('session_token', sessionToken)
        .gt('expires_at', new Date().toISOString())
        .single()

      if (error || !data) {
        // إذا لم توجد الجلسة أو انتهت، احذف cookie
        cookieStore.delete('admin_session')
        return NextResponse.json({ authenticated: false })
      }

      return NextResponse.json({ authenticated: true })
    } else {
      // في وضع التطوير المحلي، نتحقق فقط من وجود cookie
      return NextResponse.json({ authenticated: true })
    }
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ authenticated: false })
  }
}

