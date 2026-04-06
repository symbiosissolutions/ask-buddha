# Ask Buddha — Design System

**Version:** 1.1
**Audience:** Contributors and vibe coders
**Target Users:** Children aged 10–13
**Last Updated:** 2026

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing and Layout](#spacing-and-layout)
5. [Button System](#button-system)
6. [Chat Components](#chat-components)
7. [Input Bar](#input-bar)
8. [Avatar Component](#avatar-component)
9. [Decorative Elements](#decorative-elements)
10. [Navigation Header](#navigation-header)
11. [Animation Tokens](#animation-tokens)
12. [Responsive Breakpoints](#responsive-breakpoints)
13. [Accessibility](#accessibility)
14. [Component Quick Reference](#component-quick-reference)
15. [Content Guidelines](#content-guidelines)

---

## Design Philosophy

**Theme: Peaceful Adventure**

The visual identity of Ask Buddha is rooted in the atmosphere of a warm, ancient temple — dark wood tones, soft golden light, and calm spatial depth. The experience should feel safe, magical, and wise without ever feeling academic or intimidating.

**Core Design Principles**

1. **Warm and Magical** — Golden tones, glowing effects, and temple-inspired aesthetics create an immersive sense of place.
2. **Kid-Safe Calm** — The interface is never stressful or chaotic. It should feel like a comfortable, cozy space to explore ideas.
3. **Big and Touchable** — All interactive elements are sized for easy tapping on touch screens with small or growing hands.
4. **Playfully Serious** — Animated and expressive, while remaining respectful of the subject matter.
5. **Readable at a Glance** — Short line lengths, generous font sizes, and clear visual hierarchy support young readers.

**Design Rule**

> Every element should feel like it belongs inside a golden temple that a curious kid would want to explore.

---

## Color System

All colors are defined as CSS custom properties. Never hardcode hex values in component styles — always reference these tokens.

### CSS Variables

```css
:root {
  /* Backgrounds */
  --color-bg-deep:        #0D0A07;   /* near-black warm void — main page background */
  --color-bg-mid:         #1C1409;   /* dark temple wood — chat window, side panel */
  --color-bg-surface:     #2D2010;   /* card and panel background (lifted for contrast) */
  --color-bg-elevated:    #3C2A15;   /* input fields, hover states (lifted for contrast) */

  /* Gold — Primary Accent */
  --color-gold-bright:    #FFD166;   /* primary accent, CTAs, highlights */
  --color-gold-vivid:     #FFE08A;   /* extra-bright — shimmer highlights, icon buttons */
  --color-gold-soft:      #E8B84B;   /* secondary actions, hover gold */
  --color-gold-dim:       #A07830;   /* borders, dividers */
  --color-gold-glow:      rgba(255, 209, 102, 0.28); /* glow halos, focus rings (lifted from 0.18) */

  /* Text */
  --color-text-primary:   #FFF8E8;   /* headings and main body text */
  --color-text-secondary: #CCA96C;   /* subtext, timestamps, labels */
  --color-text-muted:     #8A6E4A;   /* placeholder text, disabled labels */
  --color-text-inverse:   #0D0A07;   /* text placed on gold backgrounds */

  /* Functional Accents */
  --color-lotus-pink:     #FF8FAB;   /* fun accents, tags */
  --color-sky-blue:       #7EC8E3;   /* links, informational states */
  --color-leaf-green:     #78C47A;   /* success states, online indicator */
  --color-error:          #FF6B6B;   /* error states */

  /* Gradients */
  --gradient-bg:          linear-gradient(160deg, #0D0A07 0%, #1E1306 50%, #100C05 100%);
  --gradient-gold:        linear-gradient(135deg, #FFD166 0%, #E8A020 100%);
  --gradient-gold-vivid:  linear-gradient(135deg, #FFE08A 0%, #F0A820 100%); /* icon buttons, active states */
  --gradient-card:        linear-gradient(145deg, #2D2010 0%, #1C1409 100%);
  --gradient-glow-ring:   radial-gradient(circle, rgba(255,209,102,0.22) 0%, transparent 70%);
}
```

> **v1.1 note:** `--color-bg-surface` and `--color-bg-elevated` were deliberately lifted to create visible contrast against the dark background image overlay. `--color-gold-glow` opacity was raised from 0.18 → 0.28 for more perceptible glow effects. `--color-gold-vivid` and `--gradient-gold-vivid` were added for elements that need extra brightness (icon buttons, active chips, shimmer).


### Color Usage Reference

| Element | Token |
|---|---|
| Page background | `--color-bg-deep` + background image at 68–80% opacity overlay |
| Chat window / side panel | `--color-bg-mid` |
| Buddha message bubble | `--gradient-card` with left `3px solid --color-gold-bright` border |
| User message bubble | `--gradient-gold-vivid` |
| Primary button | `--gradient-gold-vivid` |
| Icon button (send) | `--gradient-gold-vivid` + living glow pulse animation |
| Active chip / text size | `--gradient-gold-vivid` |
| Disabled button | `--color-bg-elevated` background + `--color-text-muted` text |
| Input field | `--color-bg-elevated` |
| Borders and dividers | `--color-gold-dim` at 40–45% opacity |
| Navbar title | Gold shimmer text gradient using `--color-gold-vivid` |

---

## Typography

### Font Stack

```css
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Nunito:wght@400;600;700;800&display=swap');

:root {
  --font-display:  'Cinzel', Georgia, serif;
  --font-body:     'Nunito', 'Comic Sans MS', cursive;
}
```

**Rationale:**

- **Cinzel** — Evokes carved stone and ancient inscription. Used for headings and the app title. Feels significant without being threatening.
- **Nunito** — Rounded, approachable, and highly legible for young readers. Widely adopted in educational and kid-facing interfaces.

### Type Scale

```css
:root {
  --text-xs:    12px;   /* timestamps, metadata */
  --text-sm:    14px;   /* secondary labels */
  --text-base:  16px;   /* body copy and chat messages — minimum for children */
  --text-md:    18px;   /* input placeholder, nav items */
  --text-lg:    22px;   /* section labels */
  --text-xl:    28px;   /* page subtitles */
  --text-2xl:   36px;   /* app title */
  --text-3xl:   48px;   /* hero header */

  --leading-tight:  1.2;
  --leading-normal: 1.6;   /* standard body text */
  --leading-loose:  1.9;   /* long answers from Buddha */

  --tracking-wide:  0.06em;
  --tracking-wider: 0.12em;
}
```

### Typography Rules

- **Minimum font size:** 16px for all readable content. Never go below 12px for any visible text.
- **Line height:** Always at least `1.6` for body and chat text.
- **Max line width:** 65 characters (`max-width: 600px` on chat bubbles).
- **Avoid all-caps** for long text. Acceptable only for short labels or button text (maximum 3 words).
- **Use bold** inside Buddha answers to highlight key concepts and support scanning.

---

## Spacing and Layout

### Spacing Scale

```css
:root {
  --space-1:   4px;
  --space-2:   8px;
  --space-3:   12px;
  --space-4:   16px;
  --space-5:   20px;
  --space-6:   24px;
  --space-8:   32px;
  --space-10:  40px;
  --space-12:  48px;
  --space-16:  64px;
  --space-20:  80px;
}
```

### Application Layout

```
+----------------------------------------------+
|               HEADER / NAV                   |  height: 64px (mobile) / 72px (desktop)
+----------------------------------------------+
|                                              |
|          BUDDHA AVATAR + TITLE               |  centered hero block (start screen only)
|                                              |
+----------------------------------------------+
|                                              |
|   +--------------------------------------+   |
|   |                                      |   |
|   |          CHAT MESSAGES               |   |  scrollable, flex column
|   |                                      |   |
|   +--------------------------------------+   |
|                                              |
+----------------------------------------------+
|          INPUT BAR (sticky bottom)           |  height: 72px
+----------------------------------------------+
```

### Container Widths

```css
:root {
  --container-max:      760px;   /* chat area maximum width */
  --container-sm:       480px;   /* narrow content sections */
  --sidebar-width:      280px;   /* sidebar, if used */

  --border-radius-sm:   8px;
  --border-radius-md:   16px;
  --border-radius-lg:   24px;
  --border-radius-xl:   32px;
  --border-radius-pill: 999px;
}
```

---

## Button System

### Size Reference

| Size | Use Case | Height | Padding | Font Size | Border Radius |
|---|---|---|---|---|---|
| `sm` | Tags, chips | 32px | `6px 14px` | 13px | `--border-radius-pill` |
| `md` | Secondary actions | 44px | `10px 24px` | 15px | `--border-radius-pill` |
| `lg` | Primary CTA (default) | 52px | `14px 32px` | 17px | `--border-radius-pill` |
| `xl` | Hero or start screen CTA | 64px | `18px 48px` | 20px | `--border-radius-pill` |

**Rule:** All interactive elements must be at least **44px tall**. Small tap targets are a usability failure for this age group.

---

### Variant: Primary Button

Used for the main call-to-action — sending a message, starting a conversation.

```css
.btn-primary {
  background: var(--gradient-gold);
  color: var(--color-text-inverse);
  font-family: var(--font-body);
  font-weight: 800;
  font-size: var(--text-md);               /* 18px */
  height: 52px;
  padding: 0 32px;
  border: none;
  border-radius: var(--border-radius-pill);
  cursor: pointer;
  letter-spacing: 0.03em;
  box-shadow: 0 4px 20px rgba(255, 209, 102, 0.35),
              0 2px 8px rgba(0,0,0,0.4);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.btn-primary:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 30px rgba(255, 209, 102, 0.5),
              0 4px 12px rgba(0,0,0,0.5);
}

.btn-primary:active {
  transform: translateY(0px) scale(0.98);
  box-shadow: 0 2px 10px rgba(255, 209, 102, 0.3);
}

.btn-primary:disabled {
  background: var(--color-bg-elevated);
  color: var(--color-text-muted);
  box-shadow: none;
  cursor: not-allowed;
  transform: none;
}
```

---

### Variant: Secondary Button

Used for lower-priority actions such as clearing chat or navigating back.

```css
.btn-secondary {
  background: transparent;
  color: var(--color-gold-bright);
  font-family: var(--font-body);
  font-weight: 700;
  font-size: var(--text-base);             /* 16px */
  height: 44px;
  padding: 0 24px;
  border: 2px solid var(--color-gold-dim);
  border-radius: var(--border-radius-pill);
  cursor: pointer;
  transition: border-color 0.2s ease,
              background 0.2s ease,
              transform 0.15s ease;
}

.btn-secondary:hover {
  border-color: var(--color-gold-bright);
  background: var(--color-gold-glow);
  transform: translateY(-1px);
}

.btn-secondary:active {
  transform: translateY(0px);
  background: rgba(255, 209, 102, 0.12);
}

.btn-secondary:disabled {
  border-color: var(--color-bg-elevated);
  color: var(--color-text-muted);
  cursor: not-allowed;
  transform: none;
}
```

---

### Variant: Icon Button

Used for the send button in the input bar. Circular, gold, and prominent.

```css
.btn-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--gradient-gold);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(255, 209, 102, 0.4);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  flex-shrink: 0;
}

.btn-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 24px rgba(255, 209, 102, 0.6);
}

.btn-icon:active {
  transform: scale(0.96);
  box-shadow: 0 2px 10px rgba(255, 209, 102, 0.3);
}

/* Content inside icon button (SVG or text glyph) */
.btn-icon > * {
  width: 20px;
  height: 20px;
  color: var(--color-text-inverse);
}
```

---

### Variant: Ghost Button

Used for low-emphasis inline actions — "See more", "Learn more".

```css
.btn-ghost {
  background: none;
  border: none;
  color: var(--color-gold-soft);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 600;
  padding: 8px 12px;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.15s ease;
  min-height: 44px;
}

.btn-ghost:hover {
  color: var(--color-gold-bright);
}
```

---

### Variant: Prompt Chip

Used for suggested questions displayed below the chat area.

```css
.chip {
  background: var(--color-bg-elevated);
  color: var(--color-text-secondary);
  border: 1.5px solid rgba(160, 120, 48, 0.35);
  font-family: var(--font-body);
  font-size: var(--text-sm);               /* 14px */
  font-weight: 600;
  height: 40px;
  padding: 0 18px;
  border-radius: var(--border-radius-pill);
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.15s ease,
              color 0.15s ease,
              background 0.15s ease;
}

.chip:hover {
  border-color: var(--color-gold-soft);
  color: var(--color-gold-bright);
  background: rgba(255, 209, 102, 0.06);
}

.chip:active {
  background: rgba(255, 209, 102, 0.12);
}
```

---

## Chat Components

### Buddha Message Bubble

Left-aligned. Uses a gold left border to establish Buddha's identity as the speaker.

```css
.bubble-buddha {
  background: var(--color-bg-surface);
  border: 1px solid rgba(160, 120, 48, 0.25);
  border-left: 3px solid var(--color-gold-bright);
  border-radius: 4px var(--border-radius-lg) var(--border-radius-lg) var(--border-radius-lg);
  padding: var(--space-4) var(--space-5);
  max-width: 80%;
  align-self: flex-start;
  color: var(--color-text-primary);
  font-family: var(--font-body);
  font-size: var(--text-base);             /* 16px */
  font-weight: 400;
  line-height: var(--leading-loose);
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}
```

### User Message Bubble

Right-aligned. Gold gradient background to visually differentiate from Buddha.

```css
.bubble-user {
  background: var(--gradient-gold);
  border-radius: var(--border-radius-lg) var(--border-radius-lg) 4px var(--border-radius-lg);
  padding: var(--space-4) var(--space-5);
  max-width: 75%;
  align-self: flex-end;
  color: var(--color-text-inverse);
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 600;
  line-height: var(--leading-normal);
  box-shadow: 0 4px 16px rgba(255, 209, 102, 0.25);
}
```

### Typing Indicator

Shown while the API is processing. Three animated dots indicate Buddha is composing a response.

```css
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: var(--space-4) var(--space-5);
  background: var(--color-bg-surface);
  border-radius: 4px var(--border-radius-lg) var(--border-radius-lg) var(--border-radius-lg);
  border-left: 3px solid var(--color-gold-bright);
  width: fit-content;
}

.typing-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-gold-soft);
  animation: bounce 1.2s infinite ease-in-out;
}

.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
  30%           { transform: translateY(-8px); opacity: 1; }
}
```

### Bubble Entrance Animation

```css
@keyframes bubble-in {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.bubble-buddha,
.bubble-user {
  animation: bubble-in var(--duration-slow) var(--ease-bounce) both;
}
```

---

## Input Bar

The input bar is sticky at the bottom of the viewport. It contains the text field and the send button.

```css
.input-bar {
  position: sticky;
  bottom: 0;
  width: 100%;
  background: linear-gradient(to top, var(--color-bg-mid) 80%, transparent);
  padding: var(--space-4) var(--space-5) var(--space-6);
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.input-field {
  flex: 1;
  height: 52px;
  background: var(--color-bg-elevated);
  border: 1.5px solid rgba(160, 120, 48, 0.35);
  border-radius: var(--border-radius-pill);
  padding: 0 var(--space-6);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  font-size: var(--text-md);               /* 18px — comfortable for young readers */
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input-field::placeholder {
  color: var(--color-text-muted);
  font-style: italic;
}

.input-field:focus {
  border-color: var(--color-gold-bright);
  box-shadow: 0 0 0 3px var(--color-gold-glow);
}
```

**Layout:** `[text input (flex: 1)] [gap: 12px] [send button (48x48px)]`

---

## Avatar Component

### Large Avatar (start screen / hero)

```css
.buddha-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid var(--color-gold-bright);
  box-shadow: 0 0 0 6px var(--color-gold-glow),
              0 0 40px rgba(255, 209, 102, 0.3),
              0 8px 32px rgba(0,0,0,0.6);
  object-fit: cover;
  display: block;
}
```

### Breathing Glow Animation

Applied to the large avatar. Slow and calming — mimics breathing, reinforces the serene persona.

```css
.buddha-avatar-glow {
  animation: breathe 4s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% {
    box-shadow: 0 0 0 6px rgba(255,209,102,0.12),
                0 0 40px rgba(255,209,102,0.2);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(255,209,102,0.2),
                0 0 60px rgba(255,209,102,0.4);
  }
}
```

### Small In-Chat Avatar

Placed beside Buddha's message bubbles.

```
Width:         36px
Height:        36px
Border-radius: 50%
Border:        2px solid var(--color-gold-dim)
Margin right:  8px from bubble edge
```

---

## Decorative Elements

### Horizontal Divider

Used to separate conversation sections or mark the start of a new session.

```css
.divider {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  color: var(--color-gold-dim);
  font-family: var(--font-display);
  font-size: 12px;
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  opacity: 0.5;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    var(--color-gold-dim),
    transparent
  );
}
```

### Floating Particles (Background Ambiance)

8 to 12 small golden dots that float upward, simulating incense smoke. Keep them very subtle — they make the background feel alive without drawing attention away from content.

```css
.particle {
  position: fixed;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--color-gold-bright);
  animation: float-up linear infinite;
  pointer-events: none;
  z-index: 0;
}

@keyframes float-up {
  0%   { transform: translateY(0) scale(1); opacity: 0; }
  20%  { opacity: 0.15; }
  80%  { opacity: 0.1; }
  100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
}
```

Set `animation-duration` between `8s` and `20s` per particle, and randomize `left` positions across the viewport width.

---

## Navigation Header

```
Height:          64px (mobile), 72px (desktop)
Background:      --color-bg-mid at 80% opacity
Backdrop filter: blur(12px)
Border bottom:   1px solid rgba(160, 120, 48, 0.2)
Position:        sticky, top: 0, z-index: 100

Left side:       App name in Cinzel Bold at 20px, color --color-gold-bright
Right side:      Clear chat button (ghost variant, sm size)
```

---

## Animation Tokens

```css
:root {
  --ease-bounce:   cubic-bezier(0.34, 1.56, 0.64, 1);  /* button press and bubble pop */
  --ease-smooth:   cubic-bezier(0.4, 0, 0.2, 1);        /* general transitions */
  --ease-in-soft:  cubic-bezier(0.4, 0, 1, 1);          /* exit animations */

  --duration-fast:    120ms;    /* micro-interactions */
  --duration-normal:  220ms;    /* hover and focus states */
  --duration-slow:    400ms;    /* bubble entrance, page transitions */
  --duration-breathe: 3500ms;   /* avatar glow pulse, icon button glow */
  --duration-shimmer: 5s;       /* navbar title gold sweep */
}
```

### Named Animations

| Name | Target | Description |
|---|---|---|
| `screen-fade-in` | `.screen:not(.loading)` | Page fades up 6px on first render |
| `gold-shimmer` | `.navbar-title` | Slow left→right gold highlight sweep across the app name |
| `avatar-breathe` | `.bubble-assistant .bubble-avatar` | Lotus icon pulses a gold halo every 3.5 s |
| `icon-glow-pulse` | `.btn-icon:not(:disabled)` | Send button shadow breathes gold; stops on hover |
| `focus-pulse` | `.input-field:focus` | Focus ring gently expands and contracts while typing |
| `bubble-in` | `.bubble` | New bubbles slide up 14 px and scale from 0.95 on arrival |
| `typing-bounce` | `.typing-dot` | Sequenced dot bounce with scale for the thinking indicator |

### Background Image Overlay Rule

The temple background image must always be visible. The dark gradient overlay should sit between **68 %** (top-left) and **80 %** (bottom) opacity. Going darker than 80 % buries the image and makes the interface feel flat.

```css
/* Correct overlay — lets the temple breathe */
background-image:
  linear-gradient(
    160deg,
    rgba(13, 10, 7, 0.68) 0%,
    rgba(26, 15, 5, 0.72) 50%,
    rgba(16, 12, 5, 0.80) 100%
  ),
  url('./assets/ask-buddha-bg-min.jpg');
```

### Reduced Motion

All animations must respect the user's system preference.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Responsive Breakpoints

The design is mobile-first. Base styles target the smallest screens (320px and up).

```css
/* Base: 320px–479px — single column, full-width layout */

@media (min-width: 480px) {
  /* Small phones landscape and large phones */
  /* Chat bubbles: max-width 80% */
}

@media (min-width: 768px) {
  /* Tablets */
  /* Center chat container, max-width: 700px */
  /* Increase avatar size to 140px */
}

@media (min-width: 1024px) {
  /* Desktop */
  /* Optional sidebar layout */
  /* Chat area max-width: 760px */
  /* Expanded hero section */
}
```

**Mobile-specific adjustments:**
- Chat bubbles: `max-width: 88%` to make use of narrower screens
- Suggested chips: horizontal scroll strip rather than wrapping grid
- Send button: fixed to right side, minimum 48x48px
- Header: simplified — app name only, with a compact ghost button for clear chat

---

## Accessibility

All interactive elements must be accessible to keyboard and screen reader users.

**Focus Styles**

```css
:focus-visible {
  outline: 3px solid var(--color-gold-bright);
  outline-offset: 3px;
}
```

**Requirements**

- **Touch targets:** Minimum 44x44px for all tappable elements (WCAG 2.5.5).
- **Color contrast:** Minimum 4.5:1 for body text, 3:1 for large text (WCAG AA).
- **Font scaling:** Use `rem` units for all font sizes to respect browser zoom settings.
- **Chat region:** Wrap the message list in `role="log"` with `aria-live="polite"` so screen readers announce new messages.
- **Input labeling:** The chat input must have a visible `label` or an `aria-label` attribute.
- **Error language:** Keep error messages friendly and plain — no technical jargon. Example: *"Something went wrong. Please try again."*
- **Loading states:** Never show a blank screen during loading. Always display the typing indicator or a skeleton state.
- **Color as information:** Color must never be the sole indicator of state. Pair it with a text label, shape, or border change.

---

## Component Quick Reference

| Component | Font | Size | Color | Border Radius |
|---|---|---|---|---|
| App Title | Cinzel Bold 700 | 36px | `--color-gold-bright` | — |
| Subtitle | Nunito 400 | 16px | `--color-text-secondary` | — |
| Buddha Bubble | Nunito 400 | 16px | `--color-text-primary` | `4px 24px 24px 24px` |
| User Bubble | Nunito 600 | 16px | `--color-text-inverse` on gold | `24px 24px 4px 24px` |
| Primary Button | Nunito 800 | 18px | `--color-text-inverse` on gold gradient | pill |
| Secondary Button | Nunito 700 | 16px | `--color-gold-bright` | pill |
| Icon Button | — | 48x48px | gold gradient background | 50% circle |
| Ghost Button | Nunito 600 | 14px | `--color-gold-soft` | pill |
| Prompt Chip | Nunito 600 | 14px | `--color-text-secondary` | pill |
| Input Field | Nunito 400 | 18px | `--color-text-primary` | pill |
| Timestamp | Nunito 400 | 12px | `--color-text-muted` | — |

---

## Content Guidelines

These guidelines apply to UI copy written by contributors and to AI-generated responses from Buddha.

**Message Structure**

- Keep Buddha's responses in short paragraphs — maximum 3 to 4 sentences per paragraph.
- Use bold text to highlight key concepts and support scanning.
- Never use dark imagery, violence, or adult concepts.

**Language Register**

- Write at a Grade 5 to 7 reading level — conversational but not condescending.
- Suggested question prompts should feel natural and curious, not academic. Example: *"Why do we feel sad?"* rather than *"Explain the nature of suffering."*
- Error and loading messages should be warm and patient. Example: *"Something went wrong. Please try again."*
- Celebrate curiosity with affirming openers where appropriate.

**What to Avoid**

- Technical jargon in UI copy or error messages
- All-caps text in messages
- Urgent or alarming language
- Concepts or imagery that are not age-appropriate for users aged 10 to 13

---

*Ask Buddha Design System v1.0 — Open Source*
