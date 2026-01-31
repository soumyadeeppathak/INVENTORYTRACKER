# Frontend Specification: InventoryTracker MVP

> Design system and user experience specification for implementation

**Date**: 2026-01-31
**Phase**: Design
**Status**: Complete
**Spec Reference**: `.waypoint/specs/mvp.md`
**Architecture Reference**: `.waypoint/plans/mvp.md`

---

## Experience Principles

These principles guide every design decision. When in doubt, return to these.

### 1. Instant Clarity

> Users should understand their inventory state at a glance.

**Implications**:
- Visual hierarchy prioritizes counts and locations
- Emoji for quick visual scanning (groups, locations)
- No hidden information - everything important is visible
- Search is always accessible

**Test**: Can a user answer "Where is my X?" in under 5 seconds?

### 2. Effortless Speed

> Every interaction should feel instant and frictionless.

**Implications**:
- Add item in < 3 taps
- No unnecessary confirmation dialogs
- Optimistic UI updates
- Recent items for quick re-entry

**Test**: Can a user add 3 items in under 30 seconds?

### 3. Calm Confidence

> The app should reduce anxiety, not create it.

**Implications**:
- Friendly, conversational tone
- No aggressive notifications or alerts
- Empty states are encouraging, not alarming
- Errors are helpful, not scary

**Test**: Does using the app make users feel more in control?

### 4. Shared Simplicity

> Sharing should feel natural, not technical.

**Implications**:
- Invite flow is email-based, familiar
- All members see the same data
- No complex permissions UI
- Group identity through emoji/names

**Test**: Can someone explain the sharing model in one sentence?

---

## Visual Foundation

### Design Philosophy

**Mobile-First PWA**: This app is primarily used on mobile devices. It should feel like a native app, installable on the home screen.

**Warm Utility**: This is a personal, intimate tool - not enterprise software. It should feel like a helpful friend, not a corporate system.

- **Not**: Cold, clinical, dashboard-heavy, desktop-first
- **Yes**: Warm, friendly, card-based, emoji-forward, thumb-reachable

### Color Palette

```
Primary Colors:
├── Background: #FAFAFA (warm white)
├── Surface: #FFFFFF (cards)
├── Primary: #6366F1 (indigo - action, links)
├── Primary Hover: #4F46E5
└── Primary Light: #EEF2FF (subtle backgrounds)

Text Colors:
├── Primary: #1F2937 (almost black - main text)
├── Secondary: #6B7280 (gray - supporting text)
├── Tertiary: #9CA3AF (light gray - hints)
└── Inverse: #FFFFFF (on dark backgrounds)

Semantic Colors:
├── Success: #10B981 (green - confirmations)
├── Warning: #F59E0B (amber - attention)
├── Error: #EF4444 (red - errors)
└── Info: #3B82F6 (blue - informational)

Surface Colors:
├── Card: #FFFFFF
├── Card Hover: #F9FAFB
├── Border: #E5E7EB
└── Divider: #F3F4F6
```

### Typography

```
Font Family: Inter (system fallback: -apple-system, BlinkMacSystemFont, sans-serif)

Type Scale:
├── Display: 32px / 40px line-height / -0.02em tracking / Bold
├── Title 1: 24px / 32px / -0.01em / Semibold
├── Title 2: 20px / 28px / -0.01em / Semibold
├── Title 3: 18px / 24px / normal / Medium
├── Body: 16px / 24px / normal / Regular
├── Body Small: 14px / 20px / normal / Regular
├── Caption: 12px / 16px / 0.01em / Medium
└── Overline: 11px / 16px / 0.05em / Semibold uppercase

Usage:
├── Display: Hero sections, welcome screen
├── Title 1: Page titles
├── Title 2: Section headers, card titles
├── Title 3: Subsection headers
├── Body: Primary content
├── Body Small: Secondary content, descriptions
├── Caption: Labels, metadata
└── Overline: Category labels, status indicators
```

### Spacing System

```
Base unit: 4px

Spacing Scale:
├── xs: 4px   (tight elements)
├── sm: 8px   (related elements)
├── md: 16px  (default padding)
├── lg: 24px  (section separation)
├── xl: 32px  (major sections)
├── 2xl: 48px (page sections)
└── 3xl: 64px (hero spacing)

Component Spacing:
├── Card padding: 16px
├── Card gap: 12px (between cards)
├── List item padding: 12px 16px
├── Button padding: 12px 24px
├── Input padding: 12px 16px
└── Icon padding: 8px
```

