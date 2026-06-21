import Header from '../../components/Header'
import GameCard from '../../components/GameCard'
import { getAllGames, getAllCategories } from '../../lib/games'
import { notFound } from 'next/navigation'
import styles from '../categorie.module.css'

const CATEGORY_DESCRIPTIONS = {
  'Action': 'Jeux d\'action intenses : tir, combat, stickman et adrenaline. Plongez dans des jeux d\'action gratuits jouables en ligne.',
  'Puzzle': 'Jeux de réflexion et puzzles : match-3, mahjong, logique et énigmes. Stimulez votre cerveau avec nos puzzles gratuits.',
  'Course': 'Jeux de course : voiture, moto, drift et vitesse. Defiez la montre et vos adversaires sur nos circuits virtuels.',
  'Sport': 'Jeux de sport : football, basketball, tennis et plus. Vivez le frisson du sport gratuitement dans votre navigateur.',
  'Arcade': 'Jeux arcade classiques et modernes : runner, clicker, casual. Des jeux simples, addictifs et accessibles à tous.',
  'Aventure': 'Jeux d\'aventure : exploration, RPG, mondes ouverts. Embarquez pour des aventures épiques sans téléchargement.',
  'Stratégie': 'Jeux de stratégie : tower defense, échecs, gestion. Planifiez, construisez et conquérez dans nos jeux de stratégie.',
  'Multijoueur': 'Jeux multijoueur en ligne : affrontez d\'autres joueurs du monde entier. Competition et fun garantis.',
}

export async function generateStaticParams() {
  return getAllCategories().map(cat => ({
    slug: cat.name.toLowerCase(),
  }))
}

export async function generateMetadata({ params }) {
  const catName = decodeURIComponent(params.slug).charAt(0).toUpperCase() +
    decodeURIComponent(params.slug).slice(1)
  const desc = CATEGORY_DESCRIPTIONS[catName] || `Jeux de ${catName} gratuits en ligne sur NovArcade.`
  return {
    title: `Jeux ${catName} gratuits en ligne`,
    description: desc,
    alternates: { canonical: `https://novarcade.waaplink.com/categorie/${params.slug}` },
  }
}

export default function CategoryPage({ params }) {
  const catName = decodeURIComponent(params.slug).charAt(0).toUpperCase() +
    decodeURIComponent(params.slug).slice(1)
  const games = getAllGames().filter(g =>
    g.category.toLowerCase() === params.slug.toLowerCase()
  )

  if (games.length === 0) notFound()

  const desc = CATEGORY_DESCRIPTIONS[catName] || ''

  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Jeux ${catName} gratuits`,
    description: desc,
    numberOfItems: games.length,
  }

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }}
      />
      <div className={styles.page}>
        <div className={styles.inner}>
          <nav className={styles.breadcrumb}>
            <a href="/">Accueil</a> <span>/</span> <span>Jeux {catName}</span>
          </nav>
          <h1 className={styles.catH1}>Jeux {catName} gratuits</h1>
          {desc && <p className={styles.intro}>{desc}</p>}
          <p className={styles.count}>{games.length} jeux disponibles</p>
          <div className={styles.grid}>
            {games.map(g => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}