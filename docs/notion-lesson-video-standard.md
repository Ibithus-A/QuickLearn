# Excelora Notion Lesson Video Standard

This is the required production standard for every video attached to an interactive Notion lesson.
Read the complete interactive page and this document before writing or changing a scene.

## Source fidelity

- The interactive lesson page is the source of truth.
- Follow the page from top to bottom without changing its mathematical content, teaching order,
  questions, worked solutions or final answers.
- The video title must use the lesson name and number shown on the page, for example
  `1.1 Laws of Indices`.
- Use the page's section titles in the video: `Laws of Indices`, `Worked Examples`,
  `Practice Questions`, and `Solutions to Practice Questions`.
- Do not merge, omit or silently shorten steps merely to reduce the duration.

## Page hierarchy on screen

- The current page section must always be obvious.
- When a section label such as `WORKED EXAMPLES` is already visible, do not repeat it with
  a second generic heading such as `Worked Example 2`. Distinguish examples with the complete
  question and the changing instructional subtitle.
- Show the complete question clearly before any working begins. Keep the question in a stable
  question area and place the working beneath it.
- When the next example or solution begins, replace both the heading and question so there is no
  ambiguity about which question is being answered.
- Practice questions and their solutions must retain the numbering used by the interactive page.
- Show each practice-question number once. Put `PRACTICE QUESTION 2` in the compact section label
  and do not repeat `Practice Question 2` as a large heading beneath it.
- Apply the same rule to solutions: use one compact label such as
  `SOLUTION TO PRACTICE QUESTION 2`, followed directly by the complete question.
- Do not add a lesson-summary or recap screen unless that section exists in the interactive page.
  End naturally on the page's final solution or final piece of content.

## Teaching pace and working

- Pace the video for a learner encountering the topic, not for someone reviewing it quickly.
- Show every meaningful algebraic and arithmetic step from the page.
- Use one mathematical move per animation beat. Preserve unchanged terms and animate only the
  part being transformed wherever practical.
- Hold completed lines long enough to be read before moving on.
- Do not display unexplained final answers or jump over rearrangement, factorisation, substitution,
  exponent, root, reciprocal or simplification steps.
- Longer lessons are acceptable. Completeness and comprehension take priority over an arbitrary
  short duration.

## Instructional subtitles

- Subtitles must explain the current mathematical action and why it is valid.
- Use the page's step titles where available, for example `Rewrite 27 as a power of 3` and
  `Apply the division law`.
- Change the subtitle whenever the mathematical action or question changes.
- Keep subtitles concise, specific and written in the same typography as the rest of the video.
- Render each visual subtitle line as one complete shaped text object. Never assemble a subtitle
  from separate per-word objects: their different bounding boxes do not share a typographic
  baseline and make words appear higher or lower than one another.
- Preserve normal font kerning and whitespace. Wrap subtitles by measuring candidate full-line
  strings at word boundaries within a fixed safe width, then shape each completed line once.
- Use consistent line spacing and centre the complete subtitle block in the same reserved area on
  every scene. Never shrink an overlong line to force it into the safe width.
- Inspect short, long, punctuation-heavy and two-line subtitles in settled frames. Reject the
  render if words touch, gaps visibly vary, a line is clipped or the block moves into the lesson
  panel, logo or player-control safe area.
- Avoid narration of obvious motion and avoid production language such as `next slide` or
  `worked example incoming`.

## Visual and technical quality

- Final lesson videos must be rendered natively at exactly 1920×1080 pixels, 240 fps, in a 16:9 frame.
- Use crisp vector text and `MathTex` equations; never upscale a 720p or 576p render.
- Render the final at high quality and verify the resulting file dimensions with `ffprobe`.
- Maintain the Excelora light, minimal visual language and consistent sans-serif interface text.
- Match the website's black, white and neutral-grey palette. Colour must not be used as decoration;
  use contrast, weight, spacing and subtle neutral fills to communicate hierarchy.
- Use the same sans-serif family for titles, section labels, headings, question prose and
  subtitles. Reserve serif mathematical typesetting for mathematical notation itself.
- Keep equations large enough to read inside the website player, but do not crowd the panel.
- Leave a deliberate clear gap between the lesson panel and subtitles. Subtitles must never look
  attached to the panel or collide with the video player's controls.
- Prevent clipping, overlap, transient stray glyphs and text collisions throughout transitions.
- Use consistent smooth easing. Prefer restrained transforms and short cross-fades that preserve
  spatial continuity; avoid abrupt slide changes, excessive movement or ornamental effects.
- Include every instructional diagram from the interactive page. Animate axes first, then draw
  curves smoothly, then reveal points, guides and labels so the construction is easy to follow.