### Border Radius

```
Radius Scale:
├── sm: 6px   (buttons, inputs)
├── md: 8px   (cards, small containers)
├── lg: 12px  (modals, large cards)
├── xl: 16px  (hero cards)
└── full: 9999px (pills, avatars)
```

### Shadows

```
Shadow Scale:
├── sm: 0 1px 2px rgba(0,0,0,0.05)
├── md: 0 4px 6px rgba(0,0,0,0.07)
├── lg: 0 10px 15px rgba(0,0,0,0.10)
└── xl: 0 20px 25px rgba(0,0,0,0.15)

Usage:
├── Cards: sm (default), md (hover)
├── Modals: lg
├── Dropdowns: md
└── FAB: lg
```

### Emoji Usage

Emoji are first-class UI elements in this app:

```
Emoji Sizing:
├── Display: 48px (group cards)
├── Large: 32px (location cards)
├── Medium: 24px (list items)
├── Small: 20px (inline)
└── Tiny: 16px (badges)

Emoji Categories (for pickers):
├── Places: 🏠 🏡 🏢 🚗 ✈️ 🏕️ 🏖️ 🏔️
├── People: 💑 👨‍👩‍👧 👥 🧑‍🤝‍🧑 👋
├── Objects: 📦 🎒 🧳 🗂️ 📋
└── Activities: 🎮 ⚽ 🎯 🏋️
```

---

## User Journeys

### Journey 1: First-Time Setup

```
┌─────────────────────────────────────────────────────────────────┐
│                     WELCOME SCREEN                              │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │              📦                                           │ │
│  │                                                           │ │
│  │        Never forget where                                 │ │
│  │        you left things                                    │ │
│  │                                                           │ │
│  │   Track your belongings across locations                  │ │
│  │   and share with the people who matter.                   │ │
│  │                                                           │ │
│  │   ┌─────────────────────────────────────────────────────┐ │ │
│  │   │          📧 Continue with Email                     │ │ │
│  │   └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     EMAIL ENTRY                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │        What's your email?                                 │ │
│  │                                                           │ │
│  │   ┌─────────────────────────────────────────────────────┐ │ │
│  │   │  alex@example.com                                   │ │ │
│  │   └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │   We'll send you a magic link to sign in.                │ │
│  │   No password needed!                                     │ │
│  │                                                           │ │
│  │   ┌─────────────────────────────────────────────────────┐ │ │
│  │   │              Send Magic Link                        │ │ │
│  │   └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CHECK EMAIL                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │              ✉️                                           │ │
│  │                                                           │ │
│  │        Check your inbox                                   │ │
│  │                                                           │ │
│  │   We sent a magic link to                                │ │
│  │   alex@example.com                                        │ │
│  │                                                           │ │
│  │   Click the link to sign in.                             │ │
│  │   Link expires in 15 minutes.                            │ │
│  │                                                           │ │
│  │   ─────────────────────────────────────────────────       │ │
│  │   Didn't get it? [Resend link]                           │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ (User clicks email link)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CREATE FIRST GROUP                          │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │        Welcome! Let's set up your first group.           │ │
│  │                                                           │ │
│  │   Pick an emoji:                                         │ │
│  │   ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                    │ │
│  │   │ 💑 │ │ 🏠 │ │ 👥 │ │ 🏕️ │ │ 🎮 │                    │ │
│  │   └────┘ └────┘ └────┘ └────┘ └────┘                    │ │
│  │                                                           │ │
│  │   Group name:                                            │ │
│  │   ┌─────────────────────────────────────────────────────┐ │ │
│  │   │  Us                                                 │ │ │
│  │   └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │   ┌─────────────────────────────────────────────────────┐ │ │
│  │   │              Create Group                           │ │ │
│  │   └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     ADD FIRST LOCATION                          │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │        Now add a location                                │ │
│  │                                                           │ │
│  │   Where do you keep things?                              │ │
│  │                                                           │ │
│  │   Pick an emoji:                                         │ │
│  │   ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                    │ │
│  │   │ 🏠 │ │ 🏡 │ │ 🚗 │ │ 🏢 │ │ 🧳 │                    │ │
│  │   └────┘ └────┘ └────┘ └────┘ └────┘                    │ │
│  │                                                           │ │
│  │   Location name:                                         │ │
│  │   ┌─────────────────────────────────────────────────────┐ │ │
│  │   │  My Place                                           │ │ │
│  │   └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │   ┌─────────────────────────────────────────────────────┐ │ │
│  │   │              Add Location                           │ │ │
│  │   └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │   [Skip for now]                                         │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                        HOME SCREEN
```

