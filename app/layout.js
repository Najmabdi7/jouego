import Script from 'next/script'
import './globals.css'

export const metadata = {
  metadataBase: new URL('https://novarcade.waaplink.com'),
  title: {
    default: 'NovArcade — Jeux gratuits en ligne',
    template: '%s | NovArcade',
  },
  description: 'Des centaines de jeux HTML5 gratuits à jouer directement dans ton navigateur. Action, puzzle, course, aventure... Lance-toi sur NovArcade !',
  keywords: 'jeux gratuits, jeux en ligne, jeux navigateur, HTML5, arcade, puzzle, action, course, aventure, sport, stratégie, multijoueur',
  authors: [{ name: 'NovArcade' }],
  creator: 'NovArcade',
  publisher: 'NovArcade',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'NovArcade — Jeux gratuits en ligne',
    description: 'Des centaines de jeux HTML5 gratuits à jouer directement dans ton navigateur.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'NovArcade',
    url: 'https://novarcade.waaplink.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NovArcade — Jeux gratuits en ligne',
    description: 'Des centaines de jeux HTML5 gratuits à jouer directement dans ton navigateur.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0a0a0f',
}

const ADSENSE_ID = 'ca-pub-9490161916567429'

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}