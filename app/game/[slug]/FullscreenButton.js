'use client'

import { useEffect, useState } from 'react'
import styles from './FullscreenButton.module.css'

/**
 * Mobile-aware fullscreen toggle for iframe games.
 *
 * Strategy:
 *  - Desktop: use native Fullscreen API.
 *  - Mobile: try native first, but iOS Safari blocks it on cross-origin iframes,
 *    so fall back to a CSS-based fullscreen (fixed positioning +
 *    z-index 9999) with a floating exit button.
 *
 * Mirrors what Poki / CrazyGames do on mobile.
 */
export default function FullscreenButton({ targetId }) {
  // True when we are in CSS fallback fullscreen (iOS path).
  // We track native fullscreen via DOM events instead of state to avoid
  // hydration mismatch with `document.fullscreenElement`.
  const [cssFs, setCssFs] = useState(false)
  const [nativeFs, setNativeFs] = useState(false)

  useEffect(() => {
    if (typeof document === 'undefined') return

    const onFsChange = () => {
      const active = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement
      )
      setNativeFs(active)
      if (!active) {
        // User exited native fullscreen -> clean up CSS state too.
        document.body.style.overflow = ''
        const el = document.getElementById(targetId)
        const wrap = el?.parentElement
        if (wrap) wrap.classList.remove('is-fullscreen')
        setCssFs(false)
      }
    }
    document.addEventListener('fullscreenchange', onFsChange)
    document.addEventListener('webkitfullscreenchange', onFsChange)
    document.addEventListener('mozfullscreenchange', onFsChange)
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange)
      document.removeEventListener('webkitfullscreenchange', onFsChange)
      document.removeEventListener('mozfullscreenchange', onFsChange)
    }
  }, [targetId])

  const isFs = cssFs || nativeFs

  const enter = async () => {
    const el = document.getElementById(targetId)
    if (!el) return
    const wrap = el.parentElement

    // Try native first.
    const req =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.mozRequestFullScreen
    if (req) {
      try {
        const result = req.call(el)
        if (result && typeof result.then === 'function') {
          await result
          setNativeFs(true)
          return
        }
        // Old WebKit: assume success (fullscreenchange will sync).
        return
      } catch {
        // Native fullscreen rejected -> CSS fallback
      }
    }

    // CSS fallback.
    enterCssFullscreen(wrap)
  }

  const exit = async () => {
    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement
    ) {
      const exitFn =
        document.exitFullscreen ||
        document.webkitExitFullscreen ||
        document.mozCancelFullScreen
      try {
        if (exitFn) await exitFn.call(document)
      } catch {
        // ignore
      }
    }
    exitCssFullscreen()
  }

  const enterCssFullscreen = (wrap) => {
    if (!wrap) return
    wrap.classList.add('is-fullscreen')
    document.body.style.overflow = 'hidden'
    setCssFs(true)
  }

  const exitCssFullscreen = () => {
    const el = document.getElementById(targetId)
    const wrap = el?.parentElement
    if (wrap) wrap.classList.remove('is-fullscreen')
    document.body.style.overflow = ''
    setCssFs(false)
  }

  return (
    <>
      <button
        onClick={isFs ? exit : enter}
        className={styles.btn}
        type="button"
        aria-label={isFs ? 'Quitter le plein écran' : 'Plein écran'}
        title={isFs ? 'Quitter le plein écran' : 'Plein écran'}
      >
        {isFs ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        )}
        <span className={styles.label}>Plein écran</span>
      </button>
      {/* Floating exit button shown only during CSS fullscreen on mobile */}
      <button
        onClick={exit}
        className={`${styles.exitCssFs} ${cssFs ? styles.exitCssFsVisible : ''}`}
        type="button"
        aria-label="Quitter le plein écran"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
        ESC
      </button>
    </>
  )
}