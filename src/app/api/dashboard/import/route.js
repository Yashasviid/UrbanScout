import { db } from '@/lib/db'
export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const city = searchParams.get('city') || 'Sydney'
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const status = searchParams.get('status') || 'all'

    const events = await db.event.findMany({
      where: {
        city: { contains: city, mode: 'insensitive' },
        ...(status !== 'all' && { status }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { venue: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ]
        }),
        ...(dateFrom && { date: { gte: new Date(dateFrom) } }),
        ...(dateTo && { date: { lte: new Date(dateTo) } }),
      },
      orderBy: { date: 'asc' },
    })

    return Response.json({ success: true, events })
  } catch (error) {
    console.error('Dashboard events error:', error)
    return Response.json({ success: false, events: [] }, { status: 500 })
  }
}
