# Lincoln Law Intake Flow - Attorney Review Document

**Date Created:** October 23, 2025
**Purpose:** This document outlines the complete user intake flow for attorney review and feedback.

---

## Flow Overview

The intake process consists of 4 main steps:

1. **Home Page** → User clicks "Check Your Options" CTA
2. **Questionnaire Page** → Collects financial and household information
3. **Email & Consent Page** → Collects email and legal consents, creates lead with eligibility
4. **Plaid Link Page (Optional)** → User can optionally connect bank account for refined assessment
5. **Success Page** → Confirmation and next steps

---

## STEP 1: Home Page (`/`)

### Call-to-Action
- Large prominent button: **"Check Your Options"**
- Directs user to `/intake` (questionnaire)

### Trust Signals Displayed
- "Utah-Licensed Attorneys"
- "Free Consultation"
- "Confidential Assessment"

**ATTORNEY REVIEW:**
- [ ] Is the CTA clear and appropriate?
- [ ] Any additional trust signals needed?
- [ ] Comments: _______________________________________________

---

## STEP 2: Questionnaire Page (`/intake`)

This is the main data collection page. All fields are displayed on a single page.

### Section 1: Location Validation

**Question:** "Are you a Utah resident?"
- **Field Type:** Radio buttons
- **Options:**
  - ✓ Yes, I live in Utah
  - ✗ No, I live in another state
- **Validation:** Must select "Yes" to proceed (Utah-only for PoC)
- **Error Message:** "This service is currently only available for Utah residents."

**ATTORNEY REVIEW:**
- [ ] Is Utah-only restriction appropriate for launch?
- [ ] Should we collect which state they're from if they select "No"?
- [ ] Comments: _______________________________________________

---

**Question:** "What county do you live in?" *(Optional)*
- **Field Type:** Dropdown select
- **Options:** All 29 Utah counties (Alphabetical)
  - (Select county)
  - Beaver County
  - Box Elder County
  - Cache County
  - Carbon County
  - Daggett County
  - Davis County
  - Duchesne County
  - Emery County
  - Garfield County
  - Grand County
  - Iron County
  - Juab County
  - Kane County
  - Millard County
  - Morgan County
  - Piute County
  - Rich County
  - Salt Lake County
  - San Juan County
  - Sanpete County
  - Sevier County
  - Summit County
  - Tooele County
  - Uintah County
  - Utah County
  - Wasatch County
  - Washington County
  - Wayne County
  - Weber County
- **Validation:** Optional
- **Storage:** Stored in database for venue/jurisdiction tracking

**ATTORNEY REVIEW:**
- [ ] Is county information useful for your practice?
- [ ] Should this be required instead of optional?
- [ ] Are there specific counties you don't serve?
- [ ] Comments: _______________________________________________

---

### Section 2: Household Information

**Question:** "How many people are in your household?"
- **Field Type:** Number input (slider or dropdown)
- **Options:** 1-8 people
- **Validation:** Required, must be between 1-8
- **Default:** None selected
- **Purpose:** Used for Utah means test calculation

**ATTORNEY REVIEW:**
- [ ] Is 8 person maximum appropriate? Should it go higher?
- [ ] Should we ask for ages/dependents breakdown?
- [ ] Comments: _______________________________________________

---

**Question:** "What is your marital status?"
- **Field Type:** Radio buttons or dropdown
- **Options:**
  - Single
  - Married
  - Separated
- **Validation:** Required
- **Purpose:** Affects means test and exemptions

**ATTORNEY REVIEW:**
- [ ] Should we add "Divorced" as separate option?
- [ ] Should we add "Widowed"?
- [ ] Should "Separated" have follow-up question (legally separated vs living separately)?
- [ ] Comments: _______________________________________________

---

### Section 3: Financial Information

**Question:** "What is your approximate monthly household income?"
- **Field Type:** Radio buttons (range selection)
- **Options:**
  - Less than $3,000
  - $3,000 - $5,000
  - $5,000 - $8,000
  - More than $8,000
- **Validation:** Required
- **Purpose:** Primary means test screening

