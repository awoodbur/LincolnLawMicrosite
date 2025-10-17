# SEO & Metadata Guide

This document explains all the SEO optimizations implemented for the Lincoln Law website.

## What Was Implemented

### 1. Metadata Configuration (`src/lib/metadata.ts`)

This centralized configuration manages all SEO metadata across the site.

**What it does:**
- Sets up site-wide defaults (title, description, URL)
- Generates Open Graph tags for social media sharing
- Creates Twitter Card metadata
- Controls search engine indexing with robots meta tags
- Generates canonical URLs to prevent duplicate content issues

**Why it matters:**
- Consistent branding across all pages
- Better appearance when shared on social media
- Search engines understand your pages better
- Users see compelling previews before clicking

### 2. Structured Data (Schema.org JSON-LD)

**Local Business Schema** (`src/app/layout.tsx`)
```json
{
  "@type": "LegalService",
  "name": "Lincoln Law",
  "address": { ... },
  "telephone": "(801) 717-1210",
  ...
}
```

**What it does:**
- Tells Google your business type, location, and services
- Helps you appear in Google Maps
- Shows up in "near me" searches
- Enables rich results (star ratings, business hours, etc.)

**Why it matters:**
- Local searches are HUGE for law firms
- "bankruptcy attorney near me" → you show up
- Shows business info directly in search results
- Builds trust with verified information

**FAQ Schema** (`src/app/faq/page.tsx`)
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    { "question": "...", "answer": "..." }
  ]
}
```

**What it does:**
- Google shows your FAQs as expandable dropdowns in search results
- Takes up more real estate on search page
- Increases click-through rate

**Why it matters:**
- Stand out from competitors
- Answer questions before users even click
- Huge for "how to" and "what is" searches

### 3. Sitemap (`src/app/sitemap.ts`)

**What it does:**
- Automatically generates `sitemap.xml`
- Lists all public pages
- Tells Google how often each page changes
- Sets priority for different pages

**Access it at:** `http://yoursite.com/sitemap.xml`

**Why it matters:**
- Ensures Google finds all your pages
- Helps new pages get indexed faster
- Shows which pages are most important

### 4. Robots.txt (`src/app/robots.ts`)

