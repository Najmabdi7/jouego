'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './Header.module.css'

export default function Header() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  function handleSearch(e) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/?search=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="/" className={styles.logo}>
          <span className={styles.logoNov}>Nov</span>
          <span className={styles.logoArcade}>Arcade</span>
          <span className={styles.logoDot}>.</span>
        </a>

        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.searchWrap}>
            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Rechercher un jeu..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </form>

        <nav className={styles.nav}>
          <a href="/" className={styles.navLink}>Accueil</a>
          <a href="/?category=Action" className={styles.navLink}>Action</a>
          <a href="/?category=Puzzle" className={styles.navLink}>Puzzle</a>
          <a href="/?category=Course" className={styles.navLink}>Course</a>
        </nav>
      </div>
    </header>
  )
}
