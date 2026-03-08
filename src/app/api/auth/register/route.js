import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    if (!email || !password || !name) {
      return Response.json({ success: false, error: 'All fields required' })
    }

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return Response.json({ success: false, error: 'Email already registered' })
    }

    const hashed = await bcrypt.hash(password, 10)

    await db.user.create({
      data: { name, email, password: hashed }
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('Register error:', error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}