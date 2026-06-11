# Adaptive Conjoint Survey Tool - Team Recreation Prompt

**Share this with your team to recreate the project.**

---

## The Task

Build a custom adaptive conjoint analysis survey platform to understand how wealth management advisors prioritize product features. The tool should collect data from ~300 participants across two phases: card sort (categorizing features) and pairwise conjoint analysis (comparing feature bundles).

**Deliverable:** A live, shareable survey URL + secure data collection to Google Sheets + data analysis report with product bundle recommendations.

**Timeline:** 2 days  
**Budget:** $0 (use Vercel free tier + existing Google account)

---

## What to Build

### Core Functionality

**Phase 1: Card Sort (5-10 min)**
- Present respondent with 24 product capabilities
- They drag-and-drop each into 4 predefined categories:
  - Baseline (table stakes)
  - Intermediate (expected features)
  - Premium (differentiators)
  - Not Relevant
- Must assign ALL capabilities before proceeding
- Should be responsive (works on desktop & mobile)

**Phase 2: Adaptive Conjoint (5-10 min)**
- Generate 15 randomized product bundles using ONLY capabilities the respondent classified as Baseline, Intermediate, or Premium
- Each bundle should have a mix: ~1-2 from Baseline, ~1-2 from Intermediate, ~0-1 from Premium
- Present pairwise comparisons: "Which bundle would you be more interested in? Option A vs Option B"
- Respondent chooses between 15 pairs
- Record all choices

**Data Collection**
- Collect email, company name (optional)
- Store all responses in Google Sheets (existing sheet or new one)
- Columns: Timestamp, Email, Company, Baseline Features, Intermediate Features, Premium Features, Not Relevant Features, Conjoint Choices

### Technology Stack

**Frontend:** React + Next.js 14 (App Router)  
**Styling:** CSS Modules (no build dependencies)  
**Backend:** Serverless (Vercel)  
**Data Storage:** Google Sheets API with OAuth refresh token flow  
**Deployment:** Vercel (free tier)

---

## Key Decisions Made (& Why)

1. **Card Sort over questionnaire** → More engaging, higher completion rate, reduces fatigue
2. **Pairwise conjoint over rating scale** → More rigorous, generates 3x more data (1,905 vs 610 data points)
3. **Google Sheets for data** → Secure, existing infrastructure, no new vendor dependencies (accept rate-limiting tradeoff)
4. **Randomized pairs (15) over full matrix** → Balances rigor with survey length (~5 min for conjoint phase)
5. **Responsive drag-and-drop** → Include click-to-remove as mobile fallback

---

## Implementation Steps

### Step 1: Project Setup (30 min)
- Create Next.js 14 project with App Router
- Create directory structure:
  ```
  app/
  ├── components/CardSort.js, CardSort.module.css
  ├── components/Conjoint.js, Conjoint.module.css
  ├── api/submit-survey/route.js
  ├── page.js (main survey flow)
  ├── layout.js
  └── globals.css
  ```
- Create `.env.local` with Google Sheets credentials (see below)

### Step 2: Card Sort Component (1 hour)
- Draggable cards for 24 capabilities
- 4 drop zones (one per category)
- Visual feedback (color-coded zones, hover effects)
- Prevent submission until all items assigned
- Click-to-remove functionality (for mobile)
- Responsive: desktop 2-column layout, mobile stacked

**Key Feature:** Track which category each capability is assigned to and return as object:
```javascript
{
  baseline: [...],
  intermediate: [...],
  premium: [...],
  'not-relevant': [...]
}
```

### Step 3: Conjoint Component (1 hour)
- Take the card sort data as input
- Generate randomized bundles (function provided below)
- Display 15 pairwise comparisons
- Side-by-side layout: Option A vs Option B
- Progress bar showing current question
- Prevent proceeding until current pair answered
- Record choices as object: `{ 0: 0, 1: 1, 2: 0, ... }`

**Bundle Generation Logic:**
```
For each bundle:
  - Add 1-2 random features from Baseline
  - Add 1-2 random features from Intermediate
  - Add 0-1 random feature from Premium
Shuffle all bundles
Generate all pairwise combinations
Return first 15 pairs
```

### Step 4: API Endpoint (45 min)
- POST `/api/submit-survey` receives:
  ```javascript
  {
    email: string,
    company: string,
    cardSort: { baseline, intermediate, premium, 'not-relevant' },
    conjoint: { 0: 0/1, 1: 0/1, ... },
    timestamp: ISO string
  }
  ```
- Authenticate with Google Sheets using refresh token
- Append row to Sheet1 with all data
- Return success response
- Handle errors gracefully (display to user)

**Google Sheets Setup:**
- Use existing sheet or create new one
- Create headers: Timestamp, Email, Company, Baseline Features, Intermediate Features, Premium Features, Not Relevant Features, Conjoint Choices
- Sheet URL will be where data accumulates

### Step 5: Main Survey Flow (30 min)
- Stage 1: Email/company form
- Stage 2: Card sort (call CardSort component)
- Stage 3: Conjoint (call Conjoint component, pass card sort results)
- Stage 4: Success page ("Thank you")
- Include error handling and display

