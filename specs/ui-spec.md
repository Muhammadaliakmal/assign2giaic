# UI/UX Specification - Phase II Task Manager

Pixel-perfect, elegant, and responsive user interface design system.

---

## Design Philosophy

- **Pixel-Perfect**: Every element precisely aligned and sized
- **Unique & Elegant**: Custom design, not generic templates
- **Professional Grade**: Production-ready quality
- **Mobile-First**: Optimized for all screen sizes
- **Accessible**: Clear contrast and intuitive interactions

---

## Color Palette

### Primary Colors (Purple/Indigo)
```css
--primary-50: #f5f3ff
--primary-100: #ede9fe
--primary-200: #ddd6fe
--primary-300: #c4b5fd
--primary-400: #a78bfa
--primary-500: #8b5cf6
--primary-600: #7c3aed  /* Main brand color */
--primary-700: #6d28d9
--primary-800: #5b21b6
--primary-900: #4c1d95
```

### Accent Colors (Teal)
```css
--accent-50: #f0fdfa
--accent-100: #ccfbf1
--accent-200: #99f6e4
--accent-300: #5eead4
--accent-400: #2dd4bf
--accent-500: #14b8a6  /* Success/Complete */
--accent-600: #0d9488
--accent-700: #0f766e
```

### Neutral Colors (Slate)
```css
--slate-50: #f8fafc   /* Light backgrounds */
--slate-100: #f1f5f9  /* Card backgrounds */
--slate-200: #e2e8f0  /* Borders */
--slate-400: #94a3b8  /* Placeholders */
--slate-500: #64748b  /* Secondary text */
--slate-600: #475569  /* Body text */
--slate-700: #334155  /* Headings */
--slate-900: #0f172a  /* Primary text */
```

