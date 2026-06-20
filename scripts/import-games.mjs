#!/usr/bin/env node
/**
 * NovArcade — Script d'import GamePix (incrémental)
 *
 * Usage:
 *   node scripts/import-games.mjs                    # ajoute 500 jeux (order=q)
 *   BATCH_SIZE=1000 node scripts/import-games.mjs   # ajoute 1000 jeux
 *   MAX_TOTAL=5000 node scripts/import-games.mjs    # plafonne le total à 5000
 *
 * Stratégie : scanne l'API en plusieurs passes avec ordres différents
 * (q=quality, d=date), déduplique par id et slug contre le JSON existant.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT = join(__dirname, '../public/data/games.json')

const SID = process.env.GAMEPIX_SID || '1'
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '500', 10)
const MAX_TOTAL = parseInt(process.env.MAX_TOTAL || '5000', 10)
const FEATURED_MIN_RK = parseFloat(process.env.FEATURED_MIN_RK || '0.85')

// Mapping catégories GamePix (EN) → NovArcade (FR)
const CATEGORY_MAP = {
  'arcade':     'Arcade',
  'adventure':  'Aventure',
  'board':      'Stratégie',
  'classics':   'Arcade',
  'junior':     'Arcade',
  'puzzles':    'Puzzle',
  'sports':     'Sport',
  'strategy':   'Stratégie',
}

function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function pickCategory(raw) {
  const cats = [raw.category, ...(raw.categories || [])].filter(Boolean)
  for (const c of cats) {
    const mapped = CATEGORY_MAP[String(c).toLowerCase()]
    if (mapped) return mapped
  }
  return 'Arcade'
}

async function fetchPage(order, offset, limit = 1000) {
  const url = `https://games.gamepix.com/games?sid=${SID}&order=${order}&limit=${limit}&offset=${offset}`
  const res = await fetch(url)
  if (!res.ok) return []
  const data = (await res.json()).data || []
  return Array.isArray(data) ? data : []
}

async function fetchMany(order, maxToFetch) {
  const games = []
  let offset = 0
  const pageSize = 1000
  while (games.length < maxToFetch) {
    const batch = await fetchPage(order, offset, pageSize)
    if (batch.length === 0) break
    games.push(...batch)
    if (batch.length < pageSize) break
    offset += pageSize
    // Sécurité anti-boucle infinie : l'API plafonne ~6500
    if (offset > 7000) break
  }
  return games.slice(0, maxToFetch)
}

function cleanTitle(title) {
  return String(title || '')
    .replace(/\s*[-|]\s*(gamepix|crazygames|crazy\s*games|play\.gamepix)\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function transformGame(raw, index) {
  const rk = Number(raw.rkScore) || 0
  const plays = Math.round(rk * 45000 + 5000)
  const rating = Math.min(5.0, Math.round((3.5 + rk * 1.5) * 10) / 10)

  const cleanT = cleanTitle(raw.title)
  const description = raw.desc_fr || raw.description || `Joue à ${cleanT} sur NovArcade !`

  let embedUrl = raw.url || ''
  if (embedUrl.includes('play.gamepix.com') && !embedUrl.includes('/embed')) {
    embedUrl = embedUrl.replace(/\?.*$/, '') + '/embed?sid=' + SID
  }

  return {
    id: String(raw.id || index + 1),
    slug: slugify(cleanT) || `game-${index}`,
    title: cleanT || 'Sans titre',
    description,
    category: pickCategory(raw),
    tags: (raw.categories || [raw.category]).filter(Boolean).map(t => String(t).toLowerCase()),
    thumbnail: raw.thumbnailUrl || raw.thumbnailUrl100 || '',
    url: embedUrl,
    plays,
    rating,
    featured: raw.featured === true || rk >= FEATURED_MIN_RK,
    source: 'gamepix',
  }
}

async function main() {
  try {
    // Charge l'existant
    let existing = []
    if (existsSync(OUTPUT)) {
      try {
        existing = JSON.parse(readFileSync(OUTPUT, 'utf-8'))
      } catch (e) {
        console.warn('⚠ games.json illisible, on repart de zéro')
        existing = []
      }
    }
    console.log(`📦 ${existing.length} jeux déjà en base`)

    const existingIds = new Set(existing.map(g => g.id))
    const existingSlugs = new Set(existing.map(g => g.slug))

    // Stratégie : scanne en plusieurs passes avec ordres différents
    // pour maximiser la diversité sans doublons
    const orders = ['q', 'd'] // quality puis date
    const candidates = []

    for (const order of orders) {
      const needed = BATCH_SIZE - candidates.length
      // Scanne large : 3x BATCH_SIZE pour avoir du choix après dédup
      const fetchTarget = Math.max(BATCH_SIZE * 3, 2000)
      console.log(`📡 Scan order=${order} (besoin: ${needed}, scan: ${fetchTarget})...`)
      const fetched = await fetchMany(order, fetchTarget)
      let added = 0
      for (const raw of fetched) {
        if (existingIds.has(String(raw.id))) continue
        const slug = slugify(cleanTitle(raw.title))
        if (existingSlugs.has(slug) || !slug) continue
        candidates.push(raw)
        existingIds.add(String(raw.id))
        existingSlugs.add(slug)
        added++
        if (candidates.length >= BATCH_SIZE) break
      }
      console.log(`   +${added} nouveaux (candidates: ${candidates.length})`)
      if (candidates.length >= BATCH_SIZE) break
    }

    console.log(`\n✅ ${candidates.length} nouveaux jeux`)

    // Transforme et ajoute
    const newGames = candidates
      .map((g, i) => transformGame(g, existing.length + i))
      .filter(g => g.url && g.thumbnail)

    let merged = [...existing, ...newGames]

    // Dédup finale par id + slug (sécurité)
    const seenId = new Set()
    const seenSlug = new Set()
    merged = merged.filter(g => {
      if (seenId.has(g.id) || seenSlug.has(g.slug)) return false
      seenId.add(g.id)
      seenSlug.add(g.slug)
      return true
    })

    // Plafonne si demandé
    if (MAX_TOTAL && merged.length > MAX_TOTAL) {
      merged = merged.slice(0, MAX_TOTAL)
    }

    writeFileSync(OUTPUT, JSON.stringify(merged, null, 2), 'utf-8')
    const featured = merged.filter(g => g.featured).length
    console.log(`💾 ${merged.length} jeux au total (${featured} featured, +${merged.length - existing.length} nouveaux)`)
    console.log('🚀 Lance maintenant: npm run build')
  } catch (err) {
    console.error('❌ Erreur:', err.message)
    process.exit(1)
  }
}

main()