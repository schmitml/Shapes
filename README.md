# Shape Pattern Generator

An interactive web application for creating, manipulating, and composing simple geometric shapes into repeating patterns, with one-click SVG export.

Built with React, TypeScript, and Vite. All rendering is done natively with SVG, so what you see on screen is exactly what gets exported.

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens a local dev server (default `http://localhost:5173`) with hot module replacement.

### Production Build

```bash
npm run build
```

Output is written to `dist/`. Preview it locally with:

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

---

## User Guide

The interface has three columns:

| Left Sidebar | Center | Right Sidebar |
|---|---|---|
| Add Shapes, Canvas Settings, Layers | SVG Canvas (interactive) | Shape Properties, Pattern Controls |

### Adding Shapes

Click any shape button in the left sidebar to add it to the center of the canvas. Six shape types are available:

| Shape | Description | Configurable Properties |
|---|---|---|
| **Circle** | Standard circle | `radius` |
| **Rectangle** | Rectangle / rounded rectangle | `width`, `height`, `cornerRadius` |
| **Triangle** | Equilateral triangle | `size` (side length) |
| **Polygon** | Regular N-sided polygon | `radius`, `sides` (3-20) |
| **Star** | N-pointed star | `outerRadius`, `innerRadius`, `points` (3-20) |
| **Line** | Straight line segment | `endX`, `endY` |

### Manipulating Shapes

**Drag-and-drop**: Click and drag any shape on the canvas to reposition it. The drag automatically compensates for canvas scaling so the shape tracks your cursor accurately.

**Properties panel** (right sidebar): Select a shape to edit all of its properties numerically:

- **Position & Transform**: X, Y, Rotation (0-360), Scale X, Scale Y
- **Appearance**: Fill color, Stroke color, Stroke width, Opacity (0-1)
- **Shape Size**: Type-specific dimensions (see table above)

**Layer management** (left sidebar): Shapes are listed in render order (top of list = front). Select a shape by clicking its layer entry. In the properties panel header, use:

- Arrow up/down buttons to change render order
- Duplicate button to clone the shape (offset by 20px)
- Delete button (X) to remove the shape

### Canvas Settings

In the left sidebar under "Canvas":

- **Width / Height**: Set the canvas dimensions (100-2000px). This is also the size of the exported SVG.
- **Background**: Pick a background color via the color picker or type a hex value.

### Pattern Modes

The Pattern panel (right sidebar) lets you repeat all shapes according to a pattern. Select a mode to activate it:

#### None (default)
Shapes are rendered exactly as placed. No repetition.

#### Grid
Tiles shapes in a grid pattern centered on each shape's position.

| Parameter | Description | Range |
|---|---|---|
| Columns | Number of horizontal repetitions | 1-20 |
| Rows | Number of vertical repetitions | 1-20 |
| Space X | Horizontal spacing between copies (px) | 10-500 |
| Space Y | Vertical spacing between copies (px) | 10-500 |

The grid is centered on the original shape position, so a 3x3 grid with 100px spacing places copies at -100, 0, +100 on each axis.

#### Radial
Arranges copies in a circle around the original shape's position.

| Parameter | Description | Range |
|---|---|---|
| Count | Number of copies around the circle | 2-36 |
| Radius | Distance from center to each copy (px) | 10-400 |
| Angle | Rotation offset of the entire arrangement (degrees) | 0-360 |

Each copy is automatically rotated to face outward from center (its rotation equals its angular position).

#### Linear
Repeats shapes along a straight line at a specified angle.

| Parameter | Description | Range |
|---|---|---|
| Count | Number of copies along the line | 1-30 |
| Spacing | Distance between consecutive copies (px) | 10-500 |
| Angle | Direction of the line (degrees, 0 = right) | 0-360 |

The line is centered on the original shape position.

#### Mirror
Reflects shapes across the canvas center axes.

| Parameter | Description |
|---|---|
| Horizontal | Mirror across the vertical center axis |
| Vertical | Mirror across the horizontal center axis |

When both are enabled, a fourth copy appears at the diagonally opposite corner (2-axis symmetry).

### Progression Controls

Available for Grid, Radial, and Linear patterns. These apply cumulative changes to each successive copy:

| Slider | Effect | Range |
|---|---|---|
| **Scale** | Each copy grows or shrinks by this percentage relative to the previous | -20 to +20 |
| **Rotate** | Each copy adds this many degrees of rotation | 0 to 90 |
| **Fade** | Each copy reduces opacity by this percentage | 0 to 20 |

