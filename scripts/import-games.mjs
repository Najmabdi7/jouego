#!/usr/bin/env node
/**
 * NovArcade — Script d'import GamePix
 *
 * Usage:
 *   GAMEPIX_SID=TON_SID node scripts/import-games.mjs
 *   GAMEPIX_SID=TON_SID LIMIT=500 node scripts/import-games.mjs
 *
 * Génère public/data/games.json depuis l'API GamePix.
 */

import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT = join(__dirname, '../public/data/games.json')

const SID = process.env.GAMEPIX_SID || '1'
const LIMIT = parseInt(process.env.LIMIT || '500', 10)
const ORDER = process.env.ORDER || 'q' // q = quality (most played), d = newest
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
  // Essaie toutes les catégories du jeu, prend la première qu'on mappe
  const cats = [raw.category, ...(raw.categories || [])].filter(Boolean)
  for (const c of cats) {
    const mapped = CATEGORY_MAP[String(c).toLowerCase()]
    if (mapped) return mapped
  }
  return 'Arcade' // fallback
}

async function fetchAllGames() {
  const games = []
  const pageSize = 1000
  let offset = 0
  console.log(`📡 GamePix (sid=${SID}, order=${ORDER}, limit=${LIMIT})...`)

  while (games.length < LIMIT) {
    const url = `https://games.gamepix.com/games?sid=${SID}&order=${ORDER}&limit=${pageSize}&offset=${offset}`
    const res = await fetch(url)
    if (!res.ok) {
      console.error(`❌ HTTP ${res.status} à offset=${offset}`)
      break
    }
    const data = (await res.json()).data || []
    if (data.length === 0) break

    games.push(...data)
    console.log(`   +${data.length} (total: ${games.length})`)

    if (data.length < pageSize) break
    offset += pageSize
  }

  return games.slice(0, LIMIT)
}

function cleanTitle(title) {
  // Retire les suffixes branding (GamePix, CrazyGames, etc.) et la ponctuation résiduelle
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

  // Construit l'URL embed directe (sans branding player) si on a un slug
  // raw.url de l'API pointe vers play.gamepix.com/SLUG/embed?sid=X — déjà bon
  // mais on force le format /embed?sid= pour éviter les redirections vers le player complet
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
    const rawGames = await fetchAllGames()
    console.log(`\n✅ ${rawGames.length} jeux récupérés`)

    const games = rawGames
      .map((g, i) => transformGame(g, i))
      .filter(g => g.url && g.thumbnail)

    // Dédup par slug
    const seen = new Set()
    const unique = games.filter(g => {
      if (seen.has(g.slug)) return false
      seen.add(g.slug)
      return true
    })

    writeFileSync(OUTPUT, JSON.stringify(unique, null, 2), 'utf-8')
    const featured = unique.filter(g => g.featured).length
    console.log(`💾 ${unique.length} jeux sauvegardés (${featured} featured)`)
    console.log('🚀 Lance maintenant: npm run build')
  } catch (err) {
    console.error('❌ Erreur:', err.message)
    process.exit(1)
  }
}

main()