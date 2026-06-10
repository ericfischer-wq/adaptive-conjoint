'use client'

import { useState } from 'react'
import CardSort from './components/CardSort'
import Conjoint from './components/Conjoint'

export default function Home() {
  const [stage, setStage] = useState('email')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [cardSortData, setCardSortData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEmailSubmit = (e) => {
    e.preventDefault()
    if (!email) {
      setError('Email is required')
      return
    }
    setError('')
    setStage('card-sort')
  }

  const handleCardSortComplete = (data) => {
    setCardSortData(data)
    setStage('conjoint')
  }

  const handleConjointComplete = async (conjointData) => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/submit-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          company,
          cardSort: cardSortData,
          conjoint: conjointData,
          timestamp: new Date().toISOString()
        })
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to submit')
      }

      setStage('complete')
    } catch (err) {
      console.error('Error:', err)
      setError('Error submitting survey: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div className="container">
      {stage === 'email' && (
        <div className="section">
          <h1>Feature Preference Research</h1>
          <p>Help us understand how you prioritize product capabilities.</p>
          <form onSubmit={handleEmailSubmit}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@company.com"
              />
            </div>
            <div className="input-group">
              <label>Company (optional)</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Your company name"
              />
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit">Start Survey</button>
          </form>
        </div>
      )}

      {stage === 'card-sort' && (
        <div className="section">
          <CardSort onComplete={handleCardSortComplete} />
        </div>
      )}

      {stage === 'conjoint' && (
        <div className="section">
          <Conjoint
            cardSortData={cardSortData}
            onComplete={handleConjointComplete}
            loading={loading}
          />
          {error && <div className="error">{error}</div>}
        </div>
      )}

      {stage === 'complete' && (
        <div className="section">
          <h1>✓ Survey Complete</h1>
          <p>Thank you for completing the survey. Your responses have been recorded.</p>
          <button onClick={() => window.location.href = '/'}>Take Survey Again</button>
        </div>
      )}
    </div>
  )
}
