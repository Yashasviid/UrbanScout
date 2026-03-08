export async function scrapeSydneyEvents() {
  const apiKey = process.env.TICKETMASTER_API_KEY

  if (apiKey) {
    try {
      const today = new Date().toISOString().split('.')[0] + 'Z'
      const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&city=Sydney&countryCode=AU&startDateTime=${today}&size=20&sort=date,asc`
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
      const data = await res.json()
      const items = data?._embedded?.events
      if (items && items.length > 0) {
        return items.map((e, i) => ({
          id: e.id || `tm-${i}`,
          title: e.name,
          date: e.dates?.start?.dateTime || e.dates?.start?.localDate,
          location: (e._embedded?.venues?.[0]?.name || '') + ', Sydney',
          url: e.url,
          image: e.images?.find(img => img.ratio === '16_9' && img.width > 500)?.url || e.images?.[0]?.url,
          price: e.priceRanges ? `From $${Math.round(e.priceRanges[0].min)}` : 'See website',
          source: 'Ticketmaster',
          category: e.classifications?.[0]?.segment?.name || 'General',
          description: e.info || e.pleaseNote || '',
        }))
      }
    } catch (err) {
      console.error('Ticketmaster error:', err.message)
    }
  }

  return getMockEvents()
}

function getMockEvents() {
  const from = (daysAhead, hour = 19) => {
    const d = new Date()
    d.setDate(d.getDate() + daysAhead)
    d.setHours(hour, 30, 0, 0)
    return d.toISOString()
  }
  return [
    { id:'mock-1', title:'Vivid Sydney Light Festival', date:from(5), location:'Circular Quay & CBD, Sydney', url:'https://www.vividsydney.com', image:'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80', price:'Free', source:'Vivid Sydney', category:'Festival', description:"The world's largest festival of light, music and ideas." },
    { id:'mock-2', title:"Sydney Symphony Orchestra — Beethoven's 9th", date:from(8), location:'Sydney Opera House', url:'https://www.sydneysymphony.com', image:'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80', price:'From $49', source:'Sydney Symphony', category:'Music', description:"Experience Beethoven's Ninth Symphony at the Opera House." },
    { id:'mock-3', title:'Carriageworks Farmers Market', date:from(2,8), location:'Carriageworks, Eveleigh', url:'https://carriageworks.com.au', image:'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80', price:'Free Entry', source:"What's On Sydney", category:'Market', description:"Sydney's most beloved weekly farmers market." },
    { id:'mock-4', title:'Art Gallery NSW: Archibald Prize', date:from(1,10), location:'Art Gallery of NSW', url:'https://www.artgallery.nsw.gov.au', image:'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80', price:'Free', source:'Art Gallery NSW', category:'Arts & Culture', description:"Australia's most prestigious portraiture prize." },
    { id:'mock-5', title:'Sydney FC — A-League Match', date:from(6), location:'Allianz Stadium, Moore Park', url:'https://www.sydneyfc.com', image:'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80', price:'From $28', source:'Ticketek', category:'Sport', description:'Crucial A-League clash at the newly redeveloped Allianz Stadium.' },
    { id:'mock-6', title:'Bondi Beach Markets', date:from(3,10), location:'Bondi Beach Public School', url:'https://www.bondimarkets.com.au', image:'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80', price:'Free Entry', source:'Eventbrite', category:'Market', description:"Sydney's iconic beachside market." },
    { id:'mock-7', title:'Live Music at Qudos Bank Arena', date:from(14), location:'Qudos Bank Arena, Olympic Park', url:'https://www.ticketmaster.com.au', image:'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80', price:'From $95', source:'Ticketmaster', category:'Music', description:"A massive live concert night at one of Sydney's biggest arenas." },
    { id:'mock-8', title:"Sydney Writers' Festival", date:from(10,9), location:'Carriageworks & Walsh Bay', url:'https://www.swf.org.au', image:'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80', price:'Free – $45', source:"What's On Sydney", category:'Literature', description:"Australia's largest literary festival." },
    { id:'mock-9', title:'Sydney Comedy Night', date:from(7,20), location:'State Theatre, CBD', url:'https://www.sydneycomedyfest.com.au', image:'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800&q=80', price:'From $39', source:'Eventbrite', category:'Comedy', description:"Sydney's best comedians at the iconic State Theatre." },
    { id:'mock-10', title:'Taronga Zoo After Dark', date:from(9), location:'Taronga Zoo, Mosman', url:'https://taronga.org.au', image:'https://images.unsplash.com/photo-1550358864-518f202c02ba?w=800&q=80', price:'From $55', source:'Ticketek', category:'Family', description:'Nocturnal animal encounters, live music and gourmet food.' },
    { id:'mock-11', title:'Queer Screen Film Festival', date:from(11), location:'Event Cinemas George St', url:'https://queerscreen.org.au', image:'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80', price:'From $20', source:'Eventbrite', category:'Film', description:"Exceptional queer cinema from around the world." },
    { id:'mock-12', title:'Gelato Festival Sydney', date:from(18), location:'Darling Harbour', url:'https://www.gelatofestival.com.au', image:'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80', price:'$15 entry', source:'Eventbrite', category:'Food & Drink', description:"30+ gelato makers competing for Australia's Best Gelato." },
    { id:'mock-13', title:'Sydney Harbour Bridge Climb', date:from(4,6), location:'BridgeClimb Sydney, The Rocks', url:'https://www.bridgeclimb.com', image:'https://images.unsplash.com/photo-1524293581917-878a6d017c71?w=800&q=80', price:'From $174', source:'BridgeClimb', category:'Family', description:"360° views over Sydney from the bridge summit." },
    { id:'mock-14', title:'Newtown Street Festival', date:from(12,10), location:'Camperdown Park, Newtown', url:'https://www.newtownfestival.com.au', image:'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80', price:'Free', source:"What's On Sydney", category:'Festival', description:"Sydney's most eclectic community festival." },
    { id:'mock-15', title:'Taste of Sydney Food Festival', date:from(15), location:'Centennial Park', url:'https://tasteofsydney.com.au', image:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', price:'From $30', source:'Eventbrite', category:'Food & Drink', description:"Sydney's best restaurants and celebrity chefs." },
    { id:'mock-16', title:'Sydney Swans vs GWS Giants — AFL Derby', date:from(20), location:'SCG — Sydney Cricket Ground', url:'https://www.sydneyswans.com.au', image:'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80', price:'From $32', source:'Ticketek', category:'Sport', description:"The fiercest rivalry in Sydney football." },
  ]
}