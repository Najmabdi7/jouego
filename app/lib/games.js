import gamesData from '../../public/data/games.json'

export function getAllGames() {
  return gamesData
}

export function getFeaturedGames() {
  return gamesData.filter(g => g.featured)
}

export function getGameBySlug(slug) {
  return gamesData.find(g => g.slug === slug) || null
}

export function getGamesByCategory(category) {
  return gamesData.filter(g => g.category === category)
}

export function getAllCategories() {
  const counts = {}
  gamesData.forEach(g => {
    counts[g.category] = (counts[g.category] || 0) + 1
  })
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

export function searchGames(query) {
  const q = query.toLowerCase()
  return gamesData.filter(g =>
    g.title.toLowerCase().includes(q) ||
    g.description.toLowerCase().includes(q) ||
    g.tags.some(t => t.includes(q))
  )
}

export function formatPlays(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return Math.round(n / 1000) + 'k'
  return n.toString()
}
