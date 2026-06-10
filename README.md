# Adaptive Conjoint Survey Tool

A purpose-built web application for conducting adaptive conjoint analysis surveys with conditional feature bundling.

## Features

- **Card Sort Phase**: Respondents categorize 24 capabilities into 4 predefined categories (Baseline, Intermediate, Premium, Not Relevant)
- **Adaptive Conjoint Phase**: Randomly-generated product bundles are created using only features from Baseline, Intermediate, and Premium categories
- **Real-time Data Collection**: Responses automatically write to Google Sheets
- **Mobile-friendly**: Responsive design works on desktop and mobile

## Setup

### 1. Google Sheets Authentication

You'll need a Google Service Account to write to your sheet:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google Sheets API
4. Create a Service Account and generate a JSON key
5. Copy the `private_key` and `client_email` from the key
6. Share your Google Sheet with the service account email

### 2. Environment Variables

Create a `.env.local` file in the project root:

```
SHEET_ID=1Li5LAwTOcane26XzDCmS6I77gmTA0ICRSbVfhcgm6jc
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 3. Install & Run Locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

### 4. Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Follow the prompts. Set environment variables in the Vercel dashboard.

## Data Structure

Responses are stored in Google Sheets with the following columns:
- `timestamp`: When the survey was completed
- `email`: Respondent email
- `company`: Respondent company (optional)
- `baseline`: Semicolon-separated list of capabilities marked as Baseline
- `intermediate`: Capabilities marked as Intermediate
- `premium`: Capabilities marked as Premium
- `notRelevant`: Capabilities marked as Not Relevant
- `bundle1Rating` - `bundle10Rating`: Ratings for each of 10 bundles (1-10 scale)
- `avgRating`: Average rating across all bundles

## Customization

- **Capabilities**: Edit the `CAPABILITIES` array in `app/components/CardSort.js`
- **Categories**: Modify the `CATEGORIES` array in `app/components/CardSort.js`
- **Number of Bundles**: Change the `count` parameter in `generateBundles()` in `app/components/Conjoint.js`
- **Bundle Composition**: Adjust the logic in `generateBundles()` to change how many features come from each category
