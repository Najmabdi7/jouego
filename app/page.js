import { Suspense } from 'react'
import Header from './components/Header'
import HomeClient from './components/HomeClient'
import AdSlot from './components/AdSlot'
import { getAllGames, getAllCategories } from './lib/games'
import styles from './page.module.css'

export default function Home() {
  const games = getAllGames()
  const categories = getAllCategories()

  return (
    <>
      <Header />
      <AdSlot slot="1111111111" format="horizontal" />
      <Suspense fallback={<div className={styles.loading}>Chargement...</div>}>
        <HomeClient games={games} categories={categories} />
      </Suspense>
      <AdSlot slot="2222222222" format="horizontal" />
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span className={styles.footerLogo}>NovArcade.</span>
          <p>Des jeux gratuits pour tout le monde, partout, tout le temps.</p>
          <p className={styles.footerLinks}>
            <a href="#">Confidentialité</a> · <a href="#">Contact</a> · <a href="#">Ajouter un jeu</a>
          </p>
        </div>
      </footer>
    </>
  )
}
