import LemurCard from '../components/LemurCard'
import { lemurs } from '../data/lemurs'
import './Home.css'

function Home() {
  return (
    <div className="home">
      <div className="home-hero">
        <div className="home-hero-content">
          <h1 className="home-title">
            <span className="title-highlight-green">Whimsical</span>{' '}
            <span className="title-highlight-yellow">Lemurs</span>
            <br />
            for You
          </h1>
          <p className="home-subtitle">
            Discover our handpicked selection of the finest lemurs. Each one is carefully
            selected for their unique personality and charm. Find your perfect companion today.
          </p>
        </div>
      </div>
      <div className="home-content">
        <div className="lemur-grid">
          {lemurs.map(lemur => (
            <LemurCard key={lemur.id} lemur={lemur} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home

