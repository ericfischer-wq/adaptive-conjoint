export async function POST(request) {
  try {
    const data = await request.json()
    const { email, company, cardSort, conjoint, timestamp } = data

    // Get access token using refresh token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
        grant_type: 'refresh_token'
      })
    })

    const tokenData = await tokenResponse.json()
    if (!tokenData.access_token) {
      throw new Error('Failed to get access token: ' + JSON.stringify(tokenData))
    }

    // Build the row values
    const rowValues = [
      timestamp,
      email,
      company || '',
      (cardSort.baseline || []).join('; '),
      (cardSort.intermediate || []).join('; '),
      (cardSort.premium || []).join('; '),
      (cardSort['not-relevant'] || []).join('; '),
      JSON.stringify(conjoint)
    ]

    // Append row to sheet
    const appendResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${process.env.SHEET_ID}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenData.access_token}`
        },
        body: JSON.stringify({
          values: [rowValues]
        })
      }
    )

    const appendData = await appendResponse.json()

    if (!appendResponse.ok) {
      throw new Error('Failed to append to sheet: ' + JSON.stringify(appendData))
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error submitting survey:', error)
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
