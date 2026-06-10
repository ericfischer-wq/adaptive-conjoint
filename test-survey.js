// Test script to QA the survey with dummy data
// Run with: node test-survey.js

const BASE_URL = 'https://adaptive-conjoint.vercel.app'

async function runTest() {
  console.log('Starting survey QA test...\n')

  // Simulate card sort data
  const cardSortData = {
    baseline: [
      'Portfolio Analytics',
      'Real-time Dashboards',
      'Account Aggregation',
      'Compliance Monitoring'
    ],
    intermediate: [
      'Multi-asset Class Support',
      'Risk Reporting',
      'Performance Benchmarking',
      'Fee Management',
      'Scenario Analysis'
    ],
    premium: [
      'Tax Optimization Tools',
      'Rebalancing Automation',
      'Client Portal',
      'CRM Integration',
      'API Access',
      'Custom Reporting'
    ],
    'not-relevant': [
      'Mobile App',
      'Data Import/Export',
      'Workflow Automation',
      'Billing Integration',
      'Document Management',
      'Alert Notifications',
      'Multi-currency Support',
      'User Permissions',
      'Audit Trails'
    ]
  }

  // Simulate conjoint choices (15 pairwise comparisons, choosing either 0 or 1)
  const conjointChoices = {}
  for (let i = 0; i < 15; i++) {
    conjointChoices[i] = Math.random() > 0.5 ? 0 : 1
  }

  const surveyData = {
    email: 'test@example.com',
    company: 'Test Company',
    cardSort: cardSortData,
    conjoint: conjointChoices,
    timestamp: new Date().toISOString()
  }

  console.log('Survey data:')
  console.log(JSON.stringify(surveyData, null, 2))
  console.log('\n')

  // Submit to API
  try {
    console.log('Submitting to API...')
    const response = await fetch(`${BASE_URL}/api/submit-survey`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(surveyData)
    })

    const result = await response.json()
    console.log('Response status:', response.status)
    console.log('Response data:', result)

    if (response.ok) {
      console.log('\n✓ Survey submitted successfully!')
    } else {
      console.log('\n✗ Error submitting survey')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

runTest()
