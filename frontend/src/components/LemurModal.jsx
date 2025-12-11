import { useEffect } from 'react'
import './LemurModal.css'

function LemurModal({ lemur, onClose }) {
  useEffect(() => {
    if (!lemur) return

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [lemur, onClose])

  if (!lemur) return null

  const formatPrice = (cents) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  return (
    <div className="lemur-modal-overlay" onClick={onClose}>
      <div className="lemur-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="lemur-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="lemur-modal-body">
          <div className="lemur-modal-image-container">
            <img src={lemur.image} alt={lemur.name} className="lemur-modal-image" />
          </div>
          <div className="lemur-modal-info">
            <h2 className="lemur-modal-name">{lemur.name}</h2>
            <p className="lemur-modal-description">{lemur.description}</p>
            <div className="lemur-modal-price">
              <span className="price-label">Price:</span>
              <span className="price-value">{formatPrice(lemur.price)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LemurModal

