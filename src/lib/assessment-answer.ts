export type AssessmentAnswerSegment =
  | { type: "text"; value: string }
  | { type: "math"; latex: string };

type StoredAssessmentAnswer = {
  version: 1;
  segments: AssessmentAnswerSegment[];
};

const ANSWER_PREFIX = "excelora-answer-v1:";

export function parseAssessmentAnswer(value: string): AssessmentAnswerSegment[] {
  if (!value.startsWith(ANSWER_PREFIX)) {
    return value ? [{ type: "text", value }] : [];
  }
  try {
    const parsed = JSON.parse(value.slice(ANSWER_PREFIX.length)) as StoredAssessmentAnswer;
    if (parsed.version !== 1 || !Array.isArray(parsed.segments)) return [];
    return parsed.segments.filter(
      (segment): segment is AssessmentAnswerSegment =>
        Boolean(
          segment &&
            ((segment.type === "text" && typeof segment.value === "string") ||
              (segment.type === "math" && typeof segment.latex === "string")),
        ),
    );
  } catch {
    return [];
  }
}

export function encodeAssessmentAnswer(segments: AssessmentAnswerSegment[]) {
  const payload: StoredAssessmentAnswer = { version: 1, segments };
  return `${ANSWER_PREFIX}${JSON.stringify(payload)}`;
}

export function hasAssessmentAnswerContent(value: string | undefined) {
  if (!value) return false;
  return parseAssessmentAnswer(value).some((segment) =>
    segment.type === "math" ? Boolean(segment.latex.trim()) : Boolean(segment.value.trim()),
  );
}

export function assessmentAnswerLatex(value: string) {
  return parseAssessmentAnswer(value)
    .filter((segment): segment is Extract<AssessmentAnswerSegment, { type: "math" }> => segment.type === "math")
    .map((segment) => segment.latex);
}
