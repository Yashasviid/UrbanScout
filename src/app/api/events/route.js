
import { scrapeSydneyEvents } from '@/lib/scraper'
export const dynamic = 'force-dynamic'
import { db } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'all'
    const search = searchParams.get('search') || ''

    // Get fresh events from scraper
    const scraped = await scrapeSydneyEvents()

    // Upsert ALL events in one go instead of one by one
    await Promise.all(scraped.map(event =>
      db.event.upsert({
        where: { id: event.id },
        update: {
          title: event.title,
          date: new Date(event.date),
          venue: event.location || 'Sydney',
          description: event.description || '',
          category: event.category || 'General',
          imageUrl: event.image || '',
          sourceWebsite: event.source,
          originalUrl: event.url || '',
          lastScraped: new Date(),
        },
        create: {
          id: event.id,
          title: event.title,
          date: new Date(event.date),
          venue: event.location || 'Sydney',
          city: 'Sydney',
          description: event.description || '',
          category: event.category || 'General',
          imageUrl: event.image || '',
          sourceWebsite: event.source,
          originalUrl: event.url || '',
          lastScraped: new Date(),
          status: 'new',
        },
      })
    ))

    // Mark missing events inactive
    const scrapedIds = scraped.map(e => e.id)
    await db.event.updateMany({
      where: { id: { notIn: scrapedIds }, status: { not: 'imported' } },
      data: { status: 'inactive' },
    })

    // Query from DB with filters
    const events = await db.event.findMany({
      where: {
        status: { not: 'inactive' },
        ...(category !== 'all' && { category: { equals: category, mode: 'insensitive' } }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { venue: { contains: search, mode: 'insensitive' } },
          ]
        }),
      },
      orderBy: { date: 'asc' },
    })

    const mapped = events.map(e => ({
      id: e.id,
      title: e.title,
      date: e.date,
      location: e.venue,
      url: e.originalUrl,
      image: e.imageUrl,
      price: 'See website',
      source: e.sourceWebsite,
      category: e.category,
      description: e.description,
      status: e.status,
    }))

    return Response.json({ success: true, count: mapped.length, events: mapped, lastUpdated: new Date().toISOString() })
  } catch (error) {
    console.error('Events API error:', error)
    return Response.json({ success: false, error: 'Failed to fetch events', events: [] }, { status: 500 })
  }
}