**ATTORNEY REVIEW:**
- [ ] Are these income ranges appropriate for Utah?
- [ ] Should ranges be more granular (e.g., $8k-$10k, $10k+)?
- [ ] Should we ask about gross vs net income?
- [ ] Should we ask about income sources (employment, benefits, etc.)?
- [ ] Comments: _______________________________________________

---

**Question:** "What is your approximate total unsecured debt?"
- **Field Type:** Radio buttons (range selection)
- **Options:**
  - Less than $10,000
  - $10,000 - $25,000
  - $25,000 - $50,000
  - More than $50,000
- **Validation:** Required
- **Purpose:** Assess debt burden and potential relief

**ATTORNEY REVIEW:**
- [ ] Are these debt ranges appropriate?
- [ ] Should we define "unsecured debt" more clearly for users?
- [ ] Should we ask about secured debt separately (mortgage, car loans)?
- [ ] Should we ask about specific debt types (credit cards, medical, student loans)?
- [ ] Comments: _______________________________________________

---

**Question:** "What is your current employment status?"
- **Field Type:** Radio buttons or dropdown
- **Options:**
  - Employed
  - Self-employed
  - Unemployed
  - Retired
- **Validation:** Required
- **Purpose:** Income stability assessment

**ATTORNEY REVIEW:**
- [ ] Should we add "Disabled" or "On disability benefits"?
- [ ] Should we add "Student"?
- [ ] Should "Unemployed" distinguish between actively seeking vs not seeking?
- [ ] Should we ask about length of employment/unemployment?
- [ ] Comments: _______________________________________________

---

### Section 4: Situation Indicators

**Question:** "Are you currently behind on any debt payments?"
- **Field Type:** Checkbox (Yes/No)
- **Label:** "I have missed or am behind on payments"
- **Validation:** Optional (can be unchecked)
- **Storage:** Boolean field `missedPayments`

**ATTORNEY REVIEW:**
- [ ] Is this question clear enough?
- [ ] Should we ask how many months behind?
- [ ] Should we ask which types of debt they're behind on?
- [ ] Comments: _______________________________________________

---

**Question:** "Are you facing wage garnishment?"
- **Field Type:** Checkbox (Yes/No)
- **Label:** "I am facing or currently experiencing wage garnishment"
- **Validation:** Optional
- **Storage:** Boolean field `wageGarnishment`

**ATTORNEY REVIEW:**
- [ ] Should this also include bank levy/account garnishment?
- [ ] Should we ask if garnishment has already started vs pending?
- [ ] Comments: _______________________________________________

---

**Question:** "Do you have concerns about losing property or assets?"
- **Field Type:** Checkbox (Yes/No)
- **Label:** "I'm concerned about losing my home, car, or other property"
- **Validation:** Optional
- **Storage:** Boolean field `propertyConcerns`

**ATTORNEY REVIEW:**
- [ ] Is this question too vague?
- [ ] Should we ask specifically about home equity?
- [ ] Should we ask specifically about vehicle equity?
- [ ] Should we ask about other valuable assets (retirement accounts, savings, etc.)?
- [ ] Comments: _______________________________________________

---

### Section 5: Additional Information

**Question:** "Is there anything else you'd like us to know?"
- **Field Type:** Textarea (multi-line text input)
- **Validation:** Optional
- **Character Limit:** None (consider adding?)
- **Storage:** Text field `notes`
- **Placeholder Text:** "Optional: Share any additional details about your situation..."

**ATTORNEY REVIEW:**
- [ ] Should we provide prompts/examples of what to include?
- [ ] Should we add character limit?
- [ ] Should this be required instead of optional?
- [ ] Comments: _______________________________________________

---

### Submit Button

**Button Text:** "Continue"
**Action:** Navigate to `/intake/email` (Email & Consent page)

**ATTORNEY REVIEW:**
- [ ] Should button text be more specific (e.g., "Get My Assessment")?
- [ ] Comments: _______________________________________________

---

## STEP 3: Email & Consent Page (`/intake/email`)

This page collects the user's email address and required legal consents. Once submitted, a lead is created in the database with eligibility assessment.

### Header
**Title:** "Almost Done"
**Subtitle:** "Enter your email to receive your next steps and personalized guidance."

