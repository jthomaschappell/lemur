import { useState } from 'react'
import './PlaceOrder.css'

const lemurs = [
  { id: 1, name: 'Ring-Tailed Lemur', price: 2999 },
  { id: 2, name: 'Red Ruffed Lemur', price: 3499 },
  { id: 3, name: 'Black Lemur', price: 2799 },
  { id: 4, name: 'Blue-Eyed Black Lemur', price: 3999 },
  { id: 5, name: 'Crowned Lemur', price: 3199 },
  { id: 6, name: 'Brown Lemur', price: 2599 },
  { id: 7, name: 'White-Fronted Lemur', price: 2899 },
  { id: 8, name: 'Red-Bellied Lemur', price: 3299 },
  { id: 9, name: 'Golden Bamboo Lemur', price: 3799 },
  { id: 10, name: 'Sclater\'s Lemur', price: 3099 },
  { id: 11, name: 'Sanford\'s Lemur', price: 2999 },
  { id: 12, name: 'Mongoose Lemur', price: 2699 }
]

function PlaceOrder() {
  const [orderItems, setOrderItems] = useState({})
  const [showCheckout, setShowCheckout] = useState(false)

  const handleQuantityChange = (lemurId, quantity) => {
    if (quantity === 0) {
      const newItems = { ...orderItems }
      delete newItems[lemurId]
      setOrderItems(newItems)
    } else {
      setOrderItems({ ...orderItems, [lemurId]: quantity })
    }
  }

  const getTotalPrice = () => {
    return Object.entries(orderItems).reduce((total, [lemurId, quantity]) => {
      const lemur = lemurs.find(l => l.id === parseInt(lemurId))
      return total + (lemur ? lemur.price * quantity : 0)
    }, 0)
  }

  const getTotalItems = () => {
    return Object.values(orderItems).reduce((sum, qty) => sum + qty, 0)
  }

  const handleCheckout = () => {
    setShowCheckout(true)
  }

  const handleReset = () => {
    setOrderItems({})
    setShowCheckout(false)
  }

  if (showCheckout) {
    return (
      <div className="place-order">
        <div className="place-order-hero">
          <div className="place-order-hero-content">
            <h1 className="place-order-title">
              Order <span className="title-highlight-green">Confirmed</span>
            </h1>
          </div>
        </div>
        <div className="checkout-summary">
          <div className="checkout-card">
            <h2>Thank you for your order!</h2>
            <div className="order-details">
              <p><strong>Total Items:</strong> {getTotalItems()}</p>
              <p><strong>Total Price:</strong> ${getTotalPrice().toLocaleString()}</p>
            </div>
            <div className="order-items">
              <h3>Order Items:</h3>
              {Object.entries(orderItems).map(([lemurId, quantity]) => {
                const lemur = lemurs.find(l => l.id === parseInt(lemurId))
                return lemur ? (
                  <div key={lemurId} className="order-item">
                    <span>{lemur.name} x {quantity}</span>
                    <span>${(lemur.price * quantity).toLocaleString()}</span>
                  </div>
                ) : null
              })}
            </div>
            <button className="checkout-button" onClick={handleReset}>
              Place Another Order
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="place-order">
      <div className="place-order-hero">
        <div className="place-order-hero-content">
          <h1 className="place-order-title">
            Place Your <span className="title-highlight-green">Order</span>
          </h1>
          <p className="place-order-subtitle">
            Select lemurs and quantities to add to your order
          </p>
        </div>
      </div>
      <div className="place-order-content">
        <div className="order-form-container">
          <form className="order-form">
            {lemurs.map(lemur => {
              const quantity = orderItems[lemur.id] || 0
              return (
                <div key={lemur.id} className="form-row">
                  <div className="form-label-group">
                    <label htmlFor={`lemur-${lemur.id}`} className="form-label">
                      {lemur.name}
                    </label>
                    <span className="form-price">${lemur.price.toLocaleString()}</span>
                  </div>
                  <div className="form-input-group">
                    <button
                      type="button"
                      className="quantity-button"
                      onClick={() => handleQuantityChange(lemur.id, Math.max(0, quantity - 1))}
                      disabled={quantity === 0}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      id={`lemur-${lemur.id}`}
                      min="0"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(lemur.id, parseInt(e.target.value) || 0)}
                      className="form-input"
                    />
                    <button
                      type="button"
                      className="quantity-button"
                      onClick={() => handleQuantityChange(lemur.id, quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              )
            })}
          </form>
          <div className="order-summary">
            <div className="summary-row">
              <span>Total Items:</span>
              <span>{getTotalItems()}</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total Price:</span>
              <span>${getTotalPrice().toLocaleString()}</span>
            </div>
            <button
              className="checkout-button"
              onClick={handleCheckout}
              disabled={getTotalItems() === 0}
            >
              Check Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceOrder

