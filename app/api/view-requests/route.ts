import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

interface ViewRequest {
  id: number
  projectId: number
  projectTitle: string
  name: string
  email: string
  phone: string
  message: string
  createdAt: string
  status: 'pending' | 'viewed' | 'contacted'
}

// GET - جلب جميع الطلبات
export async function GET() {
  try {
    const supabase = createServerClient()
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database is not available' },
        { status: 503 }
      )
    }
    
    const { data, error } = await supabase
      .from('view_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching view requests:', error)
      return NextResponse.json(
        { error: 'Failed to fetch view requests' },
        { status: 500 }
      )
    }

    // تحويل البيانات من Supabase إلى التنسيق المطلوب
    const requests: ViewRequest[] = (data || []).map((item: any) => ({
      id: item.id,
      projectId: item.project_id,
      projectTitle: item.project_title,
      name: item.name,
      email: item.email,
      phone: item.phone,
      message: item.message || '',
      createdAt: item.created_at,
      status: item.status,
    }))

    return NextResponse.json(requests, { status: 200 })
  } catch (error) {
    console.error('Error in GET view requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch view requests' },
      { status: 500 }
    )
  }
}

// POST - إضافة طلب جديد
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { projectId, projectTitle, name, email, phone, message } = body

    // التحقق من البيانات المطلوبة
    if (!projectId || !projectTitle || !name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()
    
    // Database is required for this operation
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database is not available' },
        { status: 503 }
      )
    }

    // إضافة الطلب الجديد
    const { data, error } = await supabase
      .from('view_requests')
      .insert({
        project_id: projectId,
        project_title: projectTitle,
        name,
        email,
        phone,
        message: message || '',
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding view request:', error)
      return NextResponse.json(
        { error: 'Failed to add view request' },
        { status: 500 }
      )
    }

    // تحويل البيانات إلى التنسيق المطلوب
    const newRequest: ViewRequest = {
      id: data.id,
      projectId: data.project_id,
      projectTitle: data.project_title,
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message || '',
      createdAt: data.created_at,
      status: data.status,
    }

    return NextResponse.json(newRequest, { status: 201 })
  } catch (error) {
    console.error('Error adding view request:', error)
    return NextResponse.json(
      { error: 'Failed to add view request' },
      { status: 500 }
    )
  }
}

// PUT - تحديث حالة الطلب
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()
    
    // Database is required for this operation
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database is not available' },
        { status: 503 }
      )
    }

    // تحديث حالة الطلب
    const { data, error } = await supabase
      .from('view_requests')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating view request:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Request not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to update view request' },
        { status: 500 }
      )
    }

    // تحويل البيانات إلى التنسيق المطلوب
    const updatedRequest: ViewRequest = {
      id: data.id,
      projectId: data.project_id,
      projectTitle: data.project_title,
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message || '',
      createdAt: data.created_at,
      status: data.status,
    }

    return NextResponse.json(updatedRequest, { status: 200 })
  } catch (error) {
    console.error('Error updating view request:', error)
    return NextResponse.json(
      { error: 'Failed to update view request' },
      { status: 500 }
    )
  }
}

// DELETE - حذف طلب
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = parseInt(searchParams.get('id') || '0')

    if (!id) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()
    
    // Database is required for this operation
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database is not available' },
        { status: 503 }
      )
    }

    // حذف الطلب
    const { error } = await supabase
      .from('view_requests')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting view request:', error)
      return NextResponse.json(
        { error: 'Failed to delete view request' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Request deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting view request:', error)
    return NextResponse.json(
      { error: 'Failed to delete view request' },
      { status: 500 }
    )
  }
}

