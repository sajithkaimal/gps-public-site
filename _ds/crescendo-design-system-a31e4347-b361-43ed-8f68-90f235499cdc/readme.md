# Crescendo Design System

The brand and UI design system for **Crescendo** — the AI-native CXM (customer experience management) platform. This project is the canonical source for Crescendo's visual identity, voice, tokens, components, and asset templates. An automated compiler indexes the tokens and components here so other projects can design on-brand.

> **Vision:** Turn customer experience into a growth driver. Not a cost center to minimize.
> **Tagline:** "The only AI-native CXM. One platform. One team. Live in 4 weeks."

## What Crescendo is

Crescendo rebuilt CX from the ground up — AI-native architecture, not legacy tools with AI bolted on. It replaces a fragmented stack (8–14 vendors, 60+ integrations) with one platform, deploys an embedded team by default, and self-improves after go-live. Products in the suite: **AI Assistants** (voice/chat/email/SMS), **Expert Assist** (live agent guidance), **Insights** (auto-QA, predictive CSAT, VoC), **Managed AI Services**, **Optima** (deployment/optimization agent), **Connect** (integrations agent), plus **Wisdom** and **Veritas** (Q3 code names).

The bulk of brand strategy, messaging hierarchy, persona matrix, proof points, competitive positioning, vertical messaging, and approved/banned language lives in the **Brand Messaging Bible** (June 2026, canonical). This README captures the visual + content fundamentals the design compiler needs; consult the Bible for copy strategy.

### Sources provided
- **Logos:** `Black-Logo.png`, `White-Logo.png` (wordmark), `Black (1).png`, `White (1).png` (the stylized-S mark) — copied into `assets/logos/`.
- **Fonts:** `Sora-VariableFont_wght.ttf`, `Unbounded-VariableFont_wght.ttf` (+ `.zip` static sets) — copied into `assets/fonts/`.
- **Typography reference:** brand.crescendo.ai/typography (exact typeface spec lives there; this system uses the provided Unbounded + Sora files).
- **Brand Messaging Bible** — June 2026, pasted in full at project creation.

---

## CONTENT FUNDAMENTALS

How Crescendo writes. The work speaks louder than the copy — calm, never shouty.

- **Voice = quiet confidence.** The tone of a strong operator who always knows what's happening and makes hard things look effortless. Three personality words: **Visionary · Seasoned · Accountable.**
- **Short, declarative sentences.** Say the thing. "One platform. Your entire CX operation. Live in 30 days." Not: "Crescendo's revolutionary AI platform transforms experiences through omnichannel automation."
- **Specific over vague.** "4 weeks" not "fast." "30 minutes" not "quick." "100% of conversations" not "all interactions."
- **Claim, then back it.** Every big statement earns a nearby proof point. Don't make a claim you can't immediately substantiate.
- **No hedge words.** Never "we believe / we think" — make the claim directly. Active voice, present tense: the product *resolves, remembers, improves, deploys*.
- **"You" own the relationship; "we" own the deployment and the outcome.** Address the buyer as "you." Crescendo is "we."
- **No emoji.** Not part of the brand. Iconography is minimal and geometric (see Iconography).
- **Casing:** Display/hero headlines are ALL CAPS (Unbounded). Section headings are bold, mixed or upper case. Labels/tags are ALL CAPS with wide tracking. Body is sentence case.

**Approved language (use):** AI-native · self-improving · forward-deployed · calibrate/calibration · resolution · full-stack CX · CXM · MCP-native · one platform, one contract, one team · live in 4 weeks · time to value · rebuilt from scratch · escalation by design · live resolution specialists · deploy/deployment · production-grade.

**Banned → use instead:** agentic → self-improving · omnichannel → name the channels · revolutionary/transformative/game-changing → make the specific claim · chatbot → AI assistant · workflow → (avoid; signals old architecture) · onboarding → deployment · reps/support reps → live resolution specialists · "hand off to a human" → escalation by design · all-in-one/unified platform → AI-native CXM.

**Approved one-liners (verbatim):** "Own the customer experience. Not the overhead." · "We didn't upgrade CX. We rebuilt it." · "Turn customer experience into a growth driver — not a cost center to minimize." · "Shop. Buy. Love. Repeat." (retail) · "One System. Smarter CX." (asset footer) · "Made for you. Built to perform." (product footer).

---

## VISUAL FOUNDATIONS

Reference energy: **Linear · Ramp · Notion Enterprise · Figma** — operational calm, not flashy. Confident, not loud.

### Color
Seven-token palette, used strictly (`tokens/colors.css`). Never invent colors.
- **Brand Black `#141413`** — dark headers, backgrounds, primary text on light.
- **Lime Green `#C8F135`** — the signature accent. Hero headlines on dark, footer bands, accent backgrounds. The single most recognizable Crescendo element.
- **White `#FFFFFF`** — cards, pages, text on dark.
- **Off-White `#F7F6F3`** — body section backgrounds, secondary surfaces.
- **Body Text `#3D3D3A`** — body copy on light.
- **Blue Accent `#4361EE`** — icon backgrounds and technical/comparison contexts ONLY. Not a primary brand color.
- **Medium Gray `#8C8B87`** — captions, secondary labels, footer text on white.

**The hero signature:** Brand Black background + Lime Green display headline. This is the primary Crescendo expression — use it. The lime footer band is the closing mark on product/vertical assets.

### Type
> **Note (from real produced decks):** the messaging bible's written spec says "heavy condensed UPPERCASE," but the *actual produced assets* use **mixed-case Unbounded** for section headlines — not condensed, not all-caps. Trust the assets. Examples: "Where Typical AI Deployments Fail", "End-to-end intelligence". UPPERCASE is reserved for (a) full-bleed dark title/hero headlines and (b) **emphasis words inside a mixed-case line** — often pairing a lighter weight with a heavy weight: "This changes **EVERYTHING.**"
- **Display / hero:** **Unbounded.** Mixed case for section headers (weight 600–700); UPPERCASE 800 for hero/title moments. Tracking −0.02em, line-height ~0.98, stacked lines. Mixing regular + heavy weight in one headline is a signature move.
- **Headings & body:** **Sora.** Sub-headings 600–700 bold; body 400 at 14–16px, line-height 1.5–1.6.
- **Labels / vertical tags:** Sora 600, ALL CAPS, 0.08em tracking, medium gray. E.g. "RETAIL + ECOMMERCE".
- Mono (`ui-monospace` stack) for URLs, data, and technical readouts.

### The slide footer device (canonical)
Every content slide closes with a footer bar: **CRESCENDO wordmark, left** + the **mark inside a black rounded square, far right**. Two variants: a **white footer with a top hairline**, or a **lime band** (`#C8F135`). The black-square mark bottom-right is the most consistent signature element across the real decks — keep it. Content slides also place the black-square mark **top-left** as a header device.

### Backgrounds, surfaces & cards
> **Note (reconciled with real decks):** the bible says "never gradients / never glow." In practice the produced decks **do** use restrained gradients and soft glows — but ONLY as *diagram / feature-panel backgrounds*, never behind body copy or on content cards. Allowed in that context: a soft **periwinkle→white radial** (`#E4E7FF`-ish), a **grainy lime-green textured swoosh**, and the **concentric orbital glow** (blue→lime) used for the AI-native "embedded" diagram. Keep content surfaces flat.
- **Content surfaces:** flat color only — white, off-white, brand black, lime. No gradient behind text. No glassmorphism on content.
- **Diagram / feature panels:** soft periwinkle-blue radial or grainy lime gradient is on-brand. Split layouts (flat dark text panel ↔ gradient diagram panel) are a common slide structure.
- Cards: white surface, hairline border `#E6E4DF`, small-to-medium radius. Flat by default; subtle shadow only when a card stands alone. Architectural, square-leaning corners — the only full circle is the logo mark.
- Off-white sections separate content areas. Dark sections carry stats and CTAs.

### Spacing, radius, shadow
- 4px base spacing scale (`tokens/spacing.css`): 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128.
- Radius: sm 4 / md 8 / lg 12 / xl 16 / pill. Lean small.
- Shadows are subtle and rare (`--shadow-sm/md/lg`), low-opacity black. Never colored, never glowing.

### Motion & states
- Calm, never bouncy. Standard ease `cubic-bezier(0.2,0,0,1)`, 120–320ms.
- **Hover:** color shift (lime → darker lime `#B4DC23`; dark → `#2A2A28`; ghost → off-white fill). No scale-up.
- **Press:** 1px downward nudge / slightly darker fill. No exaggerated shrink.
- Fades and short slides only. No infinite decorative loops, no glowing pulses.

### Imagery
- Clean system diagrams (nodes + connectors), data viz with whitespace, the **Stack Collapse** diagram (many tools → one platform — use wherever possible), real product UI screenshots, real customer logos in rows.
- **Avoid:** glowing AI brains / neural nets, robots, chatbot speech-bubble gimmicks, cybersecurity-dashboard energy (dark neon, hexagons), legacy SaaS gradients/drop-shadows/call-center stock photos, anything that looks like a 2019 sales deck.

---

## ICONOGRAPHY

- **No built-in icon font shipped with the brand.** The system uses **minimal, consistent-weight geometric icons.** Recommended source: **Lucide** (CDN: `https://unpkg.com/lucide@latest`) — clean 2px stroke, geometric, matches the operational-calm energy. This is a documented substitute pending a brand-specified set; flag to the user if exact icons are required.
- Icons typically sit on a **blue (`#4361EE`) rounded square** background (`IconBadge` component) — blue is the brand's icon-background color. Black or lime squares are alternates. In diagrams, channel icons (mail / phone / chat / voice) also appear as **white glyphs in small black circles** orbiting the mark.
- **Blue is used more than the bible implies:** comparison-table arrows, "AFTER" column headers, and highlighted figures in customer stories are all blue. It stays out of hero headlines, but it's a working accent in tables, diagrams, and emphasis — not strictly "technical only."
- **No emoji.** Specimen cards use simple unicode glyphs (◆ ↻ →) as stand-ins only; in production use Lucide line icons.
- Arrows (→) are the brand's CTA affordance — used inline on buttons and links.
- Logos: always use the lockup files in `assets/logos/`. Never recreate the wordmark. White on dark, black on light. The mark (stylized S in a circle) is for app icons, avatars, and favicons.

---

## INDEX / MANIFEST

**Root**
- `styles.css` — global entry point (consumers link this). `@import`s tokens + fonts only.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `fonts.css` (@font-face), `base.css` (element defaults + helper classes).
- `assets/logos/` — wordmark (black/white) + mark (black/white). `assets/fonts/` — Unbounded + Sora variable TTFs.
- `SKILL.md` — Agent-Skills-compatible entry for use in Claude Code.

**Foundation cards** (`guidelines/*.card.html`) — render in the Design System tab: brand palette, accent & neutrals, hero signature, display type, headings & body, labels, spacing scale, radius & shadow, wordmark, mark.

**Components** (`components/`) — reusable React primitives, bundled to `window.CrescendoDesignSystem_a31e43`:
- `core/` — **Button** (primary/dark/ghost/link), **Tag** (pill label).
- `layout/` — **Card** + **IconBadge**, **Stat** + **StatRow**, **FooterBand**, **SlideFooter** (wordmark + mark-in-black-square).

**Slides** (`slides/`) — 16:9 sample slides modeled on the real Crescendo decks: **title** (dark, regular+heavy lime contrast), **problem** (mixed-case headline, lime-dot bullets), **stats** (dark, lime numbers, lime footer band), **CTA** (lime closing band), **comparison** (before→after table on periwinkle gradient, blue arrows), **customer story** (before/after table + dark testimonial card). All carry the canonical footer device.

### Caveats
- Fonts are the provided Unbounded + Sora files. The Bible references brand.crescendo.ai/typography for the exact spec — confirm these match.
- Icon set (Lucide) is a documented substitute; no brand icon font was provided.
- **Bible vs. produced assets:** the written bible says "condensed UPPERCASE headlines" and "never gradients." The real decks (provided June 6) use **mixed-case Unbounded** and **restrained gradients in diagram panels**. This system follows the produced assets; see the Type and Backgrounds notes above.
