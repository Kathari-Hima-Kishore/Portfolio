# Anti-Gravity Mobile View Testing Prompt

## Target URL
http://localhost:3000

---

## Test Configuration

### Device Mode
**Mobile Portrait** (375px × 812px - iPhone X)

### Test Conditions
- Clear browser cache before testing
- Throttle network to 4G for realistic conditions
- Test both portrait and landscape orientations

---

## Mobile Visual Testing Checklist

### 1. Hero Section (Phase 1 - Introduction)

#### Layout
- [ ] Single column layout (no empty right-side space)
- [ ] Heading "Kathari Hima Kishore" fits without overflow
- [ ] Subtitle "Aspiring Full Stack Cloud Engineer" visible
- [ ] Bio text readable and properly wrapped

#### Buttons
- [ ] GitHub and Contact Me buttons are full-width
- [ ] Buttons stacked vertically (not side-by-side)
- [ ] Touch targets minimum 44px height

#### 3D Object
- [ ] **3D Spline Keyboard is NOT visible** on mobile
- [ ] No WebGL canvas loaded
- [ ] StarryBackground animation visible and smooth

#### Performance
- [ ] First Contentful Paint < 1.5s
- [ ] No layout shift during load
- [ ] Smooth scroll performance (60fps)

---

### 2. Skills Section (Phase 2 - NEW Orbital Design)

#### Orbital Constellation
- [ ] **4 glowing nodes visible** in orbit pattern:
  - Frontend (blue/cyan glow)
  - Backend (green glow)
  - Cloud (purple glow)
  - Tools (orange glow)
- [ ] Center "Tech Stack" hub visible with pulsing animation
- [ ] Orbital ring and decorative elements render correctly
- [ ] No "View List" button (replaced with orbital design)

#### Interactions
- [ ] **Tap Frontend node** → expands to show skill list
- [ ] **Tap Backend node** → expands to show skill list
- [ ] **Tap Cloud node** → expands to show skill list
- [ ] **Tap Tools node** → expands to show skill list
- [ ] **Tap expanded node again** → collapses back to orbit
- [ ] **Close (X) button** → collapses expanded view
- [ ] Touch targets are 44px+ (nodes are 64px)

#### Skill List (Expanded State)
- [ ] Skill list appears below tapped node
- [ ] All skills visible: HTML & CSS, Tailwind, JavaScript, React.js, etc.
- [ ] Colored bullet points match node color
- [ ] Smooth expand/collapse animation

#### Visual Quality
- [ ] Glow effects visible but not overwhelming
- [ ] Text readable against dark background
- [ ] Animation smooth (no stutter)

---

### 3. Experience Section (Phase 3)

#### Timeline Layout
- [ ] Vertical timeline (not horizontal)
- [ ] Timeline dots visible and centered
- [ ] Cards stack below timeline (not alternating)
- [ ] Full-width cards with proper padding

#### Content
- [ ] Job titles visible
- [ ] Company names visible
- [ ] Dates visible
- [ ] Bullet points readable

---

### 4. Featured Project Section (Phase 4)

#### Layout
- [ ] Single column layout
- [ ] Project image scales properly
- [ ] Image doesn't overflow container
- [ ] Text readable

#### Links
- [ ] "View Project" button full-width
- [ ] "Source Code" button full-width (if present)
- [ ] Tech stack tags wrap properly

---

### 5. More Projects Section (Phase 5)

#### Grid
- [ ] Single column grid (not 2-column)
- [ ] AR Visualizer card visible
- [ ] Hash Cracker card visible
- [ ] Technology icons visible (React, Azure, Python)

---

### 6. Education Section (Phase 6)

#### Visuals
- [ ] Graduation cap icon smaller (not oversized)
- [ ] "Education" heading properly sized
- [ ] Background "26" watermark visible but subtle
- [ ] Duration and grade text readable

---

### 7. Contact Section (Phase 7)

#### Grid
- [ ] Single column contact cards
- [ ] Email, Phone, Location cards visible
- [ ] Touch targets large enough (44px min)
- [ ] Icons properly sized (text-3xl)

---

## Performance Testing

### Load Performance
- [ ] **Initial bundle size** < 500KB (no Spline on mobile)
- [ ] Time to Interactive < 2s
- [ ] First Contentful Paint < 1s
- [ ] No main-thread blocking

### Scroll Performance
- [ ] Smooth scrolling between sections
- [ ] No jank or stuttering
- [ ] IntersectionObserver updates correctly
- [ ] 60fps maintained during scroll

### Memory
- [ ] No memory leaks detected
- [ ] Heap size reasonable (< 50MB)

---

## Responsive Behavior

### Orientation Change
- [ ] Rotating to landscape adapts layout
- [ ] Content remains readable
- [ ] No broken layouts

### Resize
- [ ] Resizing browser triggers responsive breakpoints
- [ ] Layout adapts at 768px threshold
- [ ] No console errors during resize

---

## Accessibility (Mobile)

- [ ] Touch targets minimum 44×44px
- [ ] Color contrast WCAG AA compliant
- [ ] Text remains readable at 200% zoom
- [ ] No horizontal scrolling required

---

## Output Format

Generate a markdown report with:

```markdown
# Mobile Portfolio Test Report

## Executive Summary
- **Overall Score**: X/100
- **Critical Issues**: [Count]
- **Warnings**: [Count]
- **Passes**: [Count]

## Key Findings

### ✅ New Orbital Skills Design
- All 4 nodes visible and glowing
- Tap interactions work smoothly
- Skill lists expand/collapse correctly
- No "View List" button (design replaced successfully)

### ⚠️ Issues Found
1. [Issue description]
2. [Issue description]

## Screenshots
- Hero Section: [path]
- Skills Section (Orbital): [path]
- Experience Section: [path]
- Contact Section: [path]

## Performance Metrics
- Load Time: X.Xs
- Bundle Size: XKB
- Lighthouse Score: XX/100
```

---

## Success Criteria

### Must Pass
- [ ] 3D Spline does NOT load on mobile
- [ ] Orbital Skills constellation visible and interactive
- [ ] All sections readable on mobile
- [ ] Touch targets minimum 44px
- [ ] Scroll performance 60fps

### Should Pass
- [ ] Smooth animations (no stutter)
- [ ] Starry background visible
- [ ] Proper typography hierarchy
- [ ] Consistent color scheme

---

## Testing Commands

```bash
# Run mobile-specific test
anti-gravity test --url http://localhost:3000 \
  --device "mobile-portrait" \
  --viewport "375x812" \
  --output ./test-results/mobile/ \
  --format markdown

# Test with network throttling
anti-gravity test --url http://localhost:3000 \
  --device "mobile-portrait" \
  --throttle "4g" \
  --metrics "performance,accessibility,best-practices"
```

---

*Test created for Mobile Portfolio View*
*Focus: New Orbital Skills Design*
