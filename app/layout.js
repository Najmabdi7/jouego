import Script from 'next/script'
import CookieBanner from './components/CookieBanner'
import './globals.css'

export const metadata = {
  metadataBase: new URL('https://jouego.waaplink.com'),
  title: {
    default: 'Jouego — Jeux gratuits en ligne',
    template: '%s | Jouego',
  },
  description: 'Des centaines de jeux HTML5 gratuits à jouer directement dans ton navigateur. Action, puzzle, course, aventure... Lance-toi sur Jouego !',
  keywords: 'jeux gratuits, jeux en ligne, jeux navigateur, HTML5, arcade, puzzle, action, course, aventure, sport, stratégie, multijoueur',
  authors: [{ name: 'Jouego' }],
  creator: 'Jouego',
  publisher: 'Jouego',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Jouego — Jeux gratuits en ligne',
    description: 'Des centaines de jeux HTML5 gratuits à jouer directement dans ton navigateur.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Jouego',
    url: 'https://jouego.waaplink.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jouego — Jeux gratuits en ligne',
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
        <meta name="monetag" content="9ccc74e1feb232dd8ce864d1325fbfb2" />
        <Script async src="https://nap5k.com/tag.min.js" data-zone="11183606" strategy="afterInteractive" />
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}