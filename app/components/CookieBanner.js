'use client'
import { useEffect, useState } from 'react'
import styles from './CookieBanner.module.css'

const STORAGE_KEY = 'cookie-consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const consent = localStorage.getItem(STORAGE_KEY)
      if (!consent) setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [])

  function handleChoice(accepted) {
    try {
      localStorage.setItem(STORAGE_KEY, accepted ? 'accepted' : 'refused')
    } catch {
      /* ignore */
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className={styles.banner} role="dialog" aria-label="Consentement cookies">
      <div className={styles.inner}>
        <div className={styles.text}>
          <p>
            Nous utilisons des cookies pour la publicité (Google AdSense, Monetag) et la mesure
            d'audience. Vous pouvez accepter ou refuser les cookies publicitaires à tout moment.
          </p>
        </div>
        <div className={styles.actions}>
          <a href="/privacy" className={styles.more}>
            En savoir plus
          </a>
          <button
            className={styles.btnRefuse}
            onClick={() => handleChoice(false)}
            aria-label="Refuser les cookies"
          >
            Refuser
          </button>
          <button
            className={styles.btnAccept}
            onClick={() => handleChoice(true)}
            aria-label="Accepter les cookies"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  )
}