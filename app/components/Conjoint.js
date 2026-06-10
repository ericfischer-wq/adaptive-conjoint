'use client'

import { useState, useEffect } from 'react'
import styles from './Conjoint.module.css'

const CAPABILITIES = [
  'Portfolio Analytics',
  'Real-time Dashboards',
  'Multi-asset Class Support',
  'Risk Reporting',
  'Performance Benchmarking',
  'Tax Optimization Tools',
  'Rebalancing Automation',
  'Client Portal',
  'CRM Integration',
  'Account Aggregation',
  'Compliance Monitoring',
  'Fee Management',
  'Scenario Analysis',
  'Mobile App',
  'API Access',
  'Custom Reporting',
  'Data Import/Export',
  'Workflow Automation',
  'Billing Integration',
  'Document Management',
  'Alert Notifications',
  'Multi-currency Support',
  'User Permissions',
  'Audit Trails'
]

function generateBundles(cardSortData, count = 10) {
  const baseline = cardSortData.baseline || []
  const intermediate = cardSortData.intermediate || []
  const premium = cardSortData.premium || []

  const bundles = []

  for (let i = 0; i < count; i++) {
    const bundle = []

    // Add 1-2 from baseline
    const baselineCount = Math.random() > 0.5 ? 2 : 1
    for (let j = 0; j < baselineCount && baseline.length > 0; j++) {
      const idx = Math.floor(Math.random() * baseline.length)
      bundle.push(baseline[idx])
    }

    // Add 1-2 from intermediate
    const intermediateCount = Math.random() > 0.5 ? 2 : 1
    for (let j = 0; j < intermediateCount && intermediate.length > 0; j++) {
      const idx = Math.floor(Math.random() * intermediate.length)
      bundle.push(intermediate[idx])
    }

    // Add 0-1 from premium
    if (premium.length > 0 && Math.random() > 0.4) {
      const idx = Math.floor(Math.random() * premium.length)
      bundle.push(premium[idx])
    }

    if (bundle.length > 0) {
      bundles.push(bundle)
    }
  }

  return bundles.slice(0, count)
}

export default function Conjoint({ cardSortData, onComplete, loading }) {
  const [bundles, setBundles] = useState([])
  const [ratings, setRatings] = useState({})
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const generatedBundles = generateBundles(cardSortData, 10)
    setBundles(generatedBundles)
  }, [cardSortData])

  const handleRating = (bundleIndex, rating) => {
    setRatings({
      ...ratings,
      [bundleIndex]: rating
    })
  }

  const allRated = bundles.length > 0 && bundles.every((_, i) => ratings[i] !== undefined)

  const handleSubmit = () => {
    if (allRated) {
      onComplete(ratings)
    }
  }

  if (bundles.length === 0) {
    return <div>Loading bundles...</div>
  }

  return (
    <div>
      <h1>Step 2: Rate Product Bundles</h1>
      <p>We've generated product bundles based on your preferences. Rate each bundle on how interested you'd be in a product with those features.</p>

      <div className={styles.progress}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${((currentIndex + 1) / bundles.length) * 100}%` }}
          />
        </div>
        <span>{currentIndex + 1} of {bundles.length}</span>
      </div>

      <div className={styles.bundleContainer}>
        <div className={styles.bundle}>
          <h2>Bundle {currentIndex + 1}</h2>
          <div className={styles.features}>
            {bundles[currentIndex].map((feature, idx) => (
              <div key={idx} className={styles.feature}>
                • {feature}
              </div>
            ))}
          </div>

          <div className={styles.ratingContainer}>
            <label>How interested would you be in a product with these features?</label>
            <div className={styles.ratingScale}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <button
                  key={num}
                  className={`${styles.ratingButton} ${ratings[currentIndex] === num ? styles.selected : ''}`}
                  onClick={() => handleRating(currentIndex, num)}
                >
                  {num}
                </button>
              ))}
            </div>
            <div className={styles.ratingLabels}>
              <span>Not Interested</span>
              <span>Very Interested</span>
            </div>
          </div>

          <div className={styles.navigation}>
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
            >
              ← Previous
            </button>
            {currentIndex < bundles.length - 1 && (
              <button
                onClick={() => setCurrentIndex(currentIndex + 1)}
                disabled={ratings[currentIndex] === undefined}
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button
          onClick={handleSubmit}
          disabled={!allRated || loading}
          style={{
            opacity: allRated ? 1 : 0.5,
            cursor: allRated ? 'pointer' : 'not-allowed'
          }}
        >
          {loading ? 'Submitting...' : 'Submit Survey'}
        </button>
        {!allRated && <p style={{ marginTop: '10px', color: '#666' }}>Rate all bundles to submit</p>}
      </div>
    </div>
  )
}
