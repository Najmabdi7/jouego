'use client'

import { useEffect, useState } from 'react'
import styles from './game.module.css'

const DISMISS_KEY = 'jouego-rotate-hint-dismissed'

/**
 * Shows a "rotate your phone" overlay on portrait mobile devices.
 *
 * Many HTML5 games from GamePix are designed for landscape orientation.
 * On a portrait phone the play area is tiny and unreadable, so we nudge
 * the user to rotate. The hint can be dismissed and the dismissal is
 * remembered in localStorage so it doesn't nag the user again.
 *
 * Hidden on:
 *  - Desktop / tablet (>= 900px)
 *  - Landscape orientation (the iframe already fills the screen)
 *  - When the user has dismissed it once
 */
export default function RotateHint() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const evaluate = () => {
      const isMobile = window.matchMedia('(max-width: 900px)').matches
      const isPortrait = window.matchMedia('(orientation: portrait)').matches
      const dismissed = window.localStorage.getItem(DISMISS_KEY) === '1'
      setVisible(isMobile && isPortrait && !dismissed)
    }

    evaluate()
    window.addEventListener('resize', evaluate)
    window.addEventListener('orientationchange', evaluate)
    return () => {
      window.removeEventListener('resize', evaluate)
      window.removeEventListener('orientationchange', evaluate)
    }
  }, [])

  const dismiss = () => {
    try {
      window.localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      // private mode / storage disabled -> ignore
    }
    setVisible(false)
  }

  return (
    <div
      className={`${styles.rotateHint} ${visible ? styles.rotateHintVisible : ''}`}
      role="dialog"
      aria-hidden={!visible}
    >
      <div className={styles.rotateHintIcon} aria-hidden>
        📱
      </div>
      <div className={styles.rotateHintText}>
        Tourne ton téléphone pour jouer
      </div>
      <button
        className={styles.rotateHintDismiss}
        onClick={dismiss}
        type="button"
      >
        Jouer quand même
      </button>
    </div>
  )
}