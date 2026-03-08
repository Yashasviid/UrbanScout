import { db } from '@/lib/db'

export async function POST(request) {
  try {
    const { firstName, lastName, email, subject, message } = await request.json()
    if (!firstName || !email || !message) {
      return Response.json({ success: false, error: 'Missing fields' }, { status: 400 })
    }
    await db.contactMessage.create({ data: { firstName, lastName: lastName || '', email, subject: subject || '', message } })
    return Response.json({ success: true })
  } catch (error) {
    console.error('Contact error:', error)
    return Response.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
