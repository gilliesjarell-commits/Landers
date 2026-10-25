# Research: Home Warranty (Meta Ads)

## 1. Offer check
- **Slug:** `home-warranty-2` (`home-warranty/` already exists. It was built before the lander formats
  existed, so this run uses the Advertorial / Quiz formats.)
- **Vertical:** Home Services. A home warranty is a service contract for home systems and appliances,
  not insurance. Many states regulate it as a service contract, so every page carries a short disclaimer.
- **Offer type:** home warranty plan quote or sign-up (lead gen)
- **EPC:** not checked. Look it up in your network before spending; the rule is above $0.80.
- **Affiliate link:** none yet, so the pages use the placeholder `https://example.com/offer`
- **Traffic:** Meta (Facebook + Instagram) only. This overrides the Facebook + Native default.
- **Test budget:** $50 split across the 3 angles (~$16.67 each), one ad set per angle.

### Meta ads policy check: allowed, with restrictions to watch
Home warranties are **allowed** on Meta. They aren't in Meta's prohibited or restricted content lists.
- **Special Ad Category:** US advertisers must self-declare **Financial Products and Services** for
  credit, insurance, banking and investment ads, and **Housing** for home sales, rentals, mortgages and
  homeowners insurance. A home warranty is a service contract and isn't named in either, so start with
  **no** special category. Meta's 2026 multimodal classifier reads the ad text, image *and* landing page
  together, and words like "coverage", "protection plan" and "insurance" can trip it. **If an ad is
  rejected or flagged, re-launch the ad sets under the category Meta names** (Financial Products and
  Services or Housing). Either one removes age, gender and ZIP targeting and narrows detailed
  targeting, so lean on broad targeting and the creative.
- **Personal attributes:** ads must not assert facts about the viewer ("Your AC is 12 years old",
  "Can't afford a repair?"). The ad copy uses second-person scenarios, not claims about who the viewer
  is or what they can afford.
- **Landing pages:** no fake urgency, nothing implying the page *is* the warranty company, clear
  affiliate disclosure and service-contract disclaimer. All three pages comply.

## 2. Avatar
On Meta the avatar isn't searching. They're scrolling, so the ad has to catch the memory of the last
thing that broke in their house.

1. **Who:** US homeowners, roughly 35–65, middle income, in a house 8+ years old with aging HVAC,
   water heater and kitchen appliances. Two groups: recent buyers who stretched for the down payment
   and have thin savings, and long-time owners watching everything reach the end of its lifespan at
   once. Busy, practical, not handy enough (or not willing) to fix a furnace. Daily frustration: the
   house always needs *something*, and there's never a good time for a surprise bill.
2. **Top 10 pain points:**
   1. A big system or appliance dies with no warning (AC in July, furnace in January, water heater on
      a workday morning).
   2. The repair bill lands at the worst time and wrecks the month's budget.
   3. Finding a trustworthy tech fast, and not knowing if the quote is fair.
   4. Learning that homeowners insurance doesn't pay for things that just wear out.
   5. "Everything in this house is the same age and it's all going to go at once."
   6. Calling around, waiting days for someone to come out, taking time off work.
   7. Repair-or-replace decisions they don't feel qualified to make.
   8. No dedicated repair fund, or it got spent on the last thing.
   9. Fear of being upsold by a contractor during an emergency.
   10. Stories about warranties denying claims, payout caps and fine print (the main objection).
3. **Already tried:** an emergency fund that keeps getting raided, the manufacturer's warranty
   (expired), YouTube DIY fixes, whichever contractor answered first, putting repairs on a credit card,
   delaying a repair until it got worse, or a previous warranty with surprise exclusions.
4. **What makes them click now:** a recent breakdown (theirs or a friend's), seasonal stress (first
   heat wave, first cold snap), or a home closing. The ad has to name a moment they recognize and offer
   a calm, low-effort next step ("see what a plan covers for your home"), not a hard sell.
5. **Where they are online:** Facebook (neighborhood groups, Marketplace, home and DIY groups),
   Instagram home and renovation content, Nextdoor, Reddit (r/homeowners, r/HomeImprovement,
   r/FirstTimeHomeBuyer), YouTube repair videos.

**Competitor and audience notes:** warranty brands on Meta lead with "one call, one service fee" and
seasonal breakdowns (AC in summer, furnace in winter). Reddit and consumer coverage are full of claim
denials, payout caps and "improper maintenance" exclusions, so honest pages that tell people to read
the contract stand out. Quiz funnels ("how old is your home?", "what would you want covered?") are a
common, low-cost lead format on Meta for home services.

