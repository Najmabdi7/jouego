#!/usr/bin/env node
/**
 * NovArcade — Script d'import GamePix
 *
 * Usage:
 *   GAMEPIX_SID=TON_SID node scripts/import-games.mjs
 *
 * Ce script récupère tous les jeux depuis l'API GamePix
 * et génère le fichier public/data/games.json
 */

import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT = join(__dirname, '../public/data/games.json')

const SID = process.env.GAMEPIX_SID
if (!SID) {
  console.error('❌ Manque la variable GAMEPIX_SID')
  console.error('   Usage: GAMEPIX_SID=ton_sid node scripts/import-games.mjs')
  process.exit(1)
}

// Map des catégories GamePix → NovArcade
const CATEGORY_MAP = {
  'action':     'Action',
  'puzzle':     'Puzzle',
  'racing':     'Course',
  'sports':     'Sport',
  'arcade':     'Arcade',
  'strategy':   'Stratégie',
  'multiplayer':'Multijoueur',
  'word':       'Mots',
  'adventure':  'Aventure',
  'shooting':   'Action',
  'casual':     'Arcade',
  'simulation': 'Stratégie',
  'clicker':    'Arcade',
  'board':      'Stratégie',
  'card':       'Stratégie',
}

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function fetchAllGames() {
  let offset = 0
  const limit = 1000
  let allGames = []

  console.log('📡 Connexion à l\'API GamePix...')

  while (true) {
    const url = `https://games.gamepix.com/games?sid=${SID}&limit=${limit}&offset=${offset}&order=q`
    console.log(`   Fetching offset=${offset}...`)

    const res = await fetch(url)
    if (!res.ok) {
      console.error(`❌ Erreur HTTP ${res.status}`)
      break
    }

    const data = await res.json()
    const games = data?.data || data?.games || data || []

    if (!Array.isArray(games) || games.length === 0) break

    allGames = allGames.concat(games)
    console.log(`   +${games.length} jeux (total: ${allGames.length})`)

    if (games.length < limit) break
    offset += limit
  }

  return allGames
}

function transformGame(raw, index) {
  const category = CATEGORY_MAP[raw.category?.toLowerCase()] || 'Arcade'
  const slug = slugify(raw.title || `game-${index}`)

  return {
    id: String(raw.id || index + 1),
    slug: slug,
    title: raw.title || 'Jeu sans titre',
    description: raw.description || `Joue gratuitement à ${raw.title} sur NovArcade !`,
    category: category,
    tags: (raw.tags || [raw.category]).filter(Boolean).map(t => t.toLowerCase()),
    thumbnail: raw.thumbnail || raw.image || raw.cover || '',
    url: raw.url || raw.gameUrl || raw.embedUrl || '',
    plays: raw.plays || raw.playCount || Math.floor(Math.random() * 100000) + 1000,
    rating: raw.rating || parseFloat((3.8 + Math.random() * 1.2).toFixed(1)),
    featured: index < 12,
    source: 'gamepix',
  }
}

async function main() {
  try {
    const rawGames = await fetchAllGames()
    console.log(`\n✅ ${rawGames.length} jeux récupérés`)

    const games = rawGames
      .map((g, i) => transformGame(g, i))
      .filter(g => g.url && g.thumbnail) // garder seulement ceux avec URL et image

    // Dédupliquer par slug
    const seen = new Set()
    const unique = games.filter(g => {
      if (seen.has(g.slug)) return false
      seen.add(g.slug)
      return true
    })

    writeFileSync(OUTPUT, JSON.stringify(unique, null, 2), 'utf-8')
    console.log(`💾 ${unique.length} jeux sauvegardés dans public/data/games.json`)
    console.log('\n🚀 Lance maintenant: npm run build')
  } catch (err) {
    console.error('❌ Erreur:', err.message)
    process.exit(1)
  }
}

main()
