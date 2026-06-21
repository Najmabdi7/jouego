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
          <span className={styles.footerLogo}>Jouego.</span>
          <p>Des jeux gratuits pour tout le monde, partout, tout le temps.</p>
          <div className={styles.footerLinks}>
            <a href="/top-jeux">Top jeux</a> · <a href="/nouveautes">Nouveautés</a> · <a href="/blog">Blog</a> · <a href="/categorie/action">Action</a> · <a href="/categorie/puzzle">Puzzle</a> · <a href="/categorie/course">Course</a> · <a href="/categorie/sport">Sport</a> · <a href="/categorie/arcade">Arcade</a> · <a href="/categorie/aventure">Aventure</a> · <a href="/categorie/stratégie">Stratégie</a> · <a href="/categorie/multijoueur">Multijoueur</a>
          </div>
          <p className={styles.footerBottom}>
            <a href="/privacy">Confidentialité</a> · <a href="/contact">Contact</a>
          </p>
        </div>
      </footer>
    </>
  )
}
