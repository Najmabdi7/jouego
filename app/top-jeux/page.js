import Header from '../components/Header'
import GameCard from '../components/GameCard'
import { getAllGames, getAllCategories } from '../lib/games'
import styles from '../seo.module.css'

export const metadata = {
  title: 'Top jeux gratuits en ligne — Les meilleurs jeux HTML5',
  description: 'Découvrez le top des meilleurs jeux gratuits à jouer en ligne sans téléchargement. Action, puzzle, course, sport et plus sur Jouego.',
  alternates: { canonical: 'https://jouego.waaplink.com/top-jeux' },
}

export default function TopJeuxPage() {
  const games = getAllGames()
  const topGames = [...games]
    .sort((a, b) => b.rating - a.rating || b.plays - a.plays)
    .slice(0, 60)

  return (
    <>
      <Header />
      <div className={styles.page}>
        <div className={styles.inner}>
          <h1 className={styles.seoH1}>Top jeux gratuits en ligne</h1>
          <p className={styles.intro}>
            Bienvenue sur le classement des meilleurs jeux gratuits sur Jouego.
            Tous ces jeux se jouent directement dans votre navigateur, sans téléchargement
            ni installation. Voici les 60 jeux les mieux notés par notre communauté.
          </p>

          <div className={styles.grid}>
            {topGames.map(g => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}