### Journey 2: Quick Item Add

```
HOME → GROUP → LOCATION → ADD ITEM

┌─────────────────────────────────────────────────────────────────┐
│                     LOCATION VIEW                               │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  ← 💑 Us                                          [⚙️]   │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │                                                           │ │
│  │  🏠 Sarah's Place                                        │ │
│  │  18 items                                                │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ ⚡ Phone charger                              × 1   │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ 👕 Hoodie                                     × 2   │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ 🧴 Toothbrush                                 × 1   │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │                        ...more items...                  │ │
│  │                                                           │ │
│  │                                              ┌─────────┐ │ │
│  │                                              │   ➕    │ │ │
│  │                                              └─────────┘ │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ (Tap + FAB)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     ADD ITEM (Sheet)                            │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │  Add item to Sarah's Place                               │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │  What's the item?                                   │ │ │
│  │  │  ──────────────────────────────────────────────────│ │ │
│  │  │  Laptop charger                                     │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  Recent:  [Charger] [Hoodie] [Toothbrush] [Laptop]       │ │
│  │                                                           │ │
│  │  Quantity:   [−]  1  [+]                                 │ │
│  │                                                           │ │
│  │  Category:   [⚡ Electronics ▾]                          │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │              Add Item                                │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Journey 3: Search ("Where is my X?")

```
┌─────────────────────────────────────────────────────────────────┐
│                     HOME SCREEN                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  InventoryTracker                                  [👤]   │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ 🔍 Search all your items...                        │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  [Groups grid below...]                                  │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ (Tap search, type "charger")
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SEARCH RESULTS                              │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  ← Search                                                │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ 🔍 charger                                      [✕] │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │                                                           │ │
│  │  2 results for "charger"                                 │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ ⚡ Phone charger                              × 1   │ │ │
│  │  │    💑 Us → 🏠 Sarah's Place                        │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ ⚡ Laptop charger                             × 1   │ │ │
│  │  │    💑 Us → 🏠 My Place                             │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Journey 4: Move Item

```
ITEM ROW → TAP → ITEM DETAIL → MOVE

┌─────────────────────────────────────────────────────────────────┐
│                     ITEM DETAIL (Sheet)                         │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │  ⚡ Phone charger                                        │ │
│  │                                                           │ │
│  │  ┌───────────────────┐ ┌───────────────────┐             │ │
│  │  │ Quantity:         │ │ Category:         │             │ │
│  │  │    [−]  1  [+]    │ │  ⚡ Electronics   │             │ │
│  │  └───────────────────┘ └───────────────────┘             │ │
│  │                                                           │ │
│  │  Location: 🏠 Sarah's Place                              │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │              📦 Move to...                          │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │              🗑️ Delete Item                         │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ (Tap "Move to...")
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     MOVE ITEM (Sheet)                           │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │  Move "Phone charger" to:                                │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ 🏠 My Place                                         │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ 🚗 Car                                              │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  Current: 🏠 Sarah's Place                               │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ (Tap destination)
                              ▼
                     [Toast: "Moved to My Place ✓"]
```

### Journey 5: Invite Partner

```
GROUP → SETTINGS → INVITE

┌─────────────────────────────────────────────────────────────────┐
│                     GROUP SETTINGS                              │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  ← 💑 Us Settings                                        │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │                                                           │ │
│  │  Group Details                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ 💑  Us                                        [Edit]│ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  Members (1)                                             │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ 👤 Alex (you)                              Owner    │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │           ➕ Invite Someone                         │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  ─────────────────────────────────────────────────────── │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │           🚪 Leave Group                            │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ (Tap "Invite Someone")
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     INVITE MEMBER (Sheet)                       │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │  Invite to "Us"                                          │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │  Their email address                                │ │ │
│  │  │  ──────────────────────────────────────────────────│ │ │
│  │  │  sarah@example.com                                  │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  They'll receive an email with a link to join.           │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │              Send Invite                             │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                     [Toast: "Invite sent to sarah@example.com ✓"]
```

