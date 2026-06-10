'use client'

import { useState } from 'react'
import styles from './CardSort.module.css'

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

const CATEGORIES = [
  { id: 'baseline', label: 'Baseline', color: '#e3f2fd' },
  { id: 'intermediate', label: 'Intermediate', color: '#fff3e0' },
  { id: 'premium', label: 'Premium', color: '#f3e5f5' },
  { id: 'not-relevant', label: 'Not Relevant', color: '#f5f5f5' }
]

export default function CardSort({ onComplete }) {
  const [unassigned, setUnassigned] = useState(CAPABILITIES)
  const [categories, setCategories] = useState({
    baseline: [],
    intermediate: [],
    premium: [],
    'not-relevant': []
  })

  const handleDragStart = (e, item, source) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('item', item)
    e.dataTransfer.setData('source', source)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, target) => {
    e.preventDefault()
    const item = e.dataTransfer.getData('item')
    const source = e.dataTransfer.getData('source')

    if (source === 'unassigned') {
      setUnassigned(unassigned.filter(i => i !== item))
      setCategories({
        ...categories,
        [target]: [...categories[target], item]
      })
    } else if (source !== target) {
      setCategories({
        ...categories,
        [source]: categories[source].filter(i => i !== item),
        [target]: [...categories[target], item]
      })
    }
  }

  const handleRemove = (item, category) => {
    setCategories({
      ...categories,
      [category]: categories[category].filter(i => i !== item)
    })
    setUnassigned([...unassigned, item])
  }

  const isComplete = unassigned.length === 0
  const categoryData = Object.entries(categories).map(([id, items]) => ({
    id,
    label: CATEGORIES.find(c => c.id === id).label,
    color: CATEGORIES.find(c => c.id === id).color,
    items
  }))

  return (
    <div>
      <h1>Step 1: Sort Features by Category</h1>
      <p>Drag each capability to the category that best describes it.</p>

      <div className={styles.grid}>
        <div className={styles.unassignedColumn}>
          <div
            className={styles.column}
            onDragOver={handleDragOver}
            onDrop={(e) => e.preventDefault()}
          >
            <h2>Unassigned ({unassigned.length})</h2>
            <div className={styles.cardContainer}>
              {unassigned.map(item => (
                <div
                  key={item}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item, 'unassigned')}
                  className={styles.card}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.categoriesGrid}>
          {categoryData.map(cat => (
            <div key={cat.id}>
              <div
                className={styles.column}
                style={{ backgroundColor: cat.color }}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, cat.id)}
              >
                <h2>{cat.label} ({cat.items.length})</h2>
                <div className={styles.cardContainer}>
                  {cat.items.map(item => (
                    <div
                      key={item}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item, cat.id)}
                      className={styles.card}
                      onClick={() => handleRemove(item, cat.id)}
                      title="Click to remove"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button
          onClick={() => {
            if (isComplete) {
              onComplete(categories)
            }
          }}
          disabled={!isComplete}
          style={{
            opacity: isComplete ? 1 : 0.5,
            cursor: isComplete ? 'pointer' : 'not-allowed'
          }}
        >
          Continue to Conjoint Analysis
        </button>
        {!isComplete && <p style={{ marginTop: '10px', color: '#666' }}>Assign all capabilities to continue</p>}
      </div>
    </div>
  )
}
