import { Suspense } from 'react'
import Header from './components/Header'
import HomeClient from './components/HomeClient'
import { getAllGames, getAllCategories } from './lib/games'
import styles from './page.module.css'

export default function Home() {
  const games = getAllGames()
  const categories = getAllCategories()

  return (
    <>
      <Header />
      <Suspense fallback={<div className={styles.loading}>Chargement...</div>}>
        <HomeClient games={games} categories={categories} />
      </Suspense>
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