---

## Component Strategy

### Component Hierarchy

```
Atoms (Base building blocks)
├── Button
├── Input
├── Badge
├── Icon
├── Emoji
├── Avatar
└── Spinner

Molecules (Combinations)
├── EmojiPicker
├── QuantitySelector
├── CategorySelector
├── SearchInput
├── EmptyState
├── Toast
└── ConfirmDialog

Organisms (Feature components)
├── GroupCard
├── LocationCard
├── ItemRow
├── SearchResult
├── MemberRow
└── InviteForm

Templates (Page layouts)
├── AuthLayout
├── AppLayout
└── SettingsLayout

Pages
├── WelcomePage
├── LoginPage
├── VerifyPage
├── HomePage
├── GroupPage
├── LocationPage
├── SearchPage
└── GroupSettingsPage
```

### Key Components

#### Button

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger'
  size: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
  disabled?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  children: ReactNode
  onClick?: () => void
}

// Variants
Primary: indigo background, white text - main actions
Secondary: white background, gray border - secondary actions
Ghost: transparent, gray text - tertiary actions
Danger: red background, white text - destructive actions

// Sizes
sm: 32px height, 12px padding, Body Small text
md: 40px height, 16px padding, Body text (default)
lg: 48px height, 20px padding, Title 3 text
```

#### GroupCard

```typescript
interface GroupCardProps {
  id: string
  name: string
  emoji: string
  locationCount: number
  itemCount: number
  onClick: () => void
}

// Layout
┌─────────────────────────────┐
│                             │
│    💑                       │  ← 48px emoji
│                             │
│    Us                       │  ← Title 2
│    4 locations • 47 items   │  ← Body Small, secondary color
│                             │
└─────────────────────────────┘

// Specs
- Min width: 160px
- Padding: 16px
- Border radius: lg (12px)
- Shadow: sm, md on hover
- Background: card white
- Hover: subtle scale (1.02)
```

#### LocationCard

```typescript
interface LocationCardProps {
  id: string
  name: string
  emoji: string
  itemCount: number
  onClick: () => void
}

// Layout (horizontal list item)
┌─────────────────────────────────────────────────┐
│  🏠  My Place                            (24)  │
└─────────────────────────────────────────────────┘

// Specs
- Height: 56px
- Padding: 12px 16px
- Border radius: md (8px)
- Emoji: 24px
- Name: Body, primary color
- Count: Badge, primary background
```

#### ItemRow

```typescript
interface ItemRowProps {
  id: string
  name: string
  quantity: number
  category?: { name: string; emoji: string }
  onClick: () => void
}

// Layout
┌─────────────────────────────────────────────────┐
│  ⚡  Phone charger                        × 1  │
└─────────────────────────────────────────────────┘

// Specs
- Min height: 48px
- Padding: 12px 16px
- Category emoji: 20px (or 📦 default)
- Name: Body, primary color
- Quantity: Body Small, secondary color, right-aligned
- Tap: reveals item detail sheet
```

#### EmptyState

```typescript
interface EmptyStateProps {
  icon: string // emoji
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

// Variants
Locations empty: 🏠 "No locations yet" "Add your first location to start tracking"
Items empty: 📦 "Nothing here yet!" "This location is all clear"
Search empty: 🔍 "No items found" "Try a different search term"
Groups empty: 👋 "Welcome!" "Create your first group to get started"
```

#### Toast

```typescript
interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number // default 3000ms
}

// Layout
┌─────────────────────────────────────────────────┐
│  ✓  Moved to My Place                          │
└─────────────────────────────────────────────────┘

