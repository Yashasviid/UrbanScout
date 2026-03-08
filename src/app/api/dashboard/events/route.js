import { scrapeSydneyEvents } from '@/lib/scraper'
export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'all'
    const search = searchParams.get('search') || ''

    let events = await scrapeSydneyEvents()

    if (category !== 'all') {
      events = events.filter(e => e.category?.toLowerCase() === category.toLowerCase())
    }

    if (search) {
      const q = search.toLowerCase()
      events = events.filter(e =>
        e.title?.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.location?.toLowerCase().includes(q)
      )
    }

    return Response.json({
      success: true,
      count: events.length,
      events,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Events API error:', error)
    return Response.json({ success: false, error: 'Failed to fetch events', events: [] }, { status: 500 })
  }
}