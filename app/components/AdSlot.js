'use client'

import { useEffect } from 'react'

export default function AdSlot({ slot, format = 'auto', style = {}, className = '' }) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (e) {
      // AdSense pas encore chargé ou en mode preview
    }
  }, [])

  return (
    <div className={`ad-slot ${className}`} style={{ margin: '1rem 0', textAlign: 'center', minHeight: '90px', ...style }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-9490161916567429"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}