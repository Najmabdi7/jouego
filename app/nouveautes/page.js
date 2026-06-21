import Header from '../components/Header'
import GameCard from '../components/GameCard'
import { getAllGames } from '../lib/games'
import styles from '../seo.module.css'

export const metadata = {
  title: 'Nouveaux jeux gratuits — Dernières nouveautés HTML5',
  description: 'Les derniers jeux ajoutés sur Jouego. Découvrez les nouveautés et jouez gratuitement aux jeux HTML5 les plus récents.',
  alternates: { canonical: 'https://jouego.waaplink.com/nouveautes' },
}

export default function NouveautesPage() {
  const games = getAllGames()
  const newGames = [...games]
    .reverse()
    .slice(0, 48)

  return (
    <>
      <Header />
      <div className={styles.page}>
        <div className={styles.inner}>
          <h1 className={styles.seoH1}>Nouveaux jeux gratuits</h1>
          <p className={styles.intro}>
            Découvrez les derniers jeux ajoutés sur Jouego. De nouveaux jeux HTML5
            sont régulièrement intégrés — restez à l'affût des dernières nouveautés !
          </p>

          <div className={styles.grid}>
            {newGames.map(g => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}