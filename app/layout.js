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

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
