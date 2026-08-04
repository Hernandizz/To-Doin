---
name: Professional Modernist
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#0b1c30'
  on-tertiary-container: '#75859d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  title-md:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max-width: 1280px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is built for high-stakes professional environments—finance, SaaS, and enterprise technology—where clarity, precision, and trust are paramount. The aesthetic is a refined **Modern Corporate** style with a heavy influence from **Minimalism**. 

The UI prioritizes content over decoration, using generous whitespace to reduce cognitive load and a strict grid system to instill a sense of order. The emotional response should be one of "effortless competence": the user feels empowered by a tool that is predictable, fast, and sophisticated. Visual interest is achieved through high-quality typography and subtle tonal layering rather than aggressive colors or shadows.

## Colors

The color strategy uses a deep Slate Primary (`#0F172A`) to establish authority and a vibrant Blue Secondary (`#3B82F6`) for action items and progress indicators. 

- **Primary:** Used for text, iconography, and high-emphasis backgrounds.
- **Secondary:** Reserved for calls to action (CTAs), focus states, and interactive elements.
- **Tertiary:** Used for secondary information, meta-data, and subtle borders.
- **Neutral:** A cool-grey scale used for backgrounds and surface separation to maintain a "clean" and "airy" feeling.

Surface colors should follow a strict hierarchy: the main background is always the lightest neutral, with containers using white (`#FFFFFF`) to create a clear "lift" from the page.

## Typography

This design system utilizes a trio of typefaces to delineate function:
1. **Manrope** for headlines: Provides a modern, geometric, and balanced feel that remains approachable yet professional.
2. **Inter** for body text: Offers exceptional legibility and a systematic, utilitarian appearance ideal for data-dense interfaces.
3. **JetBrains Mono** for labels/data: Adds a technical edge for small metadata, status badges, and code snippets, reinforcing the professional/tech nature of the brand.

Scale is used aggressively to create a clear information hierarchy. Mobile headings are automatically scaled down to ensure they do not break layout on smaller viewports.

## Layout & Spacing

The layout is built on a **12-column fixed grid** for desktop, maxing out at 1280px to ensure line lengths remain readable. On mobile, the system transitions to a **4-column fluid grid**.

Spacing follows a strict **8px base unit**. All padding, margins, and gaps must be multiples of 8.
- **Vertical Rhythm:** Use `stack-lg` for separating major sections, `stack-md` for elements within a card, and `stack-sm` for label-to-input relationships.
- **Responsive Behavior:** At the 768px (Tablet) breakpoint, margins reduce from 40px to 24px. Below 480px (Mobile), margins reduce to 16px and all grid items default to 4-column spans (full width).

## Elevation & Depth

This design system uses **Tonal Layers** supplemented by **Ambient Shadows** to create depth without visual clutter. 

1.  **Level 0 (Base):** Background color (`#F8FAFC`). No shadow.
2.  **Level 1 (Card/Surface):** White background (`#FFFFFF`). A very soft, highly diffused shadow (0px 4px 20px rgba(15, 23, 42, 0.05)) is used to separate the surface from the base.
3.  **Level 2 (Popovers/Modals):** White background. A stronger, more defined shadow (0px 10px 30px rgba(15, 23, 42, 0.1)) to indicate a foreground interrupt.

Borders are used sparingly. For Level 1 surfaces, a subtle 1px border in a slightly darker neutral (`#E2E8F0`) is preferred over a heavy shadow to maintain a clean, architectural look.

## Shapes

The shape language is **Soft (0.25rem)**. This slight rounding takes the "edge" off the professional aesthetic, making the UI feel modern and curated rather than cold and industrial.

- Standard buttons and input fields use a **4px (0.25rem)** radius.
- Cards and larger containers use **8px (0.5rem)** to emphasize their structure.
- Status chips and badges may use a **full pill shape** to distinguish them from interactive buttons.

## Components

- **Buttons:** Primary buttons use the Primary Color (`#0F172A`) with white text. Secondary buttons use a subtle ghost style with a `#E2E8F0` border. Interaction states (hover) should involve a 10% lightening of the background color.
- **Input Fields:** Use a 1px border (`#CBD5E1`). On focus, the border changes to the Secondary Blue (`#3B82F6`) with a 2px outer glow of the same color at 20% opacity.
- **Cards:** White backgrounds with the Level 1 shadow. Headers within cards should have a subtle bottom border (`1px solid #F1F5F9`) to separate title from content.
- **Chips/Badges:** Use the `label-sm` typography. Backgrounds should be very light tints of the status color (e.g., light green for "Success") with high-contrast text.
- **Lists:** Use `body-md` for primary list text and `label-sm` for secondary metadata. Ensure 16px of vertical padding between list items to maintain the "airy" feel.
- **Data Tables:** High-density with 1px horizontal dividers only. Use `jetbrainsMono` for numeric data to ensure alignment.