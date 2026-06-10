import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'

export async function POST(request) {
  try {
    const data = await request.json()
    const { email, company, cardSort, conjoint, timestamp } = data

    // Initialize Google Sheets with OAuth
    const doc = new GoogleSpreadsheet(process.env.SHEET_ID)

    const auth = new JWT({
      email: 'user@example.com',
      key: 'fake',
      scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
    })

    // Use the refresh token to get a new access token
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
        grant_type: 'refresh_token'
      })
    })

    const tokenData = await response.json()
    if (!tokenData.access_token) {
      throw new Error('Failed to get access token')
    }

    doc.useApiKey(tokenData.access_token)
    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[0]

    // Flatten data for sheet
    const row = {
      timestamp,
      email,
      company,
      baseline: (cardSort.baseline || []).join('; '),
      intermediate: (cardSort.intermediate || []).join('; '),
      premium: (cardSort.premium || []).join('; '),
      notRelevant: (cardSort['not-relevant'] || []).join('; '),
      bundle1Rating: conjoint[0] || '',
      bundle2Rating: conjoint[1] || '',
      bundle3Rating: conjoint[2] || '',
      bundle4Rating: conjoint[3] || '',
      bundle5Rating: conjoint[4] || '',
      bundle6Rating: conjoint[5] || '',
      bundle7Rating: conjoint[6] || '',
      bundle8Rating: conjoint[7] || '',
      bundle9Rating: conjoint[8] || '',
      bundle10Rating: conjoint[9] || '',
      avgRating: Object.values(conjoint).reduce((a, b) => a + b, 0) / Object.keys(conjoint).length
    }

    await sheet.addRow(row)

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error submitting survey:', error)
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
