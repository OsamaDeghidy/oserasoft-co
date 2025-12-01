import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

interface Project {
  id: number
  title: string
  description: string
  image: string
  subImages?: string[]
  technologies: string[]
  githubUrl: string
  liveUrl: string
  category: string
}

// GET - جلب جميع المشاريع
export async function GET() {
  try {
    const supabase = createServerClient()
    
    if (!supabase) {
      // Return empty array when database is not available
      return NextResponse.json([], { status: 200 })
    }
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
      return NextResponse.json(
        { error: 'Failed to fetch projects' },
        { status: 500 }
      )
    }

    // تحويل البيانات من Supabase إلى التنسيق المطلوب
    const projects: Project[] = (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      image: item.image,
      subImages: item.sub_images || [],
      technologies: item.technologies || [],
      githubUrl: item.github_url || '',
      liveUrl: item.live_url || '',
      category: item.category,
    }))

    return NextResponse.json(projects, { status: 200 })
  } catch (error) {
    console.error('Error in GET projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST - إضافة مشروع جديد
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, image, subImages, technologies, githubUrl, liveUrl, category } = body

    // التحقق من البيانات المطلوبة
    if (!title || !description || !image || !category) {
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

    // إضافة المشروع الجديد
    const { data, error } = await supabase
      .from('projects')
      .insert({
        title,
        description,
        image,
        sub_images: subImages && Array.isArray(subImages) ? subImages.filter((img: string) => img.trim().length > 0) : [],
        technologies: technologies || [],
        github_url: githubUrl || '',
        live_url: liveUrl || '',
        category,
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding project:', error)
      return NextResponse.json(
        { error: 'Failed to add project' },
        { status: 500 }
      )
    }

    // تحويل البيانات إلى التنسيق المطلوب
    const newProject: Project = {
      id: data.id,
      title: data.title,
      description: data.description,
      image: data.image,
      subImages: data.sub_images || [],
      technologies: data.technologies || [],
      githubUrl: data.github_url || '',
      liveUrl: data.live_url || '',
      category: data.category,
    }

    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    console.error('Error adding project:', error)
    return NextResponse.json(
      { error: 'Failed to add project' },
      { status: 500 }
    )
  }
}

// PUT - تحديث مشروع موجود
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, title, description, image, subImages, technologies, githubUrl, liveUrl, category } = body

    // التحقق من البيانات المطلوبة
    if (!id || !title || !description || !image || !category) {
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

    // تحديث المشروع
    const { data, error } = await supabase
      .from('projects')
      .update({
        title,
        description,
        image,
        sub_images: subImages && Array.isArray(subImages) ? subImages.filter((img: string) => img.trim().length > 0) : [],
        technologies: technologies || [],
        github_url: githubUrl || '',
        live_url: liveUrl || '',
        category,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating project:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to update project' },
        { status: 500 }
      )
    }

    // تحويل البيانات إلى التنسيق المطلوب
    const updatedProject: Project = {
      id: data.id,
      title: data.title,
      description: data.description,
      image: data.image,
      subImages: data.sub_images || [],
      technologies: data.technologies || [],
      githubUrl: data.github_url || '',
      liveUrl: data.live_url || '',
      category: data.category,
    }

    return NextResponse.json(updatedProject, { status: 200 })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

// DELETE - حذف مشروع
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = parseInt(searchParams.get('id') || '0')

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
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

    // حذف المشروع
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting project:', error)
      return NextResponse.json(
        { error: 'Failed to delete project' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Project deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}

