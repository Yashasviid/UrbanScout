'use client'

import { useState } from 'react'

const CATEGORY_COLORS = {
  'Festival': '#FF6B35',
  'Music': '#7C3AED',
  'Market': '#059669',
  'Arts & Culture': '#DC2626',
  'Sport': '#2563EB',
  'Literature': '#92400E',
  'Comedy': '#D97706',
  'Family': '#0891B2',
  'Film': '#1D4ED8',
  'Food & Drink': '#BE185D',
  'General': '#6B7280',
  'Entertainment': '#7C3AED',
  'Community': '#059669',
}

function formatDate(dateStr) {
  if (!dateStr) return 'Date TBC'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-AU', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    const hours = d.getHours()
    if (hours === 0) return ''
    return d.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

export default function EventCard({ event, index }) {
  const [imgError, setImgError] = useState(false)
  const color = CATEGORY_COLORS[event.category] || '#6B7280'
  const time = formatTime(event.date)

  return (
    <article
      className="event-card"
      style={{ '--accent': color, animationDelay: `${index * 60}ms` }}
    >
      <div className="card-image-wrap">
        {event.image && !imgError ? (
          <img
            src={event.image}
            alt={event.title}
            className="card-img"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="card-img-placeholder" style={{ background: `linear-gradient(135deg, ${color}22, ${color}44)` }}>
            <span className="placeholder-icon">{getCategoryEmoji(event.category)}</span>
          </div>
        )}
        <span className="category-badge" style={{ background: color }}>
          {event.category || 'Event'}
        </span>
      </div>

      <div className="card-body">
        <div className="card-meta">
          <span className="card-date">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {formatDate(event.date)}
            {time && <span className="time-pill">{time}</span>}
          </span>
        </div>

        <h3 className="card-title">{event.title}</h3>

        <p className="card-location">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          {event.location}
        </p>

        {event.description && (
          <p className="card-desc">{event.description}</p>
        )}

        <div className="card-footer">
          <span className="card-price" style={{ color }}>
            {event.price || 'See website'}
          </span>
          <a
            href={event.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="card-btn"
            style={{ '--btn-color': color }}
          >
            Get Tickets
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

        <div className="card-source">via {event.source}</div>
      </div>
    </article>
  )
}

function getCategoryEmoji(cat) {
  const map = {
    'Festival': '🎆', 'Music': '🎵', 'Market': '🛍️',
    'Arts & Culture': '🎨', 'Sport': '⚽', 'Literature': '📚',
    'Comedy': '😂', 'Family': '👨‍👩‍👧', 'Film': '🎬',
    'Food & Drink': '🍽️', 'General': '📅', 'Entertainment': '🎭',
    'Community': '🤝',
  }
  return map[cat] || '🗓️'
}
