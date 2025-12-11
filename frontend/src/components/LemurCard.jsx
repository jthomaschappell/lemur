import './LemurCard.css'

function LemurCard({ lemur, onClick }) {
  return (
    <div className="lemur-card" onClick={onClick}>
      <div className="lemur-card-image">
        <img src={lemur.image} alt={lemur.name} />
      </div>
      <div className="lemur-card-content">
        <h3 className="lemur-card-name">{lemur.name}</h3>
        <p className="lemur-card-description">{lemur.description}</p>
      </div>
    </div>
  )
}

export default LemurCard