**Market context (category facts for planning, not used as claims on the pages):**
- About 85% of homeowners spent money on an unplanned home repair in 2025 (Clever Offers, Feb 2026).
- In HomeServe's survey, over 80% had a repair emergency in the past 12 months, and nearly 1 in 3 had
  $500 or less saved for emergencies; 41% had delayed a repair that ended up costing more.
- Standard homeowners insurance generally doesn't cover breakdowns from normal wear and tear; home
  warranties are service contracts that do, within limits and exclusions (NerdWallet, Progressive).
- The category has a real trust problem: complaints about denied claims, payout caps and
  "modification" costs are common (FTC consumer alert, NBC News, NerdWallet).

## 3. Angle scores (for a Meta scroller)
| Angle | Score | Why |
| --- | --- | --- |
| Pain Point | 5 | Almost every homeowner has a "the AC died in July" story. The breakdown moment is vivid, universal and easy to show in a feed. |
| Curiosity | 4 | "Your homeowners insurance probably won't pay when the AC just wears out" is a real, factual surprise, and the click closes the loop. |
| Direct Benefit | 4 | One call, one service fee, a vetted tech, a more predictable repair budget. A clear end state, kept modest because of the category's trust issues. |
| Social Proof | 3 | Category proof exists (85% faced an unplanned repair), but it proves the *problem*, not that warranties satisfy people, and public warranty reviews are mixed-to-negative. No offer-owner numbers yet. |
| Fear | 3 | Systems really do wear out, so it can be factual, but "everything is about to break" reads as a scare, overlaps with Pain Point, and Meta review is touchy about it. |

**Picked:** Pain Point (5), Curiosity (4), Direct Benefit (4).

**Skipped:**
- **Social Proof:** the only proof is about how common repairs are, not about the offer. Leaning on it
  would imply satisfaction the public record doesn't support, and CLAUDE.md bars stats the offer owner
  didn't supply on the pages. Revisit once the network supplies the offer's own published numbers.
- **Fear:** passes the guardrail if kept proportionate, but scores below the three picked, overlaps
  with Pain Point, and fear-heavy creative draws Meta disapprovals.

## 4. Formats
Home Services naturally runs on Direct or Quiz; Meta is cold social traffic, which converts best on a
Quiz. Two formats in the test: Advertorial and Quiz.

| Page | Angle | Format | Why |
| --- | --- | --- | --- |
| `pain.html` | Pain Point | Advertorial | Pain reads best as a story; a short second-person article warms cold Meta traffic and has room to handle the "do warranties actually pay?" objection honestly. |
| `curiosity.html` | Curiosity | Quiz | The open loop ("would your insurance pay for this?") fits a quick quiz, and quizzes are the lowest-effort format for cold social. |
| `benefit.html` | Direct Benefit | Quiz | Direct is built for high-intent search, not cold scrollers; on Meta the benefit lands better as a 4-tap quiz that ends on the offer. |

Quiz questions (both ask ZIP last because plans and availability vary by state):
- Curiosity: home type → home age → what you'd want covered first → ZIP.
- Benefit: own / buying / selling → home age → what you'd want covered → ZIP.

## Sources
- Meta Special Ad Categories guide (Jon Loomer): https://www.jonloomer.com/special-ad-categories-meta-ads/
- Meta 2026 special ad category enforcement (multimodal classification): https://dhruboduti.com/blog/metas-expanded-special-ad-category-enforcement-in-2026-what-changed-for-housing-employment-and-credit-ads
- Meta special ad category rules (Data Axle): https://www.data-axle.com/resources/blog/meta-special-ad-categories-rules/
- 85% of homeowners faced unexpected repair costs (Clever Offers via Yahoo Finance, 2026): https://finance.yahoo.com/news/data-85-american-homeowners-faced-134100367.html
- HomeServe survey, homeowners underfunded for repair emergencies: https://finance.yahoo.com/real-estate/articles/too-much-information-not-enough-123000714.html
- Home warranty vs homeowners insurance (NerdWallet): https://www.nerdwallet.com/home-ownership/home-warranty/learn/home-warranty-vs-home-insurance
- Does homeowners insurance cover appliances (Progressive): https://www.progressive.com/answers/does-home-insurance-cover-appliances/
- FTC, "So what's the deal with home warranties?": https://www.consumer.ftc.gov/consumer-alerts/2023/02/so-whats-deal-home-warranties
- NBC News, home warranty complaints: https://www.nbcnews.com/business/consumer/american-home-shield-appliance-warranty-complaints-rcna180782
- AC warranty claim dispute (The Cool Down, 2026): https://www.thecooldown.com/green-home/ac-warranty-homeowner-issues-repair-costs/
- Quiz funnels on Meta for lead gen (Interact): https://www.tryinteract.com/blog/get-leads-from-meta-ads-with-quiz-funnels/
