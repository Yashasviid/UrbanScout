import { db } from '@/lib/db'

export async function POST(request) {
  try {
    const { email, consent, eventId } = await request.json()
    if (!email || !eventId) {
      return Response.json({ success: false, error: 'Missing fields' }, { status: 400 })
    }
    await db.emailLead.create({ data: { email, consent: consent || false, eventId } })
    return Response.json({ success: true })
  } catch (error) {
    console.error('Email lead error:', error)
    return Response.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
