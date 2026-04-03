# Design System Document: The Ethereal Workstation

## 1. Overview & Creative North Star

**Creative North Star: The Digital Curator**
This design system is not a utility; it is a sanctuary for creativity. Inspired by the precision of high-end hardware and the clarity of editorial print, "The Digital Curator" moves away from the cluttered "dashboard" aesthetic. Instead, it embraces **Soft Minimalism**—a philosophy where the UI recedes to allow the user’s creative output to lead.

The system breaks the "template" look through **intentional asymmetry** and **tonal depth**. By utilizing expansive white space and high-contrast typography scales (Manrope for expression, Inter for utility), we create an environment that feels expensive, intentional, and infinitely capable. Layouts should favor breathable, overlapping elements rather than rigid, boxed-in grids.

---

## 2. Colors

The palette is rooted in a spectrum of sophisticated neutrals, punctuated by "Magic" accents that signify AI intelligence.

### Surface Hierarchy & Nesting
To achieve a premium feel, we abandon traditional borders in favor of **Tonal Layering**. 
- **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. Define boundaries through background shifts.
- **Nesting Strategy:** Use the `surface-container` tiers to create physical layers. 
    - Base application: `surface` (#f9f9fe).
    - Primary work areas: `surface-container-low` (#f2f3fa).
    - Contextual popovers/cards: `surface-container-lowest` (#ffffff) to create a natural "lift."

### The Glass & Gradient Rule
Floating interface elements (like the central input bar) must utilize **Glassmorphism**. Use `surface-container-lowest` at 80% opacity with a `20px` backdrop-blur. 

### Signature Textures
Main CTAs and "Magic" moments should use subtle gradients:
- **Primary Action:** Linear gradient from `primary` (#005bc1) to `primary_dim` (#004faa) at 135°.
- **AI Moments:** Transitions between `primary` and `tertiary` (#8e2fbd) to signify generative processes.

---

## 3. Typography

The system employs a dual-typeface strategy to balance editorial authority with functional clarity.

*   **Display & Headlines (Manrope):** Chosen for its geometric modernism. Use `display-lg` and `headline-md` with tight letter-spacing (-0.02em) to create an authoritative, "high-fashion" tech aesthetic.
*   **Body & Labels (Inter):** The workhorse. Inter provides maximum legibility for complex AI prompts and configuration settings.

**Scale Highlights:**
- **Display-LG (3.5rem):** For hero moments and empty states.
- **Title-MD (1.125rem):** For card headers and primary navigation.
- **Label-SM (0.6875rem):** For metadata and secondary configuration tags.

---

## 4. Elevation & Depth

We convey hierarchy through **Tonal Layering** and light physics, not structural lines.

- **The Layering Principle:** Depth is achieved by stacking. A `surface-container-highest` element should only exist on a `surface-container` background to maintain a logical progression of "nearness" to the user.
- **Ambient Shadows:** For floating popovers or the primary input bar, use a dual-layer shadow:
    - Shadow 1: `0px 4px 20px rgba(44, 51, 61, 0.04)` (The soft wash)
    - Shadow 2: `0px 12px 40px rgba(44, 51, 61, 0.08)` (The directional lift)
- **The "Ghost Border":** If accessibility requires a container edge, use `outline-variant` (#acb2bf) at **15% opacity**. It should be felt, not seen.
- **Roundedness:** Follow the Apple-style squircle.
    - **Cards/Popovers:** `xl` (1.5rem)
    - **Buttons/Inputs:** `md` (0.75rem)
    - **Chips:** `full` (9999px)

---

## 5. Components

### The Floating Input Bar (Signature Component)
The centerpiece of the workstation. It uses `surface-container-lowest` with an 80% glassmorphism blur. 
- **Internal Spacing:** Use `spacing-3` (1rem) for padding.
- **Action Group:** Integrated configuration popovers sit directly above the bar, appearing to emerge from the input itself.

### Buttons & Chips
- **Primary Button:** High-gloss. Background: `primary`. Text: `on_primary`. Shape: `md`.
- **Secondary/Ghost Button:** No background. Use `primary` text for actions or `on_surface_variant` for utility.
- **Interactive Chips:** Use `surface-container-high` for inactive states and `secondary_container` with `on_secondary_container` text for active selections.

### Media Cards & Waterfall Grids
- **Style:** Forbid dividers. Use `spacing-6` (2rem) of vertical white space to separate content blocks.
- **Image Treatment:** Media should use `rounded-lg` (1rem) and sit flush against the card edges if within a container.

### Sophisticated Popovers
Popovers must feel like "frosted sheets." Use `surface-container-lowest` with a `24px` backdrop blur. When an item is selected (e.g., an AI model), use a subtle `primary_container` (#d8e2ff) background and a `check` icon in the `primary` color.

---

## 6. Do's and Don'ts

### Do
- **DO** use asymmetry. Place a small `label-sm` metadata tag far-right against a large `headline-md` title to create visual tension.
- **DO** lean into "Super-Ellipses." Every corner should feel soft and intentional (Squircle).
- **DO** use `surface-dim` for subtle background transitions in the sidebar to distinguish it from the main canvas.

### Don't
- **DON'T** use 100% black. Use `on_background` (#2c333d) for text to maintain a softer, premium contrast.
- **DON'T** use 1px solid borders to separate list items. Use white space (`spacing-2`) or a 1-step shift in `surface-container` color.
- **DON'T** use standard drop shadows. If it looks like a default CSS shadow, it’s too heavy. It must look like ambient light hitting a physical surface.