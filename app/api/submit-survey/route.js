import { GoogleSpreadsheet } from 'google-spreadsheet'

export async function POST(request) {
  try {
    const data = await request.json()
    const { email, company, cardSort, conjoint, timestamp } = data

    // Initialize Google Sheets
    const doc = new GoogleSpreadsheet(process.env.SHEET_ID)

    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })

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