**ATTORNEY REVIEW:**
- [ ] Is messaging appropriate and compliant?
- [ ] Comments: _______________________________________________

---

### Privacy Assurance Card
**Type:** Info card (blue background)
**Message:** "Your email will only be used to send you information about your bankruptcy assessment. We will never sell or share your information with third parties."

**ATTORNEY REVIEW:**
- [ ] Is privacy message adequate?
- [ ] Any additional assurances needed?
- [ ] Comments: _______________________________________________

---

### Email Input

**Question:** "Email Address"
- **Field Type:** Email input
- **Validation:** Required, must be valid email format
- **Placeholder:** "your.email@example.com"
- **Helper Text:** "We'll send your next steps to this email."

**ATTORNEY REVIEW:**
- [ ] Should we collect phone number as well?
- [ ] Should we verify email (send confirmation code)?
- [ ] Comments: _______________________________________________

---

### Required Consents

All three consents must be checked to submit the form.

**Consent 1:** "I have read and agree to the [Privacy Policy](/legal/privacy) *"
- **Field Type:** Checkbox (required)
- **Link:** Opens `/legal/privacy` page

**Consent 2:** "I agree to the [Terms of Service](/legal/terms) *"
- **Field Type:** Checkbox (required)
- **Link:** Opens `/legal/terms` page

**Consent 3:** "I consent to the collection and use of my information as described in the [Consent Disclosure](/legal/consent) *"
- **Field Type:** Checkbox (required)
- **Link:** Opens `/legal/consent` page

**Storage:** All consent actions logged with timestamp, IP address, and user agent in `ConsentLog` table.

**ATTORNEY REVIEW:**
- [ ] Are these three consents sufficient and appropriate?
- [ ] Should we add TCPA consent for calls/texts?
- [ ] Should we add email marketing opt-in (separate from transactional)?
- [ ] Any additional legal consents needed for Utah?
- [ ] Comments: _______________________________________________

---

### Important Disclaimer (Warning Card)

**Type:** Warning card (yellow background)
**Title:** "Important Disclaimer"
**Message:** "By submitting this form, you acknowledge that the information provided is for preliminary assessment only and does not constitute legal advice. A licensed attorney will review your information and contact you to discuss your options."

**ATTORNEY REVIEW:**
- [ ] Is disclaimer language sufficient?
- [ ] Any additional disclaimer language needed?
- [ ] Should this be more prominent?
- [ ] Comments: _______________________________________________

---

### Submit Button

**Button Text:** "Submit & Continue"
**Action:**
1. Validate all fields
2. Calculate eligibility assessment (if detailed data available)
3. Create lead in database with eligibility results
4. Store lead ID in browser
5. Send confirmation email to user
6. Send notification email to staff with eligibility details
7. Navigate to `/intake/link` (Plaid connection page)

**ATTORNEY REVIEW:**
- [ ] Is the automatic email notification workflow appropriate?
- [ ] Should user receive immediate eligibility results on screen?
- [ ] Comments: _______________________________________________

---

## STEP 4: Plaid Link Page (`/intake/link`) - OPTIONAL

This page allows users to optionally connect their bank account via Plaid (Sandbox mode) for a more refined financial assessment.

### Header
**Title:** "Refine Your Assessment"
**Subtitle:** "Connect your bank to provide more accurate financial insights."

**ATTORNEY REVIEW:**
- [ ] Should bank connection be optional or encouraged more strongly?
- [ ] Any concerns about Plaid integration for client security?
- [ ] Comments: _______________________________________________

---

### Sandbox Notice Card

**Type:** Info card (blue background)
**Title:** "Sandbox Mode - Test Data Only"
**Message:** "This connection uses Plaid's Sandbox environment with synthetic test data. No real financial information is accessed in this demo."

**Test Credentials Displayed:**
- Username: user_good
- Password: pass_good

**ATTORNEY REVIEW:**
- [ ] Will Plaid be used in production or removed?
- [ ] If keeping Plaid, what specific data should we extract?
- [ ] Comments: _______________________________________________

---

### Primary Action

**Button:** "Connect Your Bank Account"
**Action:** Opens Plaid Link modal, exchanges token, stores bank data with lead

