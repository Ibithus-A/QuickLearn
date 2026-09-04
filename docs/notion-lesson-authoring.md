# Excelora Notion Lesson Authoring Standard

This is the required format for every web-native lesson. The source PDF remains the content authority; the Notion lesson is a faithful presentation of that content, not a rewrite.

## Architecture

The lesson system has four layers:

1. `src/components/notion-lesson-renderer.tsx` owns the page shell, typography, KaTeX rendering, section spacing, worked-example steps, and question numbering.
2. `src/content/notion-lessons/definitions.ts` owns stable lesson metadata and maps each preview page to its original PDF title.
3. Each lesson content component owns only its introduction, ordered sections, exact source wording, maths, and diagrams.
4. `src/content/notion-lessons/registry.ts` is the single lookup used by the workspace. The editor must not contain lesson-specific conditionals.

## Required definition

Add one entry to `NOTION_LESSON_DEFINITIONS` before writing the page:

```ts
exampleLesson: defineLesson({
  id: "pure-mathematics-2-1-example-lesson",
  previewTitle: EXAMPLE_NATIVE_LESSON_TITLE,
  sourceTitle: "2.1 Example Lesson",
  title: "Example Lesson",
}),
```

- `id` is permanent, lowercase, and unique.
- `previewTitle` must exactly match the page title in the course seed.
- `sourceTitle` is the stable original lesson title. It must match the lesson video and poster filenames without their extensions. A matching PDF is optional for native interactive lessons; Arthur should use the rendered page context when no legacy PDF is shipped.
- `previewTitle` is the title displayed in the workspace. Use the normal numbered lesson title only; never append “Notion Preview” or another implementation label.
- `title` is the clean heading shown inside the Notion page.
- Subject and chapter metadata must match the course tree. Extend `defineLesson` or create a chapter-specific helper when adding a new chapter.

## Required content component

Use the shared renderer and primitives. Do not recreate their CSS inside an individual lesson.

```tsx
"use client";

import {
  DisplayMath,
  LessonSection,
  MathText,
  NotionLessonRenderer,
  Question,
  Step,
} from "@/components/notion-lesson-renderer";
import { NOTION_LESSON_DEFINITIONS } from "@/content/notion-lessons/definitions";

export function ExampleNativeLesson() {
  return (
    <NotionLessonRenderer
      definition={NOTION_LESSON_DEFINITIONS.exampleLesson}
      introduction={<p>Use the exact introduction from the source.</p>}
    >
      <LessonSection title="First source heading">
        <p>
          Preserve the source wording and use <MathText>{String.raw`f(x)`}</MathText> inline.
        </p>
        <DisplayMath>{String.raw`f(x)=x^2`}</DisplayMath>
      </LessonSection>

      <LessonSection title="Worked Examples">
        <Step number={1} title="Use the source step title.">
          <p>Keep every calculation in its original order.</p>
        </Step>
      </LessonSection>

      <LessonSection title="Practice Questions">
        <ol className="space-y-5">
          <Question number={1}>Keep the exact question text.</Question>
        </ol>
      </LessonSection>
    </NotionLessonRenderer>
  );
}
```

Then register the definition/component pair in `registry.ts`. That is the only workspace wiring required.

## Content rules

- Do not summarise, modernise, simplify, correct, omit, or add teaching content without explicit approval.
- Preserve headings, paragraphs, examples, questions, solutions, units, notation, and order.
- Use `MathText` for inline maths and `DisplayMath` for standalone maths. Never expose raw LaTeX to the student.
- Keep worked examples and their diagrams together. Do not introduce slides, carousels, tabs, or horizontal scrolling.
- Use `Step` only when the source presents ordered working. Use `Question` for numbered practice questions.
- Keep solutions after the complete practice-question section unless the source orders them differently.
- Use semantic HTML where practical: paragraphs for prose, ordered lists for questions, tables for genuine tabular relationships.

## Diagram rules

Read `docs/notion-preview-diagram-style.md` before adding or changing any diagram. Every diagram uses `NativeLessonDiagram`, includes a useful `aria-label`, and follows the website palette and label-spacing rules. Keep coordinates and full equations in the caption when an internal label would compete with a curve; use `NativeDiagramMathLabel` for mathematical tick labels.

## Per-page verification

Before approving a converted lesson:

1. Compare it against the source PDF from top to bottom.
2. Check every equation, sign, power, root, fraction, interval, coordinate, unit, and question number.
3. Check that diagrams appear beside the material they explain and remain legible on mobile.
4. Confirm the original PDF page still exists for the tutor/source archive.
5. Run `npm run lint`, `npx tsc --noEmit`, `git diff --check`, and `npm run build`.
