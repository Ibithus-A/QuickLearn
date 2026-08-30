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
- Avoid narration of obvious motion and avoid production language such as `next slide` or
  `worked example incoming`.

## Visual and technical quality

- Final lesson videos must be rendered at exactly 1920×1080 pixels in a 16:9 frame.
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
- For discriminant and root examples, visually distinguish intersections, tangencies and graphs
  with no real intersections; the diagrams must agree exactly with the algebra shown.
- Produce a 1920×1080 poster using a settled, representative frame.

## Required review before upload

1. Compare the complete storyboard against every section of the interactive page.
2. Confirm every question, intermediate line and answer matches the page exactly.
3. Review the full preview at normal playback speed, not only isolated screenshots.
4. Inspect settled frames from every section and every question.
5. Confirm headings and subtitles change at the correct boundaries.
6. Confirm the MP4 is H.264, 1920×1080 and playable in the website video player.
7. Confirm the poster is 1920×1080.
8. Upload using the exact lesson source title expected by the website, for example:
   `public/assets/videos/1.1 Laws of Indices.mp4` and the matching `.jpg`.
9. Request the uploaded asset locally and confirm an HTTP 200 response.
10. Run the website production build.
