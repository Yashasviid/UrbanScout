import './globals.css'

export const metadata = {
  title: "UrbanScout : Live Events",
  description: 'Discover events happening in Sydney, Australia. Concerts, festivals, markets, sport and more : updated automatically.',
  openGraph: {
    title: "UrbanScout",
    description: 'Your guide to live events in Sydney, Australia.',
    locale: 'en_AU',
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en-AU">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;1,9..144,400&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
