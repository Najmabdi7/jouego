#!/usr/bin/env node
/**
 * NovArcade — Script de re-catégorisation
 *
 * Recatégorise public/data/games.json en se basant sur tags + titre.
 * Ne touche pas aux jeux, juste à `category`.
 *
 * Usage: node scripts/recategorize.mjs
 */

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT = join(__dirname, '../public/data/games.json')

// Mots-clés → catégorie (insensible à la casse)
const KEYWORDS = {
  'Action': [
    'shoot', 'sniper', 'gun', 'fight', 'battle', 'war', 'zombie', 'ninja',
    'samurai', 'stickman', 'sword', 'punch', 'boxing', 'arena', 'attack',
    'assassin', 'survival', 'fps', 'action', 'killer', 'strike', 'fight',
  ],
  'Course': [
    'race', 'racing', 'drive', 'driving', 'moto', 'bike', 'car', 'rider',
    'speed', 'drift', 'crash', 'traffic', 'parking', 'rally', 'motor',
  ],
  'Sport': [
    'football', 'soccer', 'basketball', 'tennis', 'golf', 'hockey', 'cricket',
    'rugby', 'volley', 'baseball', 'sport', 'ball', 'goal', 'penalty',
    'champion', 'olympic', 'skating', 'ski', 'snowboard',
  ],
  'Multijoueur': [
    'multiplayer', '2-player', '2 player', 'io ', ' .io', 'duel', 'versus',
    'vs ', 'online', 'mmo',
  ],
  'Puzzle': [
    'puzzle', 'match-3', 'match 3', 'mahjong', 'logic', 'sudoku', 'blocks',
    'merge', 'bubble', 'jewel', 'connect', 'tile', 'word', 'crossword',
    'trivia', 'quiz', 'memory', 'brain', 'solitaire', 'chess', 'checkers',
    'tic tac toe', 'domino', 'color', 'sort',
  ],
  'Stratégie': [
    'strategy', 'tower defense', 'defense', 'kingdom', 'castle', 'war',
    'clash', 'idle', 'tycoon', 'manager', 'civilization', 'tactical',
    'command', 'empire', 'simulator', 'farm', 'build',
  ],
  'Aventure': [
    'adventure', 'quest', 'escape', 'story', 'rpg', 'explore', 'hero',
    'journey', 'world', 'mystery',
  ],
}

function categorize(game) {
  const haystack = [
    game.title || '',
    ...(game.tags || []),
    game.description || '',
  ].join(' ').toLowerCase()

  // Match par catégorie — compte les hits, prend le max
  const scores = {}
  for (const [category, keywords] of Object.entries(KEYWORDS)) {
    scores[category] = 0
    for (const kw of keywords) {
      if (haystack.includes(kw)) scores[category]++
    }
  }

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]
  if (best && best[1] > 0) return best[0]

  // Fallback : garder la catégorie existante si elle est connue
  const validCats = Object.keys(KEYWORDS)
  if (validCats.includes(game.category)) return game.category

  return 'Arcade' // dernier recours
}

function main() {
  const games = JSON.parse(readFileSync(OUTPUT, 'utf-8'))
  console.log(`📦 ${games.length} jeux à re-catégoriser`)

  const before = {}
  for (const g of games) before[g.category] = (before[g.category] || 0) + 1
  console.log('Avant:', before)

  for (const game of games) {
    game.category = categorize(game)
  }

  const after = {}
  for (const g of games) after[g.category] = (after[g.category] || 0) + 1
  console.log('Après:', after)

  writeFileSync(OUTPUT, JSON.stringify(games, null, 2), 'utf-8')
  console.log(`💾 ${games.length} jeux sauvegardés`)
}

main()