import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Lemur Store
        </Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/about" className="navbar-link">About</Link>
          <Link to="/place-order" className="navbar-link">Place Order</Link>
          <Link to="/chatbot" className="navbar-link">Ask About Order</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