For example, with a Linear pattern of 8 copies and Rotate = 15, the copies rotate 0, 15, 30, 45, 60, 75, 90, 105 degrees.

### SVG Export

Click the **Export SVG** button in the left sidebar. The browser downloads a file called `pattern.svg` containing:

- An XML declaration and SVG namespace
- A background rectangle matching your canvas settings
- All shapes, including pattern-generated copies, as native SVG elements (`<circle>`, `<rect>`, `<polygon>`, `<line>`)
- Proper `transform` attributes for position, rotation, and scale

The exported SVG is standards-compliant and can be opened in any SVG editor (Inkscape, Illustrator, Figma), embedded in web pages, or converted to other formats.

### Clear All

Click **Clear All** to reset the canvas to its initial state: empty shapes, default 600x600 canvas, white background, no pattern.

---

## Architecture

```
src/
  types/
    shapes.ts              Type definitions for shapes, patterns, and canvas state
  utils/
    shapeDefaults.ts       Factory function for creating shapes with default values
    svgRenderer.ts         Converts shape objects to SVG element strings (for export)
    patternGenerator.ts    Generates transformed shape instances from pattern config
    exportSvg.ts           Assembles complete SVG document and triggers download
  hooks/
    useCanvasState.ts      Central state management hook (all app state)
  components/
    SvgCanvas.tsx          Interactive SVG canvas with drag-and-drop positioning
    Toolbar.tsx            Shape palette, canvas settings, export/clear buttons
    ShapeProperties.tsx    Per-shape property editor (position, style, dimensions)
    ShapeList.tsx          Layer list with selection highlighting
    PatternControls.tsx    Pattern mode selector and parameter editors
  App.tsx                  Root component -- assembles the three-column layout
  App.css                  All application styles
  index.css                CSS reset and design tokens (custom properties)
  main.tsx                 React entry point
```

### Data Flow

```
useCanvasState (single source of truth)
  |
  |-- Toolbar           -> addShape(), setCanvasSize(), setBackground(), clearAll()
  |-- ShapeList         -> selectShape()
  |-- ShapeProperties   -> updateShape(), deleteShape(), duplicateShape(), moveShapeUp/Down()
  |-- PatternControls   -> updatePattern()
  +-- SvgCanvas         -> selectShape(), updateShape() (via drag)
        |
        +-- patternGenerator.generatePatternInstances()
              -> produces TransformedShape[] for rendering
```

All state lives in a single `CanvasState` object managed by `useCanvasState`. There is no external state library -- the hook uses `useState` with `useCallback` for stable references.

### Type System

Shapes use a discriminated union (`Shape`) with a `type` field. Each variant extends `ShapeBase` (common fields: id, position, rotation, scale, fill, stroke, opacity) and adds type-specific properties.

```typescript
type Shape = CircleShape | RectangleShape | TriangleShape | PolygonShape | StarShape | LineShape;
```

The pattern system uses a single `PatternConfig` interface with all parameters for all pattern types. Only the fields relevant to the active `PatternType` are used by the generator.

### SVG Rendering

**On-screen**: The `SvgCanvas` component renders shapes as React SVG elements (`<circle>`, `<rect>`, `<polygon>`, `<line>`). Each shape is drawn at the origin and positioned via a `transform` attribute (`translate -> rotate -> scale`). Pattern copies are generated by `generatePatternInstances()` and rendered as additional elements with combined transforms.

**Export**: The `exportSvg` module uses `svgRenderer.shapeToSvgElement()` to produce SVG markup strings. It applies the same pattern transforms, then wraps everything in an `<svg>` document with proper XML declaration, namespace, and viewBox.

Both paths share the same geometry functions (`getTrianglePoints`, `getPolygonPoints`, `getStarPoints`) so the export always matches what's displayed.

### Drag-and-Drop

Implemented in `SvgCanvas` using mouse events. On `mouseDown`, the component captures the shape ID and cursor start position, then attaches window-level `mousemove`/`mouseup` listeners. Mouse deltas are scaled by the ratio of SVG viewBox dimensions to rendered element dimensions to ensure accurate tracking regardless of canvas scaling.

Only "original" shapes (not pattern copies) are draggable. Pattern copies ("ghosts") have `pointer-events: none`.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [React](https://react.dev/) 19 | UI framework |
| [TypeScript](https://www.typescriptlang.org/) 5.9 | Type safety |
| [Vite](https://vite.dev/) 7 | Build tool and dev server |
| [uuid](https://www.npmjs.com/package/uuid) | Unique shape IDs |
| [ESLint](https://eslint.org/) | Linting |

No additional UI libraries, CSS frameworks, or state management dependencies.