- Plot curves from their equations with dense, smooth paths. Label both axes using the variables
  from the question and keep every label outside curve, axis and guide-line paths.
- Anchor diagrams to a fixed plot area rather than centring their combined bounding box. Curves,
  asymptotes and guides must remain below the question/title divider and above the subtitle safe
  area throughout their drawing animations, not only in the settled frame.
- Choose each plotted curve's visible domain from its resulting screen-space bounds. The curve
  must stop with a deliberate margin inside the graph panel; an axes range does not clip a Manim
  plot whose function values exceed that range. Add a render-time bounds assertion for diagram-
  heavy lessons so an out-of-band curve fails production instead of reaching the website.
- Give intercept, root, turning-point and asymptote labels an opaque neutral quiet zone whenever a
  nearby path could cross their glyphs. Reposition the label as well; a background is not a licence
  to obscure a mathematically important part of the curve.
- At the website player's embedded size, a label's quiet zone must not erase or visually break a
  curve or axis. If no genuinely clear position exists and the value is not required to interpret
  the result, omit the plot label and explain it during the preceding construction instead.
- Treat equation labels and nearby coordinate labels as one collision set. Their glyphs and quiet
  zones must remain visibly separate from one another as well as from every curve, guide and axis;
  never allow two labels to merge into what appears to be a single malformed expression.
- For inverse-function reflection diagrams, draw the original function, its inverse and the
  `y = x` mirror line as uninterrupted paths. Put all three labels in genuine whitespace; do not
  use opaque label backgrounds that cut visible gaps into any of the paths.
- Teach one-to-one versus many-to-one graphically with the horizontal-line test. Display the
  intersections explicitly so it is visually clear why one output cannot correspond to multiple
  inputs when an inverse exists.
- For questions involving composite functions, inverses, restricted domains or ranges, accompany
  the algebraic solution with a graph that identifies every relevant endpoint, turning point or
  asymptote. State the resulting domain and range beside the graph and show how they swap under an
  inverse; a formula-only solution is not sufficient.
- Reflection diagrams must use equal physical scales on the horizontal and vertical axes whenever
  the geometry of reflection is being taught. Keep domain/range information in a separate panel so
  it cannot crowd the curves, axis labels or the `y = x` guide.
- When visually de-emphasising an unused branch of a plotted function, animate stroke opacity
  only. Changing a curve object's overall opacity may expose its implicit fill and create a false
  shaded wedge. Recheck both the transition and settled frame after switching restricted domains.
- Every source curve and its transformed target must receive the same precomputed layout transform.
  Do not recalculate a shift from axes that have already moved. Before release, inspect each join at
  full and embedded size and confirm transformed pieces share the exact intended endpoint.
- For discriminant and root examples, visually distinguish intersections, tangencies and graphs
  with no real intersections; the diagrams must agree exactly with the algebra shown.
- For inequalities, use open endpoint markers for strict or excluded boundaries and closed markers
  for included boundaries. Shaded graph or number-line regions must match the final interval exactly.
  Display a solution interval on its own line below the coordinate axis rather than drawing it over
  the x-axis. Connect it to the relevant intersections with restrained guides, label both endpoints
  beside the interval itself, and state the resulting interval explicitly.
- For modulus transformations, explicitly contrast the two operations: `y = |f(x)|` acts on
  outputs, so retain the graph on or above the x-axis and reflect only the part below it upwards;
  `y = f(|x|)` acts on inputs, so retain the graph for `x >= 0` and reflect that right-hand part
  across the y-axis. Show these transformations side by side when teaching the distinction.
- In every worked modulus graph, first draw the corresponding ordinary graph, then animate the
  relevant section reflecting across the correct axis. Do not jump directly to the finished
  modulus graph; preserve the original section long enough for the student to identify what stays,
  what moves and why.
- Produce a 1920×1080 poster using a settled, representative frame.

## Required review before upload

1. Compare the complete storyboard against every section of the interactive page.
2. Confirm every question, intermediate line and answer matches the page exactly.
3. Review the full preview at normal playback speed, not only isolated screenshots.
4. Inspect settled frames from every section and every question.
5. Confirm headings and subtitles change at the correct boundaries.
6. Confirm every subtitle has a level typographic baseline, natural inter-word spacing and no
   individually displaced words. Check wrapped subtitles retain the same font size, line spacing
   and centred alignment at both native 1920×1080 and the website player's embedded display size.
7. Confirm the MP4 is H.264, 1920×1080, 240 fps and playable in the website video player.
8. Confirm the poster is 1920×1080.
9. Upload using the exact lesson source title expected by the website, for example:
   `public/assets/videos/1.1 Laws of Indices.mp4` and the matching `.jpg`.
10. Request the uploaded asset locally and confirm an HTTP 200 response.
11. Run the website production build.