// Specs
- Position: bottom center, 16px from bottom
- Padding: 12px 16px
- Border radius: full (pill)
- Background: dark gray (#1F2937)
- Text: white
- Shadow: lg
- Animation: slide up, fade in
```

---

## Accessibility Audit

### WCAG 2.1 AA Compliance

| Criterion | Implementation |
|-----------|----------------|
| **1.1.1 Non-text Content** | All emoji have aria-labels; icons have sr-only text |
| **1.3.1 Info and Relationships** | Semantic HTML (nav, main, article); proper heading hierarchy |
| **1.4.1 Use of Color** | Never rely on color alone; badges have text, states have icons |
| **1.4.3 Contrast** | Primary text 7:1, secondary 4.5:1, large text 3:1 |
| **1.4.4 Resize Text** | Supports 200% zoom without horizontal scroll |
| **2.1.1 Keyboard** | All interactive elements focusable; logical tab order |
| **2.1.2 No Keyboard Trap** | ESC closes modals/sheets; focus returns to trigger |
| **2.4.3 Focus Order** | Tab order matches visual order |
| **2.4.4 Link Purpose** | All links have descriptive text |
| **2.4.7 Focus Visible** | Visible focus ring (2px indigo outline, 2px offset) |
| **3.2.1 On Focus** | No context change on focus alone |
| **3.3.1 Error Identification** | Errors announced, field highlighted, message below |
| **3.3.2 Labels** | All inputs have visible labels or aria-label |
| **4.1.2 Name, Role, Value** | Custom components use proper ARIA roles |

### Focus Management

```css
/* Focus ring style */
:focus-visible {
  outline: 2px solid #6366F1;
  outline-offset: 2px;
  border-radius: inherit;
}

/* Skip link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: 8px 16px;
  background: #6366F1;
  color: white;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

### Screen Reader Considerations

```typescript
// Emoji accessibility
<span role="img" aria-label="couple">💑</span>

// Live regions for dynamic updates
<div aria-live="polite" aria-atomic="true">
  {toast && <Toast {...toast} />}
</div>

// Loading states
<button aria-busy={isLoading} aria-disabled={isLoading}>
  {isLoading ? 'Saving...' : 'Save'}
</button>

// Count announcements
<span aria-label={`${count} items`}>{count}</span>
```

### Reduced Motion

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

## Responsive Design (Mobile-First PWA)

### PWA Requirements

```
Manifest:
├── name: "InventoryTracker"
├── short_name: "Inventory"
├── start_url: "/"
├── display: "standalone"
├── background_color: "#FAFAFA"
├── theme_color: "#6366F1"
└── icons: 192x192, 512x512, maskable

Service Worker:
├── Cache app shell (HTML, CSS, JS)
├── Network-first for API calls
└── Offline fallback page

Install Prompt:
├── Show after 2nd visit
├── "Add to Home Screen" banner
└── Dismissable, remember preference
```

### Breakpoints

```
Mobile (default): 0 - 639px  ← PRIMARY DESIGN TARGET
Tablet: 640px - 1023px
Desktop: 1024px+

Design mobile-first. Desktop is secondary.
```

### Layout Adaptations

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Group cards | 2-column grid | 3-column grid | 4-column grid |
| Location list | Full-width stack | Full-width stack | Max 640px centered |
| Item list | Full-width stack | Full-width stack | Max 640px centered |
| Search results | Full-width | Full-width | Max 640px centered |
| Sheets/Modals | Full-screen sheet | Bottom sheet | Centered modal |
| Navigation | Bottom nav (optional) | Side nav | Side nav |

### Touch Targets

```
Minimum touch target: 44px × 44px
Minimum spacing between targets: 8px
```

---

## Animation & Microinteractions

### Principles

1. **Purposeful**: Animations clarify relationships, not decorate
2. **Quick**: Under 300ms for UI feedback, under 500ms for transitions
3. **Subtle**: Enhance, don't distract

### Key Animations

```css
/* Card hover */
.card:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow-md);
  transition: transform 150ms ease, box-shadow 150ms ease;
}

/* Sheet enter */
.sheet-enter {
  transform: translateY(100%);
  opacity: 0;
}
.sheet-enter-active {
  transform: translateY(0);
  opacity: 1;
  transition: transform 250ms ease-out, opacity 150ms ease;
}

/* Toast enter */
.toast-enter {
  transform: translateY(20px);
  opacity: 0;
}
.toast-enter-active {
  transform: translateY(0);
  opacity: 1;
  transition: all 200ms ease-out;
}