**What it does:**
- Tells search engines which pages to crawl
- Blocks intake form pages (don't want users landing mid-funnel)
- Blocks API endpoints (not useful for search)
- Points to sitemap

**Access it at:** `http://yoursite.com/robots.txt`

**Why it matters:**
- Controls your search presence
- Prevents wasted crawl budget
- Protects private/internal pages

### 5. Page-Specific Metadata

Each page can have custom metadata:

```typescript
// Example usage
export const metadata = generateMetadata({
  title: 'Bankruptcy FAQ',
  description: 'Get answers to common bankruptcy questions...',
  path: '/faq',
  noIndex: false, // Set to true for private pages
});
```

## Current SEO Setup by Page

| Page | Title | Indexed? | Schema | Priority |
|------|-------|----------|--------|----------|
| Home (`/`) | Lincoln Law - Utah Bankruptcy Attorney | ✅ Yes | LocalBusiness | High (1.0) |
| FAQ (`/faq`) | Bankruptcy FAQ \| Lincoln Law | ✅ Yes | FAQ | High (0.8) |
| Privacy (`/legal/privacy`) | Privacy Policy \| Lincoln Law | ✅ Yes | None | Low (0.3) |
| Terms (`/legal/terms`) | Terms of Service \| Lincoln Law | ✅ Yes | None | Low (0.3) |
| Consent (`/legal/consent`) | Consent Disclosure \| Lincoln Law | ✅ Yes | None | Low (0.3) |
| Intake Form (`/intake/*`) | — | ❌ No | None | — |

## What You Still Need to Do

### 1. Create Open Graph Image

**File:** `public/og-image.jpg`
**Size:** 1200 x 630 pixels
**See:** `public/OG_IMAGE_README.md` for detailed instructions

This is what shows up when someone shares your site on Facebook, LinkedIn, Twitter, etc.

### 2. Create Favicons

**Files needed:**
- `public/favicon.ico` (temporary emoji favicon is already in place)
- `public/apple-touch-icon.png`

**See:** `public/FAVICON_README.md` for instructions

### 3. Set Up Google Search Console

**Steps:**
1. Go to: https://search.google.com/search-console
2. Add your site
3. Verify ownership (you'll get a verification code)
4. Add the verification code to `.env`:
   ```
   NEXT_PUBLIC_GOOGLE_VERIFICATION=your-code-here
   ```
5. Submit your sitemap: `https://yoursite.com/sitemap.xml`

**Why:**
- See what keywords you rank for
- Monitor crawl errors
- Track click-through rates
- Request indexing of new pages

### 4. Set Up Google Analytics (Optional)

**Steps:**
1. Create GA4 property at: https://analytics.google.com
2. Get your Measurement ID (looks like `G-XXXXXXXXXX`)
3. Add to `.env`:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
4. The code is already set up to use it

**Why:**
- Track visitor behavior
- See which pages are popular
- Understand where users drop off
- Measure conversion rates

### 5. Add Content to Legal Pages (Done ✅)

Legal pages already have comprehensive content with proper disclaimers.

## SEO Best Practices Followed

### ✅ Technical SEO
- Mobile-responsive design
- Fast page load times (Next.js optimizations)
- HTTPS required (in security headers)
- Semantic HTML structure
- Proper heading hierarchy (H1 → H2 → H3)

### ✅ On-Page SEO
- Descriptive page titles (< 60 characters)
- Compelling meta descriptions (< 160 characters)
- Utah-focused keywords throughout content
- Alt text for images (when you add them)
- Internal linking between pages

### ✅ Local SEO
- NAP (Name, Address, Phone) consistent everywhere
- Utah mentioned prominently
- City names in content (Orem, Salt Lake City, etc.)
- LocalBusiness schema with coordinates

### ✅ User Experience
- Clear call-to-actions
- Easy navigation
- Back buttons on all pages
- Mobile-friendly forms
- Fast, smooth interactions

## Keywords Targeted

Primary keywords (naturally included in content):
- Utah bankruptcy attorney
- Chapter 7 bankruptcy Utah
- Chapter 13 bankruptcy Utah
- Bankruptcy lawyer Utah
- File bankruptcy Utah
- Debt relief Utah
- Utah means test
- Bankruptcy exemptions Utah

Long-tail keywords (from FAQ):
- How much does bankruptcy cost in Utah
- Can I keep my house in bankruptcy Utah
- What is Utah's median income for bankruptcy
- How long does Chapter 7 take in Utah

## Monitoring SEO Performance

Once live, track these metrics:

1. **Google Search Console:**
   - Impressions (how many times you appear in search)
   - Click-through rate (% of people who click)
   - Average position (where you rank)
   - Coverage issues (crawl errors)

2. **Google Analytics:**
   - Traffic sources (organic, direct, referral)
   - Bounce rate
   - Time on page
   - Conversion rate (form submissions)

3. **Manual Checks:**
   - Google your business name (should be #1)
   - Search "bankruptcy attorney [utah city]"
   - Check social media previews (share on FB/LinkedIn)
   - Test on mobile devices

## Testing SEO Before Launch

### Preview Social Media Cards

1. **Facebook Debugger:** https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator:** https://cards-dev.twitter.com/validator
3. **LinkedIn Post Inspector:** https://www.linkedin.com/post-inspector/

Paste your URL and see how it will look when shared.

### Check Structured Data

1. **Google Rich Results Test:** https://search.google.com/test/rich-results
2. Paste your homepage URL
3. Should show "LocalBusiness" schema
4. Paste FAQ page URL
5. Should show "FAQPage" schema

### Validate Markup

1. **W3C Validator:** https://validator.w3.org/
2. Test each page
3. Fix any HTML errors (they hurt SEO)

## Common SEO Mistakes to Avoid

❌ **Don't:**
- Stuff keywords unnaturally
- Hide text or links
- Use duplicate content from other sites
- Ignore mobile users
- Forget to update meta descriptions
- Use generic titles like "Home" or "About"

✅ **Do:**
- Write for humans first, search engines second
- Keep content fresh and updated
- Get listed in local directories (Yelp, Google Business)
- Encourage reviews (huge for local SEO)
- Build natural backlinks (guest posts, partnerships)

## Next Steps After Launch

1. **Week 1:**
   - Submit sitemap to Google Search Console
   - Verify site in Bing Webmaster Tools
   - Create Google Business Profile
   - Submit to legal directories

2. **Week 2-4:**
   - Monitor for crawl errors
   - Check which pages are indexed
   - Start tracking rankings for key terms
   - Set up Google Business Profile posts

3. **Month 2+:**
   - Add blog/articles (content marketing)
   - Monitor competitors
   - Build citations (directory listings)
   - Request reviews from clients
   - Create video content (huge for lawyers)

## Questions?

SEO is an ongoing process. This setup gives you a solid foundation, but ongoing optimization is key to ranking well in competitive markets like "bankruptcy attorney."

The most important factors for local law firm SEO:
1. Google Business Profile (claim and optimize it!)
2. Client reviews (ask every satisfied client)
3. Quality, location-specific content
4. Citations (NAP consistency across the web)
5. Website technical performance (already handled ✅)

---

**Bottom line:** You now have professional SEO infrastructure. Once you create the OG image, set up Search Console, and optimize your Google Business Profile, you'll be in great shape for organic search traffic.
