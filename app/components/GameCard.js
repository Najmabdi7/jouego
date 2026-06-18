import styles from './GameCard.module.css'
import { formatPlays } from '../lib/games'

export default function GameCard({ game }) {
  return (
    <a href={`/game/${game.slug}`} className={styles.card}>
      <div className={styles.thumb}>
        <img
          src={game.thumbnail}
          alt={game.title}
          className={styles.img}
          loading="lazy"
          onError={e => {
            e.target.src = `https://placehold.co/320x180/12121e/7c3aed?text=${encodeURIComponent(game.title)}`
          }}
        />
        <div className={styles.playOverlay}>
          <div className={styles.playBtn}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        <span className={styles.category}>{game.category}</span>
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>{game.title}</h3>
        <div className={styles.meta}>
          <span className={styles.rating}>
            <svg viewBox="0 0 24 24" fill="#f59e0b" width="12" height="12">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            {game.rating.toFixed(1)}
          </span>
          <span className={styles.plays}>{formatPlays(game.plays)} parties</span>
        </div>
      </div>
    </a>
  )
}
