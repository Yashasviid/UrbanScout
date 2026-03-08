'use client'

import { useState, useEffect, useCallback } from 'react'
import EventCard from './components/EventCard'

const CATEGORIES = ['All', 'Festival', 'Music', 'Arts & Culture', 'Market', 'Sport', 'Food & Drink', 'Film', 'Comedy', 'Family', 'Literature']

export default function Home() {
  const [events, setEvents] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)
  const [scraping, setScraping] = useState(false)

  const fetchEvents = useCallback(async (cat = 'all', q = '') => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (cat !== 'all') params.set('category', cat)
      if (q) params.set('search', q)
      const res = await fetch(`/api/events?${params}`)
      const data = await res.json()
      if (data.success) {
        setEvents(data.events)
        setFiltered(data.events)
        setLastUpdated(data.lastUpdated)
      } else {
        setError('Failed to load events.')
      }
    } catch {
      setError('Could not connect to events service.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const handleCategory = (cat) => {
    setActiveCategory(cat)
    fetchEvents(cat === 'All' ? 'all' : cat, search)
  }

  const handleSearch = (e) => {
    const q = e.target.value
    setSearch(q)
    // Debounce
    clearTimeout(window._searchTimer)
    window._searchTimer = setTimeout(() => {
      fetchEvents(activeCategory === 'All' ? 'all' : activeCategory, q)
    }, 400)
  }

  const handleRefresh = async () => {
    setScraping(true)
    await fetchEvents(activeCategory === 'All' ? 'all' : activeCategory, search)
    setScraping(false)
  }

  const formatLastUpdated = (iso) => {
    if (!iso) return ''
    const d = new Date(iso)
    return d.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <main>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-brand">
          <h2>Urban<span>Scout</span></h2>
        </div>
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }) }}>Contact Us</a>
        </div>
        <div className="nav-actions">
  <button className="nav-signup-btn" onClick={() => window.location.href='/login'}>
    Login
  </button>
  <button className="nav-signup-btn" onClick={() => window.location.href='/signup'}>
    Sign Up
  </button>
</div>
      </nav>

      {/* Hero */}
      <header className="hero">
        <div className="hero-bg">
          <div className="hero-orb orb-1" />
          <div className="hero-orb orb-2" />
          <div className="hero-orb orb-3" />
          <div className="hero-grid" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            Sydney, Australia
          </div>
          <h1 className="hero-title">
            What's On
            <span className="hero-title-accent"> Sydney</span>
          </h1>
          <p className="hero-sub">
            Live events, scraped fresh from across the web : concerts, markets, festivals & more
          </p>

          <div className="search-wrap">
            <div className="search-box">
              <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search events, venues, artists..."
                value={search}
                onChange={handleSearch}
                className="search-input"
              />
              {search && (
                <button className="search-clear" onClick={() => { setSearch(''); fetchEvents(activeCategory === 'All' ? 'all' : activeCategory, '') }}>
                  ✕
                </button>
              )}
            </div>
            <button className={`refresh-btn ${scraping ? 'spinning' : ''}`} onClick={handleRefresh} title="Refresh events">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0115-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 01-15 6.7L3 16"/>
              </svg>
            </button>
          </div>

          {lastUpdated && (
            <p className="last-updated">Last scraped at {formatLastUpdated(lastUpdated)}</p>
          )}
        </div>
      </header>

      {/* Category Filter */}
      <div className="filter-bar">
        <div className="filter-scroll">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <section className="events-section">
        <div className="events-header">
          <span className="events-count">
            {loading ? 'Loading...' : `${filtered.length} event${filtered.length !== 1 ? 's' : ''} found`}
          </span>
        </div>

        {loading && (
          <div className="loading-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-card" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="skeleton-img" />
                <div className="skeleton-body">
                  <div className="skeleton-line short" />
                  <div className="skeleton-line" />
                  <div className="skeleton-line medium" />
                  <div className="skeleton-line short" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="error-state">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
            <button className="retry-btn" onClick={handleRefresh}>Try Again</button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <h3>No events found</h3>
            <p>Try a different search or category</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="events-grid">
            {filtered.map((event, i) => (
              <EventCard key={event.id || i} event={event} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Contact Section */}
<section id="contact" className="contact-section">
  <div className="contact-inner">
    <div className="contact-info">
      <span className="contact-eyebrow">Get In Touch</span>
      <h2 className="contact-title">We'd love to <span>hear from you</span></h2>
      <p className="contact-desc">
        Have a Sydney event you'd like listed? A bug to report? Or just want to say g'day?
        Drop us a message and we'll get back to you within 24 hours.
      </p>
      <div className="contact-details">
        <div className="contact-detail-item">
          <div className="contact-detail-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <div>
            <p className="contact-detail-label">Email</p>
            <p className="contact-detail-value">hello@whatson.sydney</p>
          </div>
        </div>
        <div className="contact-detail-item">
          <div className="contact-detail-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div>
            <p className="contact-detail-label">Location</p>
            <p className="contact-detail-value">Sydney, NSW, Australia</p>
          </div>
        </div>
        <div className="contact-detail-item">
          <div className="contact-detail-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div>
            <p className="contact-detail-label">Response Time</p>
            <p className="contact-detail-value">Within 24 hours</p>
          </div>
        </div>
      </div>
    </div>

    <div className="contact-form-wrap">
      <form className="contact-form" onSubmit={(e) => {
        e.preventDefault()
        const btn = e.target.querySelector('.contact-submit')
        btn.textContent = '✓ Message Sent!'
        btn.style.background = '#059669'
        setTimeout(() => {
          btn.textContent = 'Send Message'
          btn.style.background = ''
          e.target.reset()
        }, 3000)
      }}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input type="text" className="form-input" placeholder="first" required />
          </div>
          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input type="text" className="form-input" placeholder="last" required />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input type="email" className="form-input" placeholder="your@example.com" required />
        </div>
        <div className="form-group">
          <label className="form-label">Subject</label>
          <select className="form-input form-select" required>
            <option value="">Select a subject...</option>
            <option>Submit an Event</option>
            <option>Report a Bug</option>
            <option>Partnership Enquiry</option>
            <option>General Question</option>
            <option>Other</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Message</label>
          <textarea className="form-input form-textarea" placeholder="Tell us what's on your mind..." required rows={5} />
        </div>
        <button type="submit" className="contact-submit">Send Message</button>
      </form>
    </div>
  </div>
</section>

<footer className="site-footer">
  <div className="footer-inner">
    <div className="footer-top">
      <div className="footer-brand">
        <h3>Urban<span>Scout</span></h3>
        <p>Your guide to the best events happening across Sydney, updated in real time.</p>
      </div>
      <div className="footer-links-group">
        <h4>Explore</h4>
        <a href="#">All Events</a>
        <a href="#">Music</a>
        <a href="#">Festivals</a>
        <a href="#">Markets</a>
      </div>
      <div className="footer-links-group">
        <h4>Company</h4>
        <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }) }}>Contact Us</a>
        <a href="#">About</a>
        <a href="#">Privacy Policy</a>
      </div>
    </div>
    <div className="footer-bottom">
      <p>🦘 © {new Date().getFullYear()} UrbanScout · All rights reserved</p>
      <p>get updated on what's on Sydney !</p>
    </div>
  </div>
</footer>
    </main>
  )
}
