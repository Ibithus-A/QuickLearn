# Notion Preview Diagram Standard

This file is the required reference for every diagram added to an Excelora Notion Preview lesson.
The complete lesson authoring format is defined in `docs/notion-lesson-authoring.md`.

## Visual direction

Diagrams must feel like a quiet part of the lesson page, not a presentation slide or a separate app.

- Use the shared `NativeLessonDiagram` frame from `src/components/native-lesson-diagram.tsx`.
- Build coordinate plots with `NativePlotSvg`. It supplies the shared `400 × 250` coordinate frame
  and a maximum rendered width of 440px.
- Centre complete diagram frames and cap their visual width at 500px.
- Use generous whitespace and a pale zinc plotting surface. Do not zoom a plot to fill the lesson width.
- Do not use shadows, gradients, bright colours, coloured callout boxes, or card-within-card styling.
- Stack diagrams vertically when labels would become cramped side by side.

## Palette and strokes

- Primary curve/text: `#18181b` or `#27272a`.
- Secondary curve: `#71717a`, distinguished with a dash pattern when needed.
- Axes and construction lines: `#a1a1aa`.
- Subtle guides or solution bands: `#d4d4d8`.
- Plot background: supplied by the shared frame (`zinc-50/60`).
- Axes: about 1.25px. Curves: about 2–2.25px. Points: 3–3.5px.
- Use the same plot geometry on every coordinate diagram: reserve roughly 30–45 units on each
  edge of the `400 × 250` view box for labels. Plot data must stay inside those boundaries.

## Labels

- Keep labels horizontal and away from curves.
- Reserve a clear gutter outside the plotting region for axis and tick labels. A curve, axis, guide, point, or construction line must never pass through label glyphs.
- Put point coordinates, full equations, curve names, and multi-word explanations in the caption/legend beneath the plot instead of floating them beside a curve.
- Internal SVG text is limited to short axis names and unobstructed tick values.
- Use `NativeDiagramMathLabel` for fractional, indexed, powered, or otherwise typeset mathematical tick labels. Do not approximate maths with slash text such as `11/4`.
- Never put labels in coloured pills or boxes.
- Do not use a thick white text stroke to mask an overlap. Reposition the label or move it into the caption.
- Use 11–13px SVG labels and the website typography for captions and legends.
- Put full equations in the caption using KaTeX; keep SVG labels short.
- When two curves need identifying, use `NativeDiagramLegend` and
  `NativeDiagramLegendItem` below the plot instead of labelling either curve directly.

### Protected label zones

- Treat every label as a rectangle, not as a single coordinate. Allow for the complete glyph
  height and width when checking clearance.
- No axis, curve, asymptote, guide, construction line or point may enter a label rectangle.
- Offset an origin label to one side of the vertical axis. Never centre `0` on that axis.
- Offset a tick label to one side of a vertical asymptote or guide. Never centre the label on the
  dashed line.
- Put horizontal-axis tick labels at least 8 view-box units below the lowest stroke or point at
  that coordinate. KaTeX fraction labels need at least 10 units and a 30-unit-high container.
- Put horizontal-line values in the left label gutter, not on the line and not beside a branch
  that crosses the same area.
- If a safe internal position cannot be guaranteed at every responsive width, move the label to
  the caption or legend. Do not hide a collision with a white background or text outline.

## Curves and mathematical accuracy

- Smooth mathematical curves must use a continuous path with `stroke-linecap="round"` and
  `stroke-linejoin="round"`. `NativePlotSvg` supplies geometric-precision rendering.
- Do not approximate a smooth curve with a small number of visibly angular straight segments.
  Use a quadratic/cubic Bézier path with tangent-continuous joins, or sample the function densely
  enough that individual segments are not visible at the largest rendered size.
- Corners are only appropriate where the mathematics requires them, such as a modulus graph or
  a piecewise-linear function.
- Plot coordinates from the stated function or transformation. Do not position marked points by
  eye. Check roots, intercepts, endpoints, vertices, turning points and intersections against the
  equation before styling the curve.
- A marked point must lie on the rendered curve. A projection guide must terminate at the point,
  not pass through its label.
- Preserve the qualitative end behaviour, asymptotes, domain restrictions and open/closed
  endpoints of the function being taught.
- When multiple Bézier segments form one curve, their incoming and outgoing tangents must align
  at each join so no kink appears.

## Coordinate axes

- Every coordinate plot must visibly label both axes using the variables from the question
  (`x` and `y`, or contextual variables such as `distance, x` and `height, H`).
- A number line is the only exception; it needs its horizontal variable but no artificial
  vertical axis.
- Axis labels belong at the ends of the axes in protected gutters. They must not sit beside a
  nearby curve endpoint.
- Show only tick values that contribute to the explanation. Every shown tick needs a tick mark,
  projection guide, point or other unambiguous relationship to the plot.
- Keep the axes visually secondary to the curve and use a consistent origin and scale within a
  diagram. If axes do not start at zero, the caption must make the displayed domain clear.

## Layout and content

- Preserve the PDF’s teaching order and mathematical content.
- Place a diagram immediately after the statement or calculation it explains.
- Do not introduce horizontal scrolling. If space is limited, stack content below.
- Use one clear visual idea per plot. Avoid decorative grids and unnecessary annotation.
- Include an accurate `aria-label` describing the mathematical relationship.

## Required pre-release audit

Before adding or changing a diagram, compare it against the existing lesson typography and
reread this file. A diagram is not finished until all of the following have been checked:

1. Render it at 320px, 430px and desktop lesson widths.
   Confirm the figure, SVG, legend and caption remain inside the lesson column. Wide formulae
   must wrap or scale; they must never create horizontal page overflow or be silently clipped.
2. Inspect every label rectangle for collisions with axes, curves, asymptotes, guides and points.
3. Confirm that no label is clipped by the SVG view box or lesson frame.
4. Confirm that every coordinate axis is named and every complex tick uses proper KaTeX notation.
5. Inspect smooth curves at the largest size for angular segments, kinks or flat spots that are
   not mathematically intended.
6. Check every marked coordinate against the equation and confirm the point lies on the path.
7. Check roots, intercepts, vertices, intersections, asymptotes, endpoints and end behaviour.
8. Confirm that multiple curves remain distinguishable without relying on colour alone.
9. Confirm that the `aria-label`, legend and caption agree with the visual and the lesson text.
10. Run `npm run test:diagrams`, the project lint, TypeScript check and production build.
