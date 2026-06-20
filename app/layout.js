import Script from 'next/script'
import './globals.css'

export const metadata = {
  title: 'NovArcade — Jeux gratuits en ligne',
  description: 'Des centaines de jeux HTML5 gratuits à jouer directement dans ton navigateur. Action, puzzle, course, aventure... Lance-toi sur NovArcade !',
  keywords: 'jeux gratuits, jeux en ligne, jeux navigateur, HTML5, arcade, puzzle, action',
  openGraph: {
    title: 'NovArcade — Jeux gratuits en ligne',
    description: 'Des centaines de jeux HTML5 gratuits à jouer directement dans ton navigateur.',
    type: 'website',
  },
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