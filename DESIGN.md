# Design System -- 10K IDEAS

## Product Context
- **What this is:** An open-source venture studio that launches one new project every day
- **Who it's for:** Builders, indie hackers, curious observers who want to watch (or join) a venture studio in public
- **Space/industry:** Venture studios, startup studios, open-source project showcases
- **Project type:** Marketing site / app hybrid -- pipeline kanban showcase with manifesto
- **Reference sites:** hexa.com (editorial warmth), betaworks.com (personality), linear.app (app polish)

## Aesthetic Direction
- **Direction:** Editorial/Magazine meets Industrial
- **Decoration level:** Intentional -- flat stage colors ARE the decoration. No gradients, no blobs, no decorative noise
- **Mood:** A living workshop, not a polished gallery. Bold, ambitious, energetic. Things are being MADE here.

## Typography
- **Display/Hero:** Instrument Serif -- warm, editorial, modern serif. The "10K" logo font. Used for section titles, hero numbers, manifesto headings. Load weight: 400 + italic.
- **Body:** Instrument Sans -- pairs naturally with Instrument Serif, clean geometric sans. Weights: 400, 500, 600, 700.
- **UI/Labels:** Same as body (Instrument Sans) at smaller sizes with weight 600
- **Data/Tables:** Geist Mono -- for index numbers (01, 02...), stats, labels, code references. Supports tabular-nums.
- **Code:** Geist Mono
- **Loading:** Google Fonts CDN: `family=Instrument+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1`
- **Scale:**
  - Display: clamp(80px, 15vw, 200px) -- "10K" hero only
  - H1: clamp(40px, 8vw, 72px) -- section titles (Ideation, Design, etc.)
  - H2: 36px -- manifesto title, featured project
  - H3: 24px / weight 600
  - H4: 18px / weight 600
  - Body: 16px / weight 400
  - Small: 14px
  - Label: 12px mono
  - Section label: 11px mono, uppercase, letter-spacing 0.1em

## Color
- **Approach:** Restrained base + expressive stage colors
- **Background (Stone):** #F5F0E8
- **Surface:** #EDEAE2
- **Elevated:** #FFFFFF
- **Ink (Primary text):** #0A0A0A
- **Secondary text:** #5C5C5C
- **Muted text:** #8A8A8A
- **Accent (Electric Blue):** #0066FF -- CTAs, subscribe button, active states, links
- **Accent hover:** #0052CC
- **Border:** rgba(10, 10, 10, 0.08)
- **Border strong:** rgba(10, 10, 10, 0.15)

### Stage Colors (flat solids, no gradients)
| Stage | Color | Hex |
|-------|-------|-----|
| Hero / Launched | Black | #0A0A0A |
| Manifesto | Coral | #E8503A |
| Ideation | Amber | #F5A623 |
| Design | Pink | #E84393 |
| Development | Blue | #0066FF |
| Testing | Green | #00B341 |
| GTM | Violet | #8B5CF6 |

### Semantic Colors
- **Success:** #00C853
- **Warning:** #FF9100
- **Error:** #EF4444
- **Info:** #0077B6

### Dark Mode
- Background: #0A0A0A
- Surface: #141414
- Elevated: #1E1E1E
- Primary text: #E8E8E8
- Secondary text: #999999
- Muted text: #666666
- Accent: #4D94FF (lighter blue for dark bg contrast)
- Border: rgba(255, 255, 255, 0.08)

## Spacing
- **Base unit:** 8px
- **Density:** Comfortable
- **Scale:**

| Token | Value |
|-------|-------|
| 2xs | 2px |
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |
| 3xl | 64px |

## Layout
- **Approach:** Hybrid -- pipeline kanban as core interaction, editorial for manifesto/hero
- **Grid:** Sidebar (160px fixed) + fluid content area
- **Max content width:** 1200px
- **Border radius:**

| Token | Value | Usage |
|-------|-------|-------|
| sm | 4px | Small elements, badges |
| md | 8px | Buttons, inputs, cards (back face) |
| lg | 12px | Nav items, project cards, panels |
| xl | 20px | Section panels, pipeline headers |
| full | 9999px | Pills, subscribe input, circular elements |

## Motion
- **Approach:** Intentional
- **Easing:** enter(ease-out: cubic-bezier(0.16, 1, 0.3, 1)) exit(ease-in: cubic-bezier(0.7, 0, 0.84, 0)) move(ease-in-out)
- **Duration:** micro(80ms) short(200ms) medium(350ms) long(600ms)
- **Card flip:** 600ms cubic-bezier(0.4, 0, 0.2, 1) -- keep as-is
- **Hover scale:** 1.03 on project cards
- **Always respect:** `prefers-reduced-motion: reduce`

## Implementation Rules
- **ONE styling system:** Use CSS custom properties for design tokens. Inline styles for dynamic values only (e.g., isMobile conditionals). Tailwind for utility classes where available.
- **No gradients on stage elements.** Flat solid colors only.
- **No emojis.** Use SVG icons or text.
- **All interactive elements** must have focus-visible states, min 44px touch targets, and ARIA labels.
- **Delete dead boilerplate components** from ShipFast that are not used.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-26 | Initial design system created | Created by /design-consultation. Researched Hexa, Betaworks, Expa, Linear. |
| 2026-03-26 | Electric blue accent (#0066FF) | Clean, confident, high contrast on warm stone. Replaces neon green. |
| 2026-03-26 | Flat solid stage colors | User preference -- no gradients. Bold flat colors give each stage identity without visual noise. |
| 2026-03-26 | Instrument Serif + Sans | Editorial credibility for display, clean geometric for body. Paired family ensures harmony. |
| 2026-03-26 | Development stage uses blue (#0066FF) | Avoids blue-to-purple AI slop gradient. Matches accent color for brand cohesion. |
