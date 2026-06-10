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

function generatePairs(bundles) {
  const pairs = []
  for (let i = 0; i < bundles.length - 1; i++) {
    for (let j = i + 1; j < bundles.length; j++) {
      pairs.push([bundles[i], bundles[j]])
    }
  }
  return pairs
}

export default function Conjoint({ cardSortData, onComplete, loading }) {
  const [bundles, setBundles] = useState([])
  const [pairs, setPairs] = useState([])
  const [choices, setChoices] = useState({})
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const generatedBundles = generateBundles(cardSortData, 10)
    setBundles(generatedBundles)
    const generatedPairs = generatePairs(generatedBundles)
    setPairs(generatedPairs)
  }, [cardSortData])

  const handleChoice = (pairIndex, bundleIndex) => {
    setChoices({
      ...choices,
      [pairIndex]: bundleIndex
    })
  }

  const allAnswered = pairs.length > 0 && pairs.every((_, i) => choices[i] !== undefined)

  const handleSubmit = () => {
    if (allAnswered) {
      onComplete(choices)
    }
  }

  if (bundles.length === 0 || pairs.length === 0) {
    return <div>Loading conjoint analysis...</div>
  }

  const currentPair = pairs[currentIndex]
  const bundleA = currentPair[0]
  const bundleB = currentPair[1]

  return (
    <div>
      <h1>Step 2: Compare Product Bundles</h1>
      <p>Which bundle would you be more interested in?</p>

      <div className={styles.progress}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${((currentIndex + 1) / pairs.length) * 100}%` }}
          />
        </div>
        <span>{currentIndex + 1} of {pairs.length}</span>
      </div>

      <div className={styles.comparisonContainer}>
        <div
          className={`${styles.bundleCard} ${choices[currentIndex] === 0 ? styles.selected : ''}`}
          onClick={() => handleChoice(currentIndex, 0)}
        >
          <h3>Option A</h3>
          <div className={styles.features}>
            {bundleA.map((feature, idx) => (
              <div key={idx} className={styles.feature}>
                • {feature}
              </div>
            ))}
          </div>
          {choices[currentIndex] === 0 && <div className={styles.checkmark}>✓</div>}
        </div>

        <div className={styles.vs}>VS</div>

        <div
          className={`${styles.bundleCard} ${choices[currentIndex] === 1 ? styles.selected : ''}`}
          onClick={() => handleChoice(currentIndex, 1)}
        >
          <h3>Option B</h3>
          <div className={styles.features}>
            {bundleB.map((feature, idx) => (
              <div key={idx} className={styles.feature}>
                • {feature}
              </div>
            ))}
          </div>
          {choices[currentIndex] === 1 && <div className={styles.checkmark}>✓</div>}
        </div>
      </div>

      <div className={styles.navigation}>
        <button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
        >
          ← Previous
        </button>
        {currentIndex < pairs.length - 1 && (
          <button
            onClick={() => setCurrentIndex(currentIndex + 1)}
            disabled={choices[currentIndex] === undefined}
          >
            Next →
          </button>
        )}
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button
          onClick={handleSubmit}
          disabled={!allAnswered || loading}
          style={{
            opacity: allAnswered ? 1 : 0.5,
            cursor: allAnswered ? 'pointer' : 'not-allowed'
          }}
        >
          {loading ? 'Submitting...' : 'Submit Survey'}
        </button>
        {!allAnswered && <p style={{ marginTop: '10px', color: '#666' }}>Answer all comparisons to submit</p>}
      </div>
    </div>
  )
}
