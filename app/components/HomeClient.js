'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import GameCard from './GameCard'
import styles from './HomeClient.module.css'

const CATEGORY_ICONS = {
  'Action': '⚡',
  'Puzzle': '🧩',
  'Course': '🏎️',
  'Arcade': '🕹️',
  'Stratégie': '♟️',
  'Multijoueur': '👥',
  'Mots': '💬',
}

export default function HomeClient({ games, categories }) {
  const searchParams = useSearchParams()
  const [activeCategory, setActiveCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [displayed, setDisplayed] = useState(games)

  useEffect(() => {
    const search = searchParams.get('search') || ''
    const cat = searchParams.get('category') || null
    setSearchQuery(search)
    setActiveCategory(cat)
  }, [searchParams])

  useEffect(() => {
    let filtered = games
    if (activeCategory) {
      filtered = filtered.filter(g => g.category === activeCategory)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(g =>
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.tags.some(t => t.includes(q))
      )
    }
    setDisplayed(filtered)
  }, [activeCategory, searchQuery, games])

  const featured = games.filter(g => g.featured).slice(0, 4)
  const showHero = !activeCategory && !searchQuery

  function selectCategory(name) {
    const next = activeCategory === name ? null : name
    setActiveCategory(next)
    setSearchQuery('')
    const url = next ? `/?category=${encodeURIComponent(next)}` : '/'
    window.history.pushState({}, '', url)
  }

  return (
    <div className={styles.page}>
      {showHero && (
        <section className={styles.hero}>
          <div className={styles.heroGlow} />
          <div className={styles.heroContent}>
            <p className={styles.heroEyebrow}>+ de 1 000 jeux gratuits</p>
            <h1 className={styles.heroTitle}>
              Joue maintenant.<br/>
              <span className={styles.heroAccent}>Aucune installation.</span>
            </h1>
            <p className={styles.heroSub}>
              Arcade, puzzle, action, course... Des centaines de jeux HTML5 directement dans ton navigateur.
            </p>
          </div>
        </section>
      )}

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <p className={styles.sidebarLabel}>Catégories</p>
          <button
            className={`${styles.catBtn} ${!activeCategory ? styles.catActive : ''}`}
            onClick={() => selectCategory(null)}
          >
            <span>🎮</span> Tous les jeux
            <span className={styles.catCount}>{games.length}</span>
          </button>
          {categories.map(cat => (
            <button
              key={cat.name}
              className={`${styles.catBtn} ${activeCategory === cat.name ? styles.catActive : ''}`}
              onClick={() => selectCategory(cat.name)}
            >
              <span>{CATEGORY_ICONS[cat.name] || '🎯'}</span>
              {cat.name}
              <span className={styles.catCount}>{cat.count}</span>
            </button>
          ))}
        </aside>

        <main className={styles.main}>
          {showHero && featured.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionDot} />
                Jeux populaires
              </h2>
              <div className={styles.featuredGrid}>
                {featured.map(game => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            </section>
          )}

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionDot} style={{background:'#06b6d4'}} />
              {activeCategory ? activeCategory : searchQuery ? `Résultats pour "${searchQuery}"` : 'Tous les jeux'}
              <span className={styles.sectionCount}>{displayed.length}</span>
            </h2>

            {displayed.length === 0 ? (
              <div className={styles.empty}>
                <p>Aucun jeu trouvé.</p>
                <button onClick={() => { setActiveCategory(null); setSearchQuery(''); window.history.pushState({},'',' /'); }}>
                  Voir tous les jeux
                </button>
              </div>
            ) : (
              <div className={styles.grid}>
                {displayed.map(game => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