/* Item added (optimistic) */
.item-added {
  animation: highlight 400ms ease;
}
@keyframes highlight {
  0% { background-color: var(--color-primary-light); }
  100% { background-color: transparent; }
}
```

---

## Error States

### Error Messages

| Scenario | Message | Tone |
|----------|---------|------|
| Network error | "Couldn't connect. Check your internet and try again." | Helpful |
| Magic link expired | "This link has expired. Request a new one below." | Reassuring |
| Email not found | "We'll send a link if this email is registered." | Secure |
| Duplicate item | "An item with this name already exists here." | Clear |
| Delete confirmation | "Delete 'Charger'? This can't be undone." | Careful |
| Server error | "Something went wrong. Please try again." | Apologetic |

### Error UI Pattern

```
┌─────────────────────────────────────────────────┐
│  Input Label                                    │
│  ┌─────────────────────────────────────────────┐│
│  │  invalid input                              ││  ← Red border
│  └─────────────────────────────────────────────┘│
│  ⚠️ Error message here                          │  ← Red text, icon
└─────────────────────────────────────────────────┘
```

---

## Loading States

### Skeleton Loading

```
Groups loading:
┌─────────────────────────────────────────────────┐
│  ┌───────────────┐ ┌───────────────┐            │
│  │ ░░░░░░░░░░░░░ │ │ ░░░░░░░░░░░░░ │            │
│  │ ░░░░░░░░░     │ │ ░░░░░░░░░     │            │
│  │ ░░░░░░        │ │ ░░░░░░        │            │
│  └───────────────┘ └───────────────┘            │
└─────────────────────────────────────────────────┘

Items loading:
┌─────────────────────────────────────────────────┐
│  ░░ ░░░░░░░░░░░░░░░░░░░░░                ░░    │
│  ░░ ░░░░░░░░░░░░░░░░░░░░░░░░░░░          ░░    │
│  ░░ ░░░░░░░░░░░░░░░░                     ░░    │
└─────────────────────────────────────────────────┘
```

### Button Loading

```typescript
<Button loading>
  <Spinner size="sm" /> Saving...
</Button>
```

---

## State Management (UI)

### Optimistic Updates

```typescript
// Move item - update UI immediately, rollback on error
const handleMove = async (itemId: string, targetLocationId: string) => {
  // Optimistic update
  setItems(prev => prev.filter(i => i.id !== itemId))

  try {
    await moveItem(itemId, targetLocationId)
    toast.success('Moved successfully')
  } catch (error) {
    // Rollback
    setItems(prev => [...prev, item])
    toast.error('Failed to move item')
  }
}
```

### Form States

```typescript
interface FormState {
  status: 'idle' | 'submitting' | 'success' | 'error'
  error?: string
}
```

---

## Implementation Notes

### Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) + PWA |
| Styling | Tailwind CSS |
| Components | shadcn/ui (customized) |
| Forms | React Hook Form + Zod |
| State | React Server Components + Server Actions |
| Icons | Lucide React |
| Animations | Tailwind + CSS transitions |

### File Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── ui/                 # Atomic components (shadcn/ui base)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── sheet.tsx
│   │   └── toast.tsx
│   ├── groups/             # Group feature components
│   ├── locations/          # Location feature components
│   ├── items/              # Item feature components
│   └── search/             # Search feature components
├── lib/
│   └── utils.ts            # Utility functions (cn, etc.)
└── styles/
    └── globals.css         # Tailwind imports + custom properties
```

### Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
          light: '#EEF2FF',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          hover: '#F9FAFB',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
      },
    },
  },
}
```

---

## Appendix: Interaction Specifications

### Gestures (Mobile)

| Gesture | Action |
|---------|--------|
| Tap | Primary interaction |
| Long press | Not used (avoid hidden interactions) |
| Swipe | Not used in MVP (keep simple) |
| Pull to refresh | Refresh current view |

### Keyboard Shortcuts (Desktop)

| Shortcut | Action |
|----------|--------|
| `/` or `Cmd+K` | Focus search |
| `Escape` | Close modal/sheet |
| `Enter` | Submit form |
| `Tab` | Navigate focus |

---

_Frontend Specification created by WayPoint UX Designer_
_Project: inventorytracker | Stack: Next.js App Router | Experience: Warm Utility_
