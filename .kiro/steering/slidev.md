---
inclusion: manual
description: Comprehensive guide for Slidev - a web-based presentation framework for developers. Covers Markdown syntax, layouts, components, animations, theming, and exporting.
---

# Slidev

## Overview

Slidev is a presentation platform for developers that enables creating slides using Markdown while leveraging Vue and web technologies for interactive, pixel-perfect designs. This skill provides complete guidance for creating, customizing, and exporting Slidev presentations.

Use this skill when:

- Creating new developer presentations
- Working with Markdown-based slides
- Adding interactive components and animations
- Customizing slide layouts and themes
- Integrating code blocks with syntax highlighting
- Exporting presentations to PDF, PPTX, or PNG
- Setting up Slidev projects

## Quick Start

### Installation and Setup

Create a new Slidev presentation:

```bash
# Using pnpm (recommended)
pnpm create slidev

# Using npm
npm init slidev

# Using yarn
yarn create slidev

# Using bun
bun create slidev
```

Or try online at https://sli.dev/new (StackBlitz)

### Essential Commands

Start development server:

```bash
slidev
# or specify entry file
slidev slides.md
```

Build for production:

```bash
slidev build
```

Export to PDF:

```bash
slidev export
```

Export to other formats:

```bash
slidev export --format pptx
slidev export --format png
slidev export --format md
```

Format slides:

```bash
slidev format
```

## Reference Documents

For detailed documentation on specific topics, see the following steering files (use `#` to include them):

- `slidev-syntax-guide.md` - Complete Markdown syntax reference
- `slidev-components-api.md` - Detailed component API documentation
- `slidev-features.md` - Advanced features and integrations

---

## Markdown Syntax

### Slide Separators

Separate slides with `---` padded by blank lines:

```md
# Slide 1

Content here

---

# Slide 2

More content
```

### Frontmatter and Headmatter

Configure entire deck with headmatter (first YAML block):

```md
---
theme: default
background: https://cover.sli.dev
title: My Presentation
info: |
  ## Slidev Starter
  Presentation slides for developers
class: text-center
highlighter: shiki
---
```

Configure individual slides with frontmatter:

```md
---
layout: center
background: ./images/bg.jpg
class: text-white
---

# Centered Slide

Content here
```

### Code Blocks

Code with syntax highlighting:

````md
```ts
console.log('Hello, World!')
```
````

With line highlighting:

````md
```ts {2,4-6}
function calculate() {
  const x = 10  // highlighted
  const y = 20
  const sum = x + y  // highlighted
  const product = x * y  // highlighted
  const difference = x - y  // highlighted
  return sum
}
```
````

### Presenter Notes

Add notes at the end of slides using comment blocks:

```md
# Slide Title

Content visible to audience

<!--
Notes for presenter only
Can include **markdown** and HTML
-->
```

---

## Layouts

### Built-in Layouts

- `default` - Standard layout for any content
- `center` - Centers content on screen
- `cover` - Opening slide for presentations
- `end` - Closing slide
- `intro` - Introduction with title and author details
- `section` - Marks new presentation sections
- `image` / `image-left` / `image-right` - Image layouts
- `iframe` / `iframe-left` / `iframe-right` - Iframe layouts
- `two-cols` / `two-cols-header` - Multi-column layouts

### Two-Column Layout Example

```md
---
layout: two-cols
---

# Left Column

Content for left side

::right::

# Right Column

Content for right side
```

---

## Animations

### Click Animations

```md
<div v-click>Appears on click</div>

<v-clicks>

- First item
- Second item
- Third item

</v-clicks>
```

### Slide Transitions

```md
---
transition: slide-left
---
```

Available: `fade`, `slide-left`, `slide-right`, `slide-up`, `slide-down`, `view-transition`

---

## Styling

Slidev uses UnoCSS with Tailwind-compatible utilities:

```md
<div class="grid grid-cols-2 gap-4">
  <div class="bg-blue-500 p-4">Column 1</div>
  <div class="bg-red-500 p-4">Column 2</div>
</div>
```

---

## Exporting

```bash
slidev export                    # PDF
slidev export --format pptx      # PowerPoint
slidev export --format png       # PNG images
slidev export --with-clicks      # Include animation steps
slidev export --dark             # Dark mode
```

---

## Theming

```md
---
theme: seriph
---
```

Official themes: `default`, `seriph`, `apple-basic`, `bricks`, `shibainu`

Browse more at https://sli.dev/themes/gallery

---

## Technology Stack

Vite, Vue 3, UnoCSS, Shiki, Monaco Editor, Mermaid, KaTeX, VueUse, Iconify
