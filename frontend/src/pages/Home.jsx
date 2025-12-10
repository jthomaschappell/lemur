import { useState } from 'react'
import LemurCard from '../components/LemurCard'
import './Home.css'

// Sample lemur data - in a real app, this would come from an API
const lemurs = [
  {
    id: 1,
    name: 'Ring-Tailed Lemur',
    description: 'Classic striped tail, social and playful',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=300&fit=crop'
  },
  {
    id: 2,
    name: 'Red Ruffed Lemur',
    description: 'Vibrant red fur, loves fruit',
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&h=300&fit=crop'
  },
  {
    id: 3,
    name: 'Black Lemur',
    description: 'Elegant black coat, gentle nature',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=300&fit=crop'
  },
  {
    id: 4,
    name: 'Blue-Eyed Black Lemur',
    description: 'Stunning blue eyes, rare beauty',
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&h=300&fit=crop'
  },
  {
    id: 5,
    name: 'Crowned Lemur',
    description: 'Distinctive crown pattern, curious',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=300&fit=crop'
  },
  {
    id: 6,
    name: 'Brown Lemur',
    description: 'Warm brown tones, friendly',
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&h=300&fit=crop'
  },
  {
    id: 7,
    name: 'White-Fronted Lemur',
    description: 'Distinctive white face, active',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=300&fit=crop'
  },
  {
    id: 8,
    name: 'Red-Bellied Lemur',
    description: 'Red belly, loves climbing',
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&h=300&fit=crop'
  },
  {
    id: 9,
    name: 'Golden Bamboo Lemur',
    description: 'Golden fur, bamboo specialist',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=300&fit=crop'
  },
  {
    id: 10,
    name: 'Sclater\'s Lemur',
    description: 'Unique markings, intelligent',
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&h=300&fit=crop'
  },
  {
    id: 11,
    name: 'Sanford\'s Lemur',
    description: 'Dark fur, nocturnal habits',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=300&fit=crop'
  },
  {
    id: 12,
    name: 'Mongoose Lemur',
    description: 'Slender build, agile climber',
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&h=300&fit=crop'
  }
]

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

