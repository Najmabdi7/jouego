import { notFound } from 'next/navigation'
import Header from '../../components/Header'
import AdSlot from '../../components/AdSlot'
import { getGameBySlug, getAllGames, formatPlays } from '../../lib/games'
import GameCard from '../../components/GameCard'
import FullscreenButton from './FullscreenButton'
import RotateHint from './RotateHint'
import styles from './game.module.css'

export async function generateStaticParams() {
  const games = getAllGames()
  return games.map(g => ({ slug: g.slug }))
}

export async function generateMetadata({ params }) {
  const game = getGameBySlug(params.slug)
  if (!game) return {}
  const title = `${game.title} — Jouer gratuitement sur NovArcade`
  const description = game.description.length > 155
    ? game.description.substring(0, 152) + '...'
    : game.description
  return {
    title,
    description,
    alternates: {
      canonical: `https://novarcade.waaplink.com/game/${game.slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://novarcade.waaplink.com/game/${game.slug}`,
      siteName: 'NovArcade',
      locale: 'fr_FR',
      images: [{ url: game.thumbnail, width: 200, height: 200, alt: game.title }],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: [game.thumbnail],
    },
  }
}

function GameJsonLd({ game }) {
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.title,
    description: game.description,
    genre: game.category,
    url: `https://novarcade.waaplink.com/game/${game.slug}`,
    image: game.thumbnail,
    applicationCategory: 'Game',
    operatingSystem: 'Any (Web Browser)',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: game.rating,
      bestRating: '5',
      ratingCount: Math.max(game.plays, 1),
    },
    keywords: game.tags.join(', '),
    inLanguage: 'fr',
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }}
    />
  )
}

export default function GamePage({ params }) {
  const game = getGameBySlug(params.slug)
  if (!game) notFound()

  const allGames = getAllGames()
  const related = allGames
    .filter(g => g.category === game.category && g.slug !== game.slug)
    .slice(0, 4)

  return (
    <>
      <Header />
      <GameJsonLd game={game} />
      <RotateHint />
      <div className={styles.page}>
        <div className={styles.inner}>
          <nav className={styles.breadcrumb}>
            <a href="/">Accueil</a>
            <span>/</span>
            <a href={`/?category=${game.category}`}>{game.category}</a>
            <span>/</span>
            <span>{game.title}</span>
          </nav>

          <div className={styles.layout}>
            <div className={styles.gameArea}>
              <div className={styles.frameWrap}>
                <iframe
                  id={`game-${game.slug}`}
                  src={game.url}
                  title={game.title}
                  className={styles.frame}
                  allowFullScreen
                  allow="autoplay; fullscreen *; geolocation; microphone; camera; midi; monetization; xr-spatial-tracking; gamepad; gyroscope; accelerometer; xr"
                  scrolling="no"
                  frameBorder="0"
                  loading="lazy"
                  playsInline
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className={styles.gameInfo}>
                <div className={styles.gameHeader}>
                  <div>
                    <h1 className={styles.gameTitle}>{game.title}</h1>
                    <div className={styles.gameMeta}>
                      <span className={styles.catTag}>{game.category}</span>
                      <span className={styles.rating}>
                        <svg viewBox="0 0 24 24" fill="#f59e0b" width="14" height="14">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        {game.rating.toFixed(1)}
                      </span>
                      <span className={styles.plays}>{formatPlays(game.plays)} parties jouées</span>
                    </div>
                  </div>
                  <FullscreenButton targetId={`game-${game.slug}`} />
                </div>
                <p className={styles.description}>{game.description}</p>
                <div className={styles.tags}>
                  {game.tags.map(tag => (
                    <span key={tag} className={styles.tag}>#{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {related.length > 0 && (
              <aside className={styles.related}>
                <AdSlot slot="3333333333" format="rectangle" />
                <h2 className={styles.relatedTitle}>Similaires</h2>
                <div className={styles.relatedList}>
                  {related.map(g => (
                    <GameCard key={g.id} game={g} />
                  ))}
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