---

### Secondary Action (Skip)

**Divider:** "or"
**Button:** "Continue Without Connecting"
**Message:** "We'll work with the information you've already provided"
**Action:** Navigate directly to `/intake/success`

**ATTORNEY REVIEW:**
- [ ] Is skip option too prominent (reducing bank connections)?
- [ ] Should we incentivize bank connection more?
- [ ] Comments: _______________________________________________

---

### Security Note (Footer)

**Message:** "Your financial data is encrypted and securely stored. We never share your information with third parties without your explicit consent."

**ATTORNEY REVIEW:**
- [ ] Is security messaging adequate?
- [ ] Any additional security assurances needed?
- [ ] Comments: _______________________________________________

---

## STEP 5: Success Page (`/intake/success`)

### Header
**Title:** "Thank You!"
**Subtitle:** "We've received your information and will be in touch shortly."

### Next Steps Card

**Message:**
1. Check your email for confirmation
2. A licensed attorney will review your case
3. We'll contact you within 1-2 business days to discuss your options

**ATTORNEY REVIEW:**
- [ ] Is 1-2 business day response time accurate?
- [ ] Should we provide emergency contact info?
- [ ] Should we show preliminary eligibility results here?
- [ ] Any additional next steps needed?
- [ ] Comments: _______________________________________________

---

## Email Notifications

### User Confirmation Email

**Sent To:** User's email address (currently redirected to dev email for testing)
**Subject:** "We've Received Your Information - Lincoln Law"
**Content:**
- Thank you message
- Confirmation that information was received
- Next steps (attorney review, contact within 1-2 days)
- Contact information if they have questions

**ATTORNEY REVIEW:**
- [ ] Should we include preliminary eligibility in user email?
- [ ] Any specific language/disclaimers needed?
- [ ] Comments: _______________________________________________

---

### Staff Notification Email

**Sent To:** Staff leads email (configured in environment variables)
**Subject:** "[LEAD] New Bankruptcy Lead: {email} ({state})"
**Content Includes:**
- Contact information (email, state, county)
- Household information (size, marital status)
- Financial snapshot (income range, debt range, employment)
- Situation indicators (missed payments, garnishment, property concerns)
- **Eligibility Assessment:**
  - Summary
  - Recommended chapter (7 or 13)
  - Chapter 7 eligibility status
  - Income test: Pass/Fail
  - Budget test: Pass/Fail
  - Asset risk: Yes/No
  - Key reasons (bulleted list)
  - Disclaimer
- Additional notes (if provided)
- Lead ID and source
- Timestamp

**ATTORNEY REVIEW:**
- [ ] Is the email format easy to review?
- [ ] Any additional information needed in staff notification?
- [ ] Should different attorneys receive leads based on criteria?
- [ ] Should we integrate with your CRM/case management system?
- [ ] Comments: _______________________________________________

---

## Eligibility Assessment Logic

The system evaluates bankruptcy eligibility based on the questionnaire data using Utah means test thresholds.

### Current Calculation Factors:
1. **Income Test:** Compares household income to Utah median income by household size
2. **Budget Test:** Compares monthly disposable income against thresholds
3. **Asset Risk Assessment:** Flags if property concerns were indicated

### Current Outcomes:
- **Chapter 7 Likely:** Below median income, passes budget test, low asset risk
- **Chapter 7 Possible:** Some factors favorable
- **Chapter 13 Recommended:** Above median income or fails budget test
- **Needs Attorney Review:** Complex situation

### Important Notes:
- **Means test thresholds are currently PLACEHOLDER values**
- **Must be updated with official data from uscourts.gov**
- Eligibility is marked as "preliminary, informational only"
- Always includes disclaimer: "not legal advice, requires attorney consultation"

**ATTORNEY REVIEW:**
- [ ] Should eligibility assessment be shown to users or staff-only?
- [ ] Are the evaluation factors appropriate?
- [ ] What additional factors should be considered?
- [ ] Should we update means test thresholds quarterly?
- [ ] Any concerns about automated eligibility assessment?
- [ ] Comments: _______________________________________________

---

## Data Storage & Compliance

