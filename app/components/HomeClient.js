'use client'
import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import GameCard from './GameCard'
import styles from './HomeClient.module.css'

const CATEGORY_ICONS = {
  'Action':       '⚡',
  'Aventure':     '🗺️',
  'Arcade':       '🕹️',
  'Course':       '🏎️',
  'Multijoueur':  '👥',
  'Puzzle':       '🧩',
  'Sport':        '⚽',
  'Stratégie':    '♟️',
}

const SORTS = [
  { id: 'popular',  label: '🔥 Populaires' },
  { id: 'rating',   label: '⭐ Mieux notés' },
  { id: 'newest',   label: '✨ Nouveautés' },
  { id: 'alpha',    label: '🔤 A-Z' },
]

export default function HomeClient({ games, categories }) {
  const searchParams = useSearchParams()

  const [activeCategories, setActiveCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sort, setSort] = useState('popular')
  const [displayed, setDisplayed] = useState(games)

  // Init depuis URL
  useEffect(() => {
    const search = searchParams.get('search') || ''
    const cats = searchParams.get('category')
    const sortParam = searchParams.get('sort')
    setSearchQuery(search)
    setActiveCategories(cats ? cats.split(',').filter(Boolean) : [])
    if (sortParam && SORTS.find(s => s.id === sortParam)) setSort(sortParam)
  }, [searchParams])

  // Recalcul liste filtrée
  useEffect(() => {
    let filtered = games

    if (activeCategories.length > 0) {
      filtered = filtered.filter(g => activeCategories.includes(g.category))
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(g =>
        g.title.toLowerCase().includes(q) ||
        (g.description || '').toLowerCase().includes(q) ||
        (g.tags || []).some(t => t.includes(q))
      )
    }

    // Tri
    const sorted = [...filtered]
    if (sort === 'rating') sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    else if (sort === 'newest') sorted.sort((a, b) => (b.plays || 0) - (a.plays || 0))
    else if (sort === 'alpha') sorted.sort((a, b) => a.title.localeCompare(b.title))
    else sorted.sort((a, b) => (b.plays || 0) - (a.plays || 0))

    setDisplayed(sorted)
  }, [activeCategories, searchQuery, sort, games])

  const featured = useMemo(() =>
    [...games].filter(g => g.featured).sort((a, b) => (b.plays || 0) - (a.plays || 0)).slice(0, 8),
  [games])

  const showHero = activeCategories.length === 0 && !searchQuery

  function toggleCategory(name) {
    const next = activeCategories.includes(name)
      ? activeCategories.filter(c => c !== name)
      : [...activeCategories, name]
    setActiveCategories(next)
    updateUrl(next, searchQuery, sort)
  }

  function clearCategories() {
    setActiveCategories([])
    updateUrl([], searchQuery, sort)
  }

  function updateUrl(cats, search, s) {
    const params = new URLSearchParams()
    if (cats.length > 0) params.set('category', cats.join(','))
    if (search) params.set('search', search)
    if (s && s !== 'popular') params.set('sort', s)
    const qs = params.toString()
    const url = qs ? `/?${qs}` : '/'
    window.history.pushState({}, '', url)
  }

  const total = games.length

  return (
    <div className={styles.page}>
      {showHero && (
        <section className={styles.hero}>
          <div className={styles.heroGlow} />
          <div className={styles.heroContent}>
            <p className={styles.heroEyebrow}>+ de 3 800 jeux gratuits</p>
            <h1 className={styles.heroTitle}>
              Joue maintenant.<br/>
              <span className={styles.heroAccent}>Aucune installation.</span>
            </h1>
            <p className={styles.heroSub}>
              Action, puzzle, course, aventure... Des milliers de jeux HTML5 directement dans ton navigateur.
            </p>
          </div>
        </section>
      )}

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <p className={styles.sidebarLabel}>Catégories</p>
          <button
            className={`${styles.catBtn} ${activeCategories.length === 0 ? styles.catActive : ''}`}
            onClick={clearCategories}
          >
            <span>🎮</span> Tous les jeux
            <span className={styles.catCount}>{total}</span>
          </button>
          {categories.map(cat => {
            const active = activeCategories.includes(cat.name)
            return (
              <button
                key={cat.name}
                className={`${styles.catBtn} ${active ? styles.catActive : ''}`}
                onClick={() => toggleCategory(cat.name)}
              >
                <span>{CATEGORY_ICONS[cat.name] || '🎯'}</span>
                {cat.name}
                <span className={styles.catCount}>{cat.count}</span>
              </button>
            )
          })}
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
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionDot} style={{background:'#06b6d4'}} />
                {searchQuery
                  ? `Résultats pour "${searchQuery}"`
                  : activeCategories.length > 0
                    ? activeCategories.join(' + ')
                    : 'Tous les jeux'}
                <span className={styles.sectionCount}>{displayed.length}</span>
              </h2>
              <div className={styles.sortBar}>
                {SORTS.map(s => (
                  <button
                    key={s.id}
                    className={`${styles.sortBtn} ${sort === s.id ? styles.sortActive : ''}`}
                    onClick={() => { setSort(s.id); updateUrl(activeCategories, searchQuery, s.id) }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {activeCategories.length > 0 && (
              <div className={styles.activeFilters}>
                {activeCategories.map(c => (
                  <span key={c} className={styles.filterChip}>
                    {CATEGORY_ICONS[c] || '🎯'} {c}
                    <button onClick={() => toggleCategory(c)} aria-label={`Retirer ${c}`}>×</button>
                  </span>
                ))}
                <button className={styles.clearAll} onClick={clearCategories}>Tout effacer</button>
              </div>
            )}

            {displayed.length === 0 ? (
              <div className={styles.empty}>
                <p>Aucun jeu trouvé.</p>
                <button onClick={() => { clearCategories(); setSearchQuery(''); updateUrl([], '', sort) }}>
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