'use client'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

function DashboardContent() {
  const sessionData = useSession()
const session = sessionData?.data
const status = sessionData?.status
  const router = useRouter()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [importing, setImporting] = useState(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status])

  useEffect(() => {
    if (status === 'authenticated') fetchEvents()
  }, [filter, search, status])

  async function fetchEvents() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter !== 'all') params.set('status', filter)
      if (search) params.set('search', search)
      const res = await fetch(`/api/dashboard/events?${params}`)
      const data = await res.json()
      setEvents(data.events || [])
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  async function importEvent(eventId) {
    setImporting(eventId)
    try {
      const res = await fetch('/api/dashboard/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, importedBy: session?.user?.email, importNotes: 'Imported via dashboard' }),
      })
      const data = await res.json()
      if (data.success) fetchEvents()
    } catch (e) {
      console.error(e)
    }
    setImporting(null)
  }

  if (status === 'loading') return <div style={{color:'white',padding:'2rem',textAlign:'center'}}>Loading...</div>
  if (status === 'unauthenticated') return null

  const statusColors = { new: '#00C9B1', updated: '#F5C842', imported: '#888', inactive: '#ff4444' }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: 'white', fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ background: '#111118', borderBottom: '1px solid #2a2a3a', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a href="/" style={{ color: '#F5C842', textDecoration: 'none', fontWeight: 700, fontSize: '1.2rem' }}>← UrbanScout</a>
          <span style={{ color: '#666' }}>|</span>
          <span style={{ color: '#ccc' }}>Admin Dashboard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#888', fontSize: '0.9rem' }}>{session?.user?.email}</span>
          <button onClick={() => signOut({ callbackUrl: '/' })} style={{ background: '#1A1A24', border: '1px solid #333', color: '#ccc', padding: '0.4rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>Sign Out</button>
        </div>
      </div>

      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>Event Management</h1>
        <p style={{ color: '#888', marginBottom: '2rem' }}>Review and import scraped Sydney events</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {['all', 'new', 'updated', 'imported'].map(s => (
            <div key={s} style={{ background: '#111118', border: `1px solid ${filter === s ? '#F5C842' : '#2a2a3a'}`, borderRadius: '12px', padding: '1rem', cursor: 'pointer', textAlign: 'center' }} onClick={() => setFilter(s)}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: s === 'all' ? '#F5C842' : statusColors[s] }}>
                {s === 'all' ? events.length : events.filter(e => e.status === s).length}
              </div>
              <div style={{ color: '#888', fontSize: '0.85rem', textTransform: 'capitalize', marginTop: '0.25rem' }}>{s === 'all' ? 'Total Events' : s}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events..." style={{ flex: 1, background: '#111118', border: '1px solid #2a2a3a', borderRadius: '8px', padding: '0.6rem 1rem', color: 'white', outline: 'none' }} />
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{ background: '#111118', border: '1px solid #2a2a3a', borderRadius: '8px', padding: '0.6rem 1rem', color: 'white', outline: 'none' }}>
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="updated">Updated</option>
            <option value="imported">Imported</option>
            <option value="inactive">Inactive</option>
          </select>
          <button onClick={fetchEvents} style={{ background: '#F5C842', color: '#0A0A0F', border: 'none', borderRadius: '8px', padding: '0.6rem 1.2rem', fontWeight: 700, cursor: 'pointer' }}>Refresh</button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>Loading events...</div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>No events found</div>
        ) : (
          <div style={{ background: '#111118', borderRadius: '12px', border: '1px solid #2a2a3a', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2a2a3a' }}>
                  {['Event', 'Date', 'Venue', 'Category', 'Source', 'Status', 'Action'].map(h => (
                    <th key={h} style={{ padding: '0.8rem 1rem', textAlign: 'left', color: '#888', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.map((event, i) => (
                  <tr key={event.id} style={{ borderBottom: '1px solid #1a1a2a', background: i % 2 === 0 ? 'transparent' : '#0d0d15' }}>
                    <td style={{ padding: '0.8rem 1rem', maxWidth: '250px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.title}</div>
                    </td>
                    <td style={{ padding: '0.8rem 1rem', color: '#aaa', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                      {event.date ? new Date(event.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td style={{ padding: '0.8rem 1rem', color: '#aaa', fontSize: '0.85rem', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.location || '—'}</td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <span style={{ background: '#1A1A24', border: '1px solid #2a2a3a', borderRadius: '6px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', color: '#ccc' }}>{event.category || 'General'}</span>
                    </td>
                    <td style={{ padding: '0.8rem 1rem', color: '#888', fontSize: '0.8rem' }}>{event.source || '—'}</td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <span style={{ background: (statusColors[event.status] || '#666') + '22', border: `1px solid ${statusColors[event.status] || '#666'}`, color: statusColors[event.status] || '#666', borderRadius: '6px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', textTransform: 'capitalize' }}>
                        {event.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      {event.status !== 'imported' ? (
                        <button onClick={() => importEvent(event.id)} disabled={importing === event.id} style={{ background: importing === event.id ? '#333' : '#F5C842', color: '#0A0A0F', border: 'none', borderRadius: '6px', padding: '0.3rem 0.8rem', fontSize: '0.8rem', fontWeight: 700, cursor: importing === event.id ? 'not-allowed' : 'pointer' }}>
                          {importing === event.id ? '...' : 'Import'}
                        </button>
                      ) : (
                        <span style={{ color: '#00C9B1', fontSize: '0.8rem' }}>✓ Done</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return <DashboardContent />
}