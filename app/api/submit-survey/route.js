// In-memory storage (clears on redeploy, but fine for testing)
let responses = []

export async function POST(request) {
  try {
    const data = await request.json()
    const { email, company, cardSort, conjoint, timestamp } = data

    // Store response
    responses.push({
      timestamp,
      email,
      company,
      baseline: (cardSort.baseline || []).join('; '),
      intermediate: (cardSort.intermediate || []).join('; '),
      premium: (cardSort.premium || []).join('; '),
      notRelevant: (cardSort['not-relevant'] || []).join('; '),
      conjointChoices: conjoint
    })

    console.log(`Stored response from ${email}. Total responses: ${responses.length}`)

    return Response.json({ success: true, totalResponses: responses.length })
  } catch (error) {
    console.error('Error submitting survey:', error)
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Return as CSV
    if (responses.length === 0) {
      return Response.json({ message: 'No responses yet' })
    }

    const headers = ['timestamp', 'email', 'company', 'baseline', 'intermediate', 'premium', 'notRelevant', 'conjointChoices']
    const rows = responses.map(r => [
      r.timestamp,
      r.email,
      r.company,
      `"${r.baseline}"`,
      `"${r.intermediate}"`,
      `"${r.premium}"`,
      `"${r.notRelevant}"`,
      `"${JSON.stringify(r.conjointChoices).replace(/"/g, '""')}"`
    ])

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="survey-responses.csv"'
      }
    })
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
