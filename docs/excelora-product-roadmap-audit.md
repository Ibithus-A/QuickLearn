# Excelora Product Roadmap Audit

Generated from the product review conversation on April 17, 2026.

## Current Product Issues

### 1. Arthur chats are not persisted

Arthur works per session, but conversations disappear when the page changes, refreshes, or the assistant resets. This means students cannot review previous help, tutors cannot inspect student misconceptions, and Arthur cannot build continuity across a topic.

Status: intentional for now. Address later when cloud persistence is affordable.

### 2. Student progress tracking is too shallow

Progress is mostly chapter/subtopic access and local watched/completed state. It does not properly track question attempts, assessment results, time spent, repeated mistakes, confidence, Arthur usage, cross-device completion, or tutor-visible learning history.

Status: UI can be added locally for now, but durable dynamic tracking needs cloud storage.

### 3. No real assessment workflow

Students can view assessment PDFs, but there is no structured answering, marking, score capture, attempt history, or tutor feedback loop.

Status: same as progress tracking. UI can be prototyped locally; real attempts need persistence.

### 4. Arthur is not assessment-aware enough

Arthur should know whether it should explain, hint, mark, avoid giving a full solution immediately, or generate similar practice questions.

Status: work on this together. Candidate approach: add a Markdown instruction file that defines Arthur's behaviour by context.

### 5. Math input is still not a true editor

The custom math builder has improved, but complex nested expressions and editing inserted maths remain fragile compared with a mature math editor.

Status: priority item. Continue fixing the math input editor thoroughly.

### 6. No durable user data model

Without cloud persistence, there is no proper source of truth for students, tutors, plans/access, lesson progress, assessment attempts, Arthur chats, analytics, or saved notes.

Status: user says this has already been addressed.

### 7. Tutor dashboard is not operational enough

The dashboard can show students and access, but should become the tutor command centre: progress summaries, assessment scores, recent activity, weak topics, Arthur questions, inactivity, and recommended tutor actions.

Status: no cloud makes this difficult. Work on what can be done locally or UI-first.

### 8. PDF-first course content limits interactivity

PDFs are quick to ship, but limit tracking and personalization. It is hard to know where a student paused, which worked example confused them, or what step they understood.

Status: intentional for now.

### 9. Mobile and narrow-panel experiences need polish

Arthur, PDF viewing, math input, and assessment workflows are constrained on smaller screens.

Status: fix thoroughly, even though phone use is not a primary target.

### 10. No analytics or observability

The product needs visibility into drop-off, common Arthur questions, assessment difficulty, UI failures, PDF loading issues, and AI call errors.

Status: later feature.

## Recommended Plan

### Phase 1: Stabilise the core product

Define the backend schema when cloud access is available. Minimum tables should include profiles, students, tutor-student links, chapter access, lesson progress, assessment attempts, assessment answers, Arthur chats, Arthur messages, student notes, and activity events.

Move progress out of local storage when possible. Keep local storage as a fallback only.

Persist Arthur chats once storage exists. Each page, lesson, and assessment should have a thread per student.

Add clear error/loading states for Arthur, including failed API calls, missing PDF context, assessment PDF not found, no saved chat available, and offline/local-only mode.

### Phase 2: Make assessments real

Create a structured assessment workspace with question list, answer input per question, working area, submit button, saved draft answers, optional timer, and completion state.

Store assessment attempts with student ID, chapter ID, answers, score, feedback, timestamp, and attempt number.

Give Arthur assessment modes: Hint mode, Explain mode, Mark mode, and Practice mode. Assessments should default to hint-first rather than full-solution-first.

Build a tutor marking workflow for submitted assessments, unmarked work, score history, weak questions, feedback, and resubmission status.

### Phase 3: Improve learning intelligence

Track skill mastery for topics such as sequences, differentiation, integration, trig equations, proof, vectors, logs, and exponentials.

Have Arthur tag misconceptions such as algebra slips, chain rule errors, notation confusion, exam technique issues, and arithmetic errors.

Build a student dashboard showing current chapter, completed lessons, assessment scores, weak areas, recommended next lesson, and Arthur chat history.

Build a tutor dashboard v2 showing progress heatmaps, chapter access, latest activity, assessment results, Arthur question history, and recommended interventions.

### Phase 4: Upgrade math input

Decide whether to use a real math editor such as MathLive or continue hardening the custom builder.

Make inserted math editable. Clicking a math token should reopen the builder with existing values.

Support nested expressions such as e^(2x), sin(3x + 1), (x + 1)/(x - 2), definite integrals, and product-rule expressions.

### Phase 5: Product polish

Improve the PDF viewer with smoother zoom, fit-width, fit-page, page navigation, search, and eventually annotations.

Make Arthur feel consistent with smoother panel transitions, persistent chat, better narrow-screen behaviour, context labels, and clear PDF-reading status.

Add observability for AI calls, PDF extraction, page load failures, assessment submissions, and common Arthur topics.

Add admin tools for creating students, resetting passwords/invites, assigning access, viewing as tutor, exporting progress, and managing assessment attempts.

## MVP Backend Schema

profiles:
- id
- email
- name
- role
- plan
- created_at

student_progress:
- id
- student_id
- chapter_title
- lesson_title
- status
- completed_at
- updated_at

assessment_attempts:
- id
- student_id
- chapter_title
- status
- score
- submitted_at
- created_at

assessment_answers:
- id
- attempt_id
- question_number
- answer_text
- feedback
- marks_awarded
- max_marks

arthur_threads:
- id
- student_id
- page_node_id
- page_title
- pdf_title
- created_at
- updated_at

arthur_messages:
- id
- thread_id
- role
- content
- created_at

activity_events:
- id
- student_id
- event_type
- chapter_title
- lesson_title
- metadata
- created_at

## Main Product Risk

Excelora currently looks like a full learning platform, but some of the most important behaviours are still session-based rather than student-history-based.

The next major step is persistence plus assessment workflow. Once those are in place, Arthur, the dashboard, and progress tracking become much more meaningful.