### Step 6: Deployment (45 min)
- Push to GitHub
- Create Vercel project connected to GitHub
- Set environment variables on Vercel (do this via API, not UI):
  - `SHEET_ID`: Your Google Sheet ID
  - `GOOGLE_CLIENT_ID`: From your Google project
  - `GOOGLE_CLIENT_SECRET`: From your Google project
  - `GOOGLE_REFRESH_TOKEN`: From your Google auth token
- Deploy → get live URL

---

## QA Checklist

### Manual Testing (Run 5 test responses)
- [ ] Email validation works (required field)
- [ ] Card sort prevents submission until all items assigned
- [ ] Conjoint prevents next until current pair answered
- [ ] Responses appear in Google Sheet with correct data
- [ ] Response format is correct (all fields present)

### Synthetic Data Testing (Run 100+ responses)
- [ ] Create 5 advisor archetypes with different preferences
- [ ] Generate 100+ random responses programmatically
- [ ] Check for rate-limiting errors (plan delays between batches)
- [ ] Verify all responses in Sheet

### Data Quality Checks
- [ ] No missing data in any row
- [ ] Timestamps are accurate
- [ ] Conjoint choices are valid (0 or 1)
- [ ] All 24 capabilities appear somewhere in card sort

---

## Analysis & Output

After collecting 100+ responses:

1. **Feature Frequency Analysis**
   - For each feature, count % of respondents who placed it in each category
   - Identify top 10 features per category

2. **Conjoint Analysis**
   - Parse conjoint choices JSON
   - Calculate Option A vs Option B selection %
   - Identify preference patterns

3. **Segmentation**
   - Group by company/firm type
   - Identify clusters of preferences

4. **Deliverables**
   - Feature demand table (feature → % wanting it)
   - Top 3 product bundle recommendations with pricing
   - Segmentation insights

**Recommended Output:** Python script that reads Sheet data, performs analysis, outputs summary report.

---

## Expected Results (From Our Run)

- **127 responses** collected (61 + retries)
- **1,905 pairwise comparisons** analyzed
- **Top Baseline Feature:** Compliance Monitoring (47%)
- **Top Premium Feature:** Multi-currency Support (76%)
- **Preference Balance:** 58.5% Option A vs 41.5% Option B
- **Product Tiers Recommended:** Foundation ($2k/mo), Professional ($3.5k/mo), Enterprise ($6k/mo)

Your results should show similar patterns (compliance/risk as baseline, CRM/tax/currency as premium).

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "No refresh token" error | Set env vars via Vercel API, not UI |
| 429 rate limit on Sheets | Add 50-100ms delays between requests |
| Drag/drop not working on mobile | Add click-to-remove button alternative |
| CORS errors | Use Next.js API route as proxy to Sheets API |
| Survey not loading | Check env vars are set on Vercel, not just local |
| Data not appearing in Sheet | Verify API has write permission to sheet |

---

## Success Criteria

✅ Live survey URL (publicly shareable)  
✅ Card sort working with all 24 capabilities  
✅ Conjoint generating 15 pairwise comparisons  
✅ 100+ test responses collected to Google Sheet  
✅ Data analysis script producing feature frequency report  
✅ Product bundle recommendations with pricing  
✅ Zero infrastructure cost (Vercel free tier)

---

## Timeline Estimate

- Project Setup: 30 min
- CardSort Component: 1 hour
- Conjoint Component: 1 hour
- API Endpoint: 45 min
- Main Survey Flow: 30 min
- Deployment: 45 min
- QA Testing: 1-2 hours
- Data Analysis: 45 min
- **Total: ~8 hours / 2 days**

---

## Files to Deliver

When complete, your team should have:
- GitHub repo with all source code
- Live Vercel URL
- Google Sheet with 100+ responses
- Data analysis report with findings
- Product bundle recommendations (3 tiers + pricing)

---

## Questions to Clarify First

Before starting, confirm with your team:
1. **Capabilities list:** Are the 24 features fixed, or should we customize?
2. **Category labels:** Stick with Baseline/Intermediate/Premium/Not Relevant, or customize?
3. **Target participants:** Start with synthetic data, then real advisors?
4. **Analysis scope:** Just feature frequency, or deeper segmentation?
5. **Pricing authority:** Does your team decide bundle pricing, or is there guidance?

---

## References

- **Live Demo:** https://adaptive-conjoint.vercel.app
- **GitHub Repo:** https://github.com/ericfischer-wq/adaptive-conjoint
- **Process & Methodology:** See PROCESS_SUMMARY.pdf for detailed walkthrough
- **Example Data Sheet:** [Your Google Sheet URL]

---

## Next Steps After Launch

1. **Recruit 50+ real advisors** to replace synthetic data
2. **Validate findings** - Do preferences match expectations?
3. **A/B test pricing** - Will advisors actually pay these prices?
4. **Feature interaction analysis** - Which combinations drive highest preference?
5. **Competitive benchmark** - How do preferences compare to competitors?

---

**Ready to build? Start with Step 1: Project Setup. Good luck! 🚀**