### Database Tables:
1. **Lead:** Core lead information (all questionnaire data + email)
2. **ConsentLog:** Consent tracking (version, timestamp, IP, user agent)
3. **EligibilityResult:** Stored eligibility assessment
4. **PlaidSummary:** Bank connection data (if user connects via Plaid)
5. **AuditLog:** Event tracking for compliance

### Security Measures:
- All data encrypted in transit (HTTPS)
- Database credentials stored as environment variables (not in code)
- Plaid access tokens stored server-side only (never sent to client)
- Rate limiting on all API endpoints
- CSP, HSTS, and other security headers

### Compliance:
- GDPR-style consent tracking
- Privacy policy, terms of service, consent disclosure pages
- PII redaction in logs
- Minimum-necessary data collection

**ATTORNEY REVIEW:**
- [ ] Any additional compliance requirements for Utah?
- [ ] Should we add data retention policy?
- [ ] Should we add data deletion request process?
- [ ] Any concerns about data security?
- [ ] Comments: _______________________________________________

---

## QUESTIONS TO ADD/REMOVE

### Potential Additional Questions (For Your Consideration):

1. **Name Collection:**
   - [ ] Should we collect first/last name? If so, at what step?

2. **Phone Number:**
   - [ ] Should we collect phone number? Required or optional?

3. **Best Contact Method:**
   - [ ] Should we ask preferred contact method (email vs phone vs text)?

4. **Best Time to Contact:**
   - [ ] Should we ask preferred contact time?

5. **Urgency:**
   - [ ] Should we ask about urgency (e.g., "Is this urgent?", "When do you need help?")?

6. **Prior Bankruptcy:**
   - [ ] Should we ask if they've filed bankruptcy before?

7. **Current Legal Actions:**
   - [ ] Should we ask about lawsuits, judgments, or pending legal actions?

8. **Property Ownership:**
   - [ ] Should we ask explicitly about home ownership? Car ownership?

9. **Monthly Expenses:**
   - [ ] Should we ask about monthly expenses separately from income?

10. **Debt Types:**
    - [ ] Should we break down debt by type (credit cards, medical, student loans, tax debt)?

11. **Creditor Count:**
    - [ ] Should we ask how many creditors they have?

12. **Referral Source:**
    - [ ] Should we ask "How did you hear about us?"

**ATTORNEY REVIEW:**
- [ ] Which of these questions should be ADDED?
- [ ] Comments: _______________________________________________

---

### Potential Questions to REMOVE:

Review each question in the flow above. Mark any questions that should be removed:

- [ ] County (optional field)
- [ ] Household size
- [ ] Marital status
- [ ] Income range
- [ ] Debt range
- [ ] Employment status
- [ ] Missed payments checkbox
- [ ] Wage garnishment checkbox
- [ ] Property concerns checkbox
- [ ] Additional notes textarea

**ATTORNEY REVIEW:**
- [ ] Which questions above should be REMOVED?
- [ ] Comments: _______________________________________________

---

## OVERALL FEEDBACK

### User Experience:
- [ ] Is the flow too long? Too short?
- [ ] Should it be broken into multiple pages instead of one long questionnaire?
- [ ] Should there be a progress indicator?
- [ ] Comments: _______________________________________________

### Legal/Compliance:
- [ ] Any red flags or concerns about the current flow?
- [ ] Any Utah-specific legal requirements not being met?
- [ ] Comments: _______________________________________________

### Practice Integration:
- [ ] How do you currently handle leads?
- [ ] Should this integrate with existing tools (CRM, case management, etc.)?
- [ ] Comments: _______________________________________________

### Priority Changes:
- [ ] What changes are HIGH PRIORITY before launch?
- [ ] What changes are NICE TO HAVE but not critical?
- [ ] Comments: _______________________________________________

---

## NEXT STEPS

Please review this document and:
1. Check all applicable boxes
2. Add comments in the designated areas
3. Mark priority items
4. Return to development team for implementation

**Attorney Signature:** _________________________
**Date:** _________________________

---

**Document Version:** 1.0
**Last Updated:** October 23, 2025
**Technical Contact:** Aaron Woodbury
**Questions?** Contact development team with any questions about implementation feasibility.
