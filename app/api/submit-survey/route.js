import { google } from 'googleapis'

export async function POST(request) {
  try {
    const data = await request.json()
    const { email, company, cardSort, conjoint, timestamp } = data

    // Use the refresh token to get a new access token
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost' // redirect URI (not used for refresh token flow)
    )

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    })

    const { credentials } = await oauth2Client.refreshAccessToken()
    const accessToken = credentials.access_token

    // Create sheets API client
    const sheets = google.sheets({ version: 'v4', auth: oauth2Client })

    // Prepare row data
    const rowValues = [[
      timestamp,
      email,
      company || '',
      (cardSort.baseline || []).join('; '),
      (cardSort.intermediate || []).join('; '),
      (cardSort.premium || []).join('; '),
      (cardSort['not-relevant'] || []).join('; '),
      JSON.stringify(conjoint)
    ]]

    // Append to sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: 'Sheet1!A:H',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: rowValues
      }
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error submitting survey:', error)
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