### Semantic Colors
- **Success**: `accent-500` (#14b8a6)
- **Error**: `red-500` (#ef4444)
- **Warning**: `yellow-500` (#eab308)

---

## Typography

### Font Families
- **Display**: Outfit (headings, logo)
- **Body**: Inter (paragraphs, UI text)
- **Fallback**: system-ui, sans-serif

### Font Sizes
```css
text-xs: 0.75rem (12px)
text-sm: 0.875rem (14px)
text-base: 1rem (16px)
text-lg: 1.125rem (18px)
text-xl: 1.25rem (20px)
text-2xl: 1.5rem (24px)
text-3xl: 1.875rem (30px)
text-4xl: 2.25rem (36px)
```

### Font Weights
- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Extrabold: 800

---

## Spacing Scale

Based on 4px unit:
```
1: 0.25rem (4px)
2: 0.5rem (8px)
3: 0.75rem (12px)
4: 1rem (16px)
5: 1.25rem (20px)
6: 1.5rem (24px)
8: 2rem (32px)
12: 3rem (48px)
16: 4rem (64px)
```

---

## Border Radius

```css
rounded-lg: 0.5rem (8px)
rounded-xl: 0.75rem (12px)
rounded-2xl: 1rem (16px)
rounded-4xl: 2rem (32px)
```

---

## Shadows

```css
shadow-soft: 0 2px 15px -3px rgba(0, 0, 0, 0.07)
shadow-glow: 0 0 20px rgba(139, 92, 246, 0.3)
shadow-glow-accent: 0 0 20px rgba(20, 184, 166, 0.3)
```

---

## Icon Usage (lucide-react)

All icons exclusively from `lucide-react` library.

### Required Icons

| Action | Icon | Usage |
|--------|------|-------|
| Add Task | `Plus` | Add task button |
| Edit Task | `Pencil` | Edit task action |
| Delete Task | `Trash2` | Delete task action |
| Completed | `CheckCircle` | Completed task indicator |
| Pending | `Circle` | Pending task indicator |
| Empty State | `ListTodo` | No tasks placeholder |
| Logout | `LogOut` | Logout button |

### Icon Sizing
- Small: `w-4 h-4` (16px)
- Medium: `w-5 h-5` (20px)
- Large: `w-6 h-6` (24px)
- Extra Large: `w-20 h-20` (80px) - Empty state

---

## Component Specifications

### Buttons

#### Primary Button
```css
Background: gradient primary-600 to primary-700
Text: white
Padding: 0.75rem 1.5rem (12px 24px)
Border Radius: 0.75rem (12px)
Hover: Darker gradient + glow shadow
Active: Scale 0.95
```

#### Secondary Button
```css
Background: white
Text: slate-700
Border: 2px slate-200
Padding: 0.75rem 1.5rem
Border Radius: 0.75rem
Hover: slate-50 background
```

#### Icon Button
```css
Padding: 0.5rem (8px)
Border Radius: 0.5rem (8px)
Hover: slate-100 background
Active: Scale 0.95
```

### Input Fields

```css
Width: 100%
Padding: 0.75rem 1rem (12px 16px)
Border: 2px slate-200
Border Radius: 0.75rem (12px)
Focus: primary-500 border + primary-200 ring
Transition: 200ms
```

### Cards

```css
Background: white
Border: 1px slate-100
Border Radius: 1rem (16px)
Shadow: shadow-soft
Padding: 1.5rem (24px)
Hover: Lift effect (scale 1.01 + larger shadow)
```

### Task Item

```css
Display: flex
Gap: 1rem (16px)
Padding: 1rem (16px)
Border: 2px slate-100
Border Radius: 0.75rem (12px)
Hover: primary-200 border + shadow-soft
```

Completed state:
- Background: slate-50
- Border: slate-200
- Text: line-through + slate-500

---

## Animations

### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0 }
  to { opacity: 1 }
}
Duration: 300ms
```

### Slide Up
```css
@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0 }
  to { transform: translateY(0); opacity: 1 }
}
Duration: 300ms
```

### Scale In
```css
@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0 }
  to { transform: scale(1); opacity: 1 }
}
Duration: 200ms
```

### Transitions
- All interactive elements: `transition-all duration-200 ease-in-out`
- Hover effects: Scale 1.02
- Active effects: Scale 0.95

---

## Page Layouts

### Login/Signup Pages

```
┌─────────────────────────────┐
│                             │
│      Welcome Back           │  ← Gradient text
│   Sign in to continue       │  ← Subtitle
│                             │
│  ┌───────────────────────┐  │
│  │   Email Input         │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │   Password Input      │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │   Sign In Button      │  │  ← Primary button
│  └───────────────────────┘  │
│                             │
│  Don't have an account?     │
│  Sign up                    │  ← Link
│                             │
└─────────────────────────────┘
```

### Dashboard Page

```
┌─────────────────────────────────────────┐
│  TaskFlow          Welcome, John  Logout│  ← Header (sticky)
├─────────────────────────────────────────┤
│  ┌─────┐  ┌─────┐  ┌─────┐             │
│  │Total│  │Done │  │Left │             │  ← Stats cards
│  │  12 │  │  5  │  │  7  │             │
│  └─────┘  └─────┘  └─────┘             │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  + Add Task                     │   │  ← Add task form
│  └─────────────────────────────────┘   │
│                                         │
│  ○ Task title                  ✏️ 🗑️   │  ← Task items
│  ✓ Completed task             ✏️ 🗑️   │
│  ○ Another task                ✏️ 🗑️   │
│                                         │
└─────────────────────────────────────────┘
```

---

## Responsive Breakpoints

```css
Mobile: < 640px
Tablet: 640px - 1024px
Desktop: > 1024px
```

### Mobile Optimizations
- Single column layout
- Full-width cards
- Larger touch targets (min 44px)
- Simplified navigation

### Tablet Optimizations
- 2-column stats grid
- Optimized spacing
- Responsive typography

### Desktop Optimizations
- 3-column stats grid
- Maximum width container (1280px)
- Enhanced hover effects

---

## Accessibility

- **Contrast Ratio**: Minimum 4.5:1 for text
- **Focus States**: Visible outline on all interactive elements
- **ARIA Labels**: All icon buttons have descriptive labels
- **Keyboard Navigation**: Full keyboard support
- **Semantic HTML**: Proper heading hierarchy and landmarks

---

## Loading States

### Skeleton Loader
```css
Background: slate-200
Animation: pulse
Border Radius: matches component
```

### Spinner
```css
Border: 4px primary-500
Border-top: transparent
Animation: spin
Size: 48px (page), 16px (button)
```

---

## Empty State

```
┌─────────────────────────┐
│                         │
│      📋 (ListTodo)      │  ← Large icon (80px)
│                         │
│    No tasks yet         │  ← Heading
│                         │
│  Get started by         │  ← Description
│  creating your first    │
│  task...                │
│                         │
└─────────────────────────┘
```

---

## Implementation Notes

1. **No Inline SVGs**: Use lucide-react components only
2. **No Other Icon Libraries**: Exclusively lucide-react
3. **Consistent Spacing**: Follow 4px grid system
4. **Smooth Interactions**: All transitions 200ms
5. **Mobile-First**: Design for mobile, enhance for desktop
