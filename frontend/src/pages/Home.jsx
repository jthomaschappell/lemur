import { useState } from 'react'
import LemurCard from '../components/LemurCard'
import LemurModal from '../components/LemurModal'
import { lemurs } from '../data/lemurs'
import './Home.css'

function Home() {
  const [selectedLemur, setSelectedLemur] = useState(null)

  const handleCardClick = (lemur) => {
    setSelectedLemur(lemur)
  }

  const handleCloseModal = () => {
    setSelectedLemur(null)
  }

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
            <LemurCard 
              key={lemur.id} 
              lemur={lemur} 
              onClick={() => handleCardClick(lemur)}
            />
          ))}
        </div>
      </div>
      <LemurModal lemur={selectedLemur} onClose={handleCloseModal} />
    </div>
  )
}

export default Home

