import { useState } from 'react'
import './Chatbot.css'

// API endpoint from Terraform output
const API_BASE_URL = 'https://10wadyg3h2.execute-api.us-west-2.amazonaws.com'

function Chatbot() {
  const [orderId, setOrderId] = useState('')
  const [messages, setMessages] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!currentQuestion.trim()) return

    const questionText = currentQuestion.trim()
    const userMessage = {
      type: 'user',
      text: questionText,
      timestamp: new Date()
    }

    // Add user message to chat
    setMessages(prev => [...prev, userMessage])
    setCurrentQuestion('')
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/ask-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderId.trim() || undefined,
          question: questionText
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
      }

      // API Gateway HTTP API returns the Lambda body directly as JSON
      const responseText = await response.text()
      console.log('API Response:', responseText)
      
      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.error('Failed to parse JSON:', responseText)
        throw new Error('Invalid JSON response from server')
      }
      
      const answer = data.answer || 'Sorry, I could not get a response.'

      const botMessage = {
        type: 'bot',
        text: answer || 'Sorry, I could not get a response.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error calling API:', error)
      // Show more detailed error in development
      const errorText = process.env.NODE_ENV === 'development' 
        ? `Error: ${error.message}. Check console for details.`
        : 'Sorry, there was an error processing your question. Please try again.'
      
      const errorMessage = {
        type: 'bot',
        text: errorText,
        timestamp: new Date(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  return (
    <div className="chatbot">
      <div className="chatbot-hero">
        <div className="chatbot-hero-content">
          <h1 className="chatbot-title">
            Ask About Your <span className="title-highlight-green">Order</span>
          </h1>
          <p className="chatbot-subtitle">
            Get instant answers about your order status, delivery, and more
          </p>
        </div>
      </div>
      <div className="chatbot-content">
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="order-id-section">
              <label htmlFor="order-id-input" className="order-id-label">
                Order ID (optional)
              </label>
              <input
                id="order-id-input"
                type="text"
                className="order-id-input"
                placeholder="Enter your order ID..."
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
              <p className="order-id-hint">
                Providing your order ID helps us give you specific information about your order
              </p>
            </div>
            {messages.length > 0 && (
              <button className="clear-chat-button" onClick={clearChat}>
                Clear Chat
              </button>
            )}
          </div>

          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="welcome-message">
                <div className="welcome-icon">💬</div>
                <h3>Welcome to Order Support</h3>
                <p>Ask me anything about your order! For example:</p>
                <ul>
                  <li>"What is the status of my order?"</li>
                  <li>"When will my order arrive?"</li>
                  <li>"What lemurs do you have?"</li>
                </ul>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`chat-message ${message.type} ${message.isError ? 'error' : ''}`}
                >
                  <div className="message-content">
                    <div className="message-text">{message.text}</div>
                    <div className="message-time">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="chat-message bot loading">
                <div className="message-content">
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="chat-input-section">
            <div className="chat-input-container">
              <textarea
                className="chat-input"
                placeholder="Type your question here..."
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={3}
                disabled={isLoading}
              />
              <button
                className="send-button"
                onClick={handleSendMessage}
                disabled={isLoading || !currentQuestion.trim()}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chatbot
