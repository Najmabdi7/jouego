'use client'

import { useRef } from 'react'
import styles from './FullscreenButton.module.css'

export default function FullscreenButton({ targetId }) {
  const enter = () => {
    const el = document.getElementById(targetId)
    if (!el) return
    const req = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen
    if (req) req.call(el)
  }

  return (
    <button onClick={enter} className={styles.btn} type="button" aria-label="Plein écran">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
      </svg>
      Plein écran
    </button>
  )
}