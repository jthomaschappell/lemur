import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { lemurs } from '../data/lemurs'
import './PlaceOrder.css'

function PlaceOrder() {
  const location = useLocation()
  const [lineItems, setLineItems] = useState([])
  const [showCheckout, setShowCheckout] = useState(false)
  const [orderNumber, setOrderNumber] = useState(null)

  // Initialize with pre-selected lemur from navigation state
  useEffect(() => {
    if (location.state?.selectedLemur) {
      const selectedLemur = location.state.selectedLemur
      const newItem = {
        id: Date.now(),
        lemurId: selectedLemur.id.toString(),
        quantity: 1
      }
      setLineItems([newItem])
      // Clear the state to prevent re-adding on re-render
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const generateOrderNumber = () => {
    return 'LEM-' + Date.now().toString().slice(-8) + '-' + Math.random().toString(36).substr(2, 4).toUpperCase()
  }

  const addLineItem = () => {
    const newItem = {
      id: Date.now(),
      lemurId: '',
      quantity: 1
    }
    setLineItems([...lineItems, newItem])
  }

  const removeLineItem = (itemId) => {
    setLineItems(lineItems.filter(item => item.id !== itemId))
  }

  const updateLineItem = (itemId, field, value) => {
    setLineItems(lineItems.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    ))
  }

  const getTotalPrice = () => {
    return lineItems.reduce((total, item) => {
      if (!item.lemurId) return total
      const lemur = lemurs.find(l => l.id === parseInt(item.lemurId))
      return total + (lemur ? lemur.price * item.quantity : 0)
    }, 0)
  }

  const getTotalItems = () => {
    return lineItems.reduce((sum, item) => sum + (item.lemurId ? item.quantity : 0), 0)
  }

  const getValidLineItems = () => {
    return lineItems.filter(item => item.lemurId && item.quantity > 0)
  }

  const handleCheckout = () => {
    const validItems = getValidLineItems()
    if (validItems.length === 0) return
    
    const orderNum = generateOrderNumber()
    setOrderNumber(orderNum)
    setShowCheckout(true)
  }

  const handleReset = () => {
    setLineItems([])
    setShowCheckout(false)
    setOrderNumber(null)
  }

  if (showCheckout) {
    const validItems = getValidLineItems()
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
            {orderNumber && (
              <div className="order-number">
                <p><strong>Order Number:</strong> {orderNumber}</p>
              </div>
            )}
            <div className="order-details">
              <p><strong>Total Items:</strong> {getTotalItems()}</p>
              <p><strong>Total Price:</strong> ${getTotalPrice().toLocaleString()}</p>
            </div>
            <div className="order-items">
              <h3>Order Items:</h3>
              {validItems.map((item) => {
                const lemur = lemurs.find(l => l.id === parseInt(item.lemurId))
                return lemur ? (
                  <div key={item.id} className="order-item">
                    <span>{lemur.name} x {item.quantity}</span>
                    <span>${(lemur.price * item.quantity).toLocaleString()}</span>
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
          <div className="order-form-header">
            <h2>Order Items</h2>
            <button type="button" className="add-item-button" onClick={addLineItem}>
              + Add Item
            </button>
          </div>
          {lineItems.length === 0 ? (
            <div className="empty-state">
              <p>No items added yet. Click "Add Item" to start building your order.</p>
            </div>
          ) : (
            <form className="order-form">
              {lineItems.map((item) => {
                const selectedLemur = lemurs.find(l => l.id === parseInt(item.lemurId))
                return (
                  <div key={item.id} className="form-row line-item-row">
                    <div className="line-item-controls">
                      <div className="dropdown-group">
                        <label htmlFor={`lemur-select-${item.id}`} className="form-label-small">
                          Lemur Type
                        </label>
                        <select
                          id={`lemur-select-${item.id}`}
                          value={item.lemurId}
                          onChange={(e) => updateLineItem(item.id, 'lemurId', e.target.value)}
                          className="form-select"
                        >
                          <option value="">Select a lemur...</option>
                          {lemurs.map(lemur => (
                            <option key={lemur.id} value={lemur.id}>
                              {lemur.name} - ${lemur.price.toLocaleString()}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="quantity-group">
                        <label htmlFor={`quantity-${item.id}`} className="form-label-small">
                          Quantity
                        </label>
                        <div className="form-input-group">
                          <button
                            type="button"
                            className="quantity-button"
                            onClick={() => updateLineItem(item.id, 'quantity', Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            id={`quantity-${item.id}`}
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(item.id, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                            className="form-input"
                          />
                          <button
                            type="button"
                            className="quantity-button"
                            onClick={() => updateLineItem(item.id, 'quantity', item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      {selectedLemur && (
                        <div className="line-item-total">
                          <span className="line-item-total-label">Line Total:</span>
                          <span className="line-item-total-value">
                            ${(selectedLemur.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      )}
                      <button
                        type="button"
                        className="remove-item-button"
                        onClick={() => removeLineItem(item.id)}
                        title="Remove item"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )
              })}
            </form>
          )}
          {lineItems.length > 0 && (
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
                disabled={getValidLineItems().length === 0}
              >
                Check Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PlaceOrder

