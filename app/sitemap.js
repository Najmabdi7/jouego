import { getAllGames, getAllCategories } from './lib/games'
import blogPosts from './blog/posts-manifest.json'

const BASE_URL = 'https://novarcade.waaplink.com'

export default function sitemap() {
  const today = new Date().toISOString().split('T')[0]

  const staticUrls = [
    { url: `${BASE_URL}/`, lastModified: today, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/blog`, lastModified: today, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/top-jeux`, lastModified: today, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/nouveautes`, lastModified: today, changeFrequency: 'daily', priority: 0.8 },
  ]

  const categoryUrls = getAllCategories().map(cat => ({
    url: `${BASE_URL}/categorie/${cat.name.toLowerCase()}`,
    lastModified: today,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const blogUrls = blogPosts.map(post => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.dateModified || today,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const gameUrls = getAllGames().map(g => ({
    url: `${BASE_URL}/game/${g.slug}`,
    lastModified: today,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticUrls, ...categoryUrls, ...blogUrls, ...gameUrls]
}