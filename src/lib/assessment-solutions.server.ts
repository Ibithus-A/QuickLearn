import { CHAPTER_ONE_ASSESSMENT_KEY } from "@/lib/assessment-config";
import { parseAssessmentAnswer } from "@/lib/assessment-answer";

type MarkingContext = {
  answer: string;
  compact: string;
};

type Checkpoint = {
  marks: number;
  answerKey?: string;
  matches: (context: MarkingContext) => boolean;
};

type QuestionSolution = {
  maxMarks: number;
  pendingReviewMarks?: number;
  checkpoints: Checkpoint[];
};

export type QuestionScore = {
  marks: number;
  maxMarks: number;
  automatedMaxMarks: number;
  pendingReviewMarks: number;
};

export type AssessmentMarkingResult = {
  score: number;
  totalMarks: number;
  automatedTotalMarks: number;
  pendingReviewMarks: number;
  questionScores: Record<string, QuestionScore>;
  markingVersion: string;
};

export const ASSESSMENT_MARKING_VERSION = "chapter-1-v2-locked-answers";

function latexToPlain(value: string) {
  let next = value
    .toLowerCase()
    .replace(/\\left|\\right/g, "")
    .replace(/\\(?:,|;|!)/g, "")
    .replace(/\\cdot|\\times/g, "*")
    .replace(/\\pi/g, "pi")
    .replace(/\\sqrt\{([^{}]*)\}/g, "sqrt($1)");
  for (let pass = 0; pass < 4; pass += 1) {
    next = next.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, "($1)/($2)");
  }
  return next
    .replace(/\^\{([^{}]*)\}/g, "^($1)")
    .replace(/_\{([^{}]*)\}/g, "_($1)")
    .replace(/[{}]/g, "")
    .replace(/−/g, "-")
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/≤/g, "<=")
    .replace(/≥/g, ">=")
    .replace(/≠/g, "!=")
    .replace(/√/g, "sqrt");
}

function answerText(value: string) {
  return parseAssessmentAnswer(value)
    .map((segment) => segment.type === "text" ? segment.value : ` ${segment.latex} `)
    .join(" ");
}

function compactAnswer(value: string) {
  return latexToPlain(answerText(value))
    .replace(/²/g, "^2")
    .replace(/\s+/g, "")
    .replace(/[£,]/g, "")
    .replace(/\(([-+]?\d+(?:\.\d+)?)\)/g, "$1");
}

function hasAny(...aliases: string[]) {
  const normalizedAliases = aliases.map((alias) => compactAnswer(alias));
  return ({ compact }: MarkingContext) =>
    normalizedAliases.some((alias) => compact.includes(alias));
}

function exactOrAssignment(variable: string, ...values: string[]) {
  const normalizedValues = values.map((value) => compactAnswer(value));
  return ({ compact }: MarkingContext) =>
    normalizedValues.includes(compact) ||
    normalizedValues.some((value) => compact.includes(`${variable}=${value}`));
}

const chapterOneSolutions: Record<string, QuestionSolution> = {
  q1: { maxMarks: 2, checkpoints: [{ marks: 2, matches: exactOrAssignment("a", "3") }] },
  q2: {
    maxMarks: 5,
    checkpoints: [
      { marks: 1, answerKey: "q2_a_i", matches: hasAny("8sqrt(2)", "8√2") },
      { marks: 1, answerKey: "q2_a_ii", matches: hasAny("-7sqrt(2)", "-7√2") },
      { marks: 3, answerKey: "q2_b", matches: exactOrAssignment("t", "1/4", "0.25") },
    ],
  },
  q3: { maxMarks: 2, checkpoints: [{ marks: 2, matches: hasAny("(2x+y)(x-y)", "(x-y)(2x+y)") }] },
  q4: {
    maxMarks: 3,
    checkpoints: [
      { marks: 1, matches: exactOrAssignment("x", "2") },
      { marks: 2, matches: exactOrAssignment("x", "-26/3", "-8.6666666667") },
    ],
  },
  q5: { maxMarks: 4, checkpoints: [{ marks: 4, matches: hasAny("pi(7+5sqrt(2))", "π(7+5√2)") }] },
  q6: { maxMarks: 5, checkpoints: [{ marks: 5, matches: hasAny("2sqrt(5)", "2√5") }] },
  q7: { maxMarks: 3, checkpoints: [{ marks: 3, matches: hasAny("k>2") }] },
  q8: { maxMarks: 3, checkpoints: [{ marks: 3, matches: hasAny("1/4<=x<=11/4", "x∈[1/4,11/4]") }] },
  q9: {
    maxMarks: 5,
    pendingReviewMarks: 3,
    checkpoints: [
      { marks: 2, answerKey: "q9_b", matches: hasAny("x<=-2orx>=0", "x≤-2orx≥0", "(-infinity,-2]u[0,infinity)") },
    ],
  },
  q10: {
    maxMarks: 7,
    checkpoints: [
      { marks: 1, answerKey: "q10_a", matches: exactOrAssignment("a", "4") },
      { marks: 1, answerKey: "q10_a", matches: exactOrAssignment("b", "-3") },
      { marks: 2, answerKey: "q10_b", matches: hasAny("g(x)=3x^2+12") },
      { marks: 1, answerKey: "q10_b", matches: exactOrAssignment("p", "4") },
      { marks: 2, answerKey: "q10_b", matches: exactOrAssignment("q", "-51") },
    ],
  },
  q11: {
    maxMarks: 8,
    checkpoints: [
      { marks: 1, answerKey: "q11_a", matches: hasAny("f(1)=0") },
      { marks: 2, answerKey: "q11_b", matches: hasAny("(x-1)(x^2+4x-20)") },
      { marks: 2, answerKey: "q11_c", matches: ({ compact }) => compact.includes("x=1") && compact.includes("-2+2sqrt(6)") && compact.includes("-2-2sqrt(6)") },
      { marks: 3, answerKey: "q11_d", matches: hasAny("p=(-7,-8)", "(-7,-8)") },
    ],
  },
  q12: {
    maxMarks: 10,
    checkpoints: [
      { marks: 1, answerKey: "q12_a", matches: hasAny("fg(2)=1") },
      { marks: 2, answerKey: "q12_b", matches: ({ compact }) => ["g^-1(x)=(9x+5)/(2x)", "g^(-1)(x)=(9x+5)/(2x)"].some((form) => compact.includes(form)) && compact.includes("x!=0") },
      { marks: 2, answerKey: "q12_c_i", matches: hasAny("gf(x)=-5/(6x^2+1)") },
      { marks: 2, answerKey: "q12_c_ii", matches: hasAny("-5<=gf(x)<0", "[-5,0)") },
      { marks: 3, answerKey: "q12_d", matches: hasAny("k>29/5", "k>5.8") },
    ],
  },
  q13: {
    maxMarks: 4,
    checkpoints: [
      { marks: 2, matches: ({ compact }) => compact.includes("k=7") && (compact.includes("root=-3") || compact.includes("x=-3")) },
      { marks: 2, matches: ({ compact }) => compact.includes("k=-1") && (compact.includes("root=1") || compact.includes("x=1")) },
    ],
  },
  q14: {
    maxMarks: 6,
    checkpoints: [
      { marks: 3, answerKey: "q14_a", matches: hasAny("g(x)=9x^2-18x+8") },
      { marks: 3, answerKey: "q14_b", matches: hasAny("h(x)=2x^2+2x") },
    ],
  },
  q15: {
    maxMarks: 8,
    checkpoints: [
      { marks: 1, answerKey: "q15_a", matches: hasAny("y=mx+c") },
      { marks: 3, answerKey: "q15_b", matches: hasAny("y=0.84x+428") },
      { marks: 2, answerKey: "q15_c", matches: ({ answer }) => { const text = answer.toLowerCase(); return text.includes("0.84") && text.includes("cost") && text.includes("bar"); } },
      { marks: 2, answerKey: "q15_d", matches: hasAny("369") },
    ],
  },
};

const solutionBanks: Record<string, Record<string, QuestionSolution>> = {
  [CHAPTER_ONE_ASSESSMENT_KEY]: chapterOneSolutions,
};

export function markAssessmentAnswers(
  assessmentKey: string,
  answers: Record<string, string>,
  lockedQuestions: string[],
): AssessmentMarkingResult {
  const bank = solutionBanks[assessmentKey];
  if (!bank) throw new Error("Assessment solution bank not found.");

  const questionScores: Record<string, QuestionScore> = {};
  let score = 0;
  let totalMarks = 0;
  let automatedTotalMarks = 0;
  let pendingReviewMarks = 0;
  const lockedQuestionSet = new Set(lockedQuestions);

  for (const [questionKey, solution] of Object.entries(bank)) {
    const contextFor = (answerKey: string): MarkingContext => {
      const storedAnswer = lockedQuestionSet.has(questionKey)
        ? answers[answerKey] ?? (answerKey !== questionKey ? answers[questionKey] : "") ?? ""
        : "";
      return {
        answer: answerText(storedAnswer),
        compact: compactAnswer(storedAnswer),
      };
    };
    const marks = Math.min(
      solution.maxMarks,
      solution.checkpoints.reduce(
        (sum, checkpoint) => sum + (checkpoint.matches(contextFor(checkpoint.answerKey ?? questionKey)) ? checkpoint.marks : 0),
        0,
      ),
    );
    const questionPendingReviewMarks = solution.pendingReviewMarks ?? 0;
    const automatedMaxMarks = solution.maxMarks - questionPendingReviewMarks;
    questionScores[questionKey] = {
      marks,
      maxMarks: solution.maxMarks,
      automatedMaxMarks,
      pendingReviewMarks: questionPendingReviewMarks,
    };
    score += marks;
    totalMarks += solution.maxMarks;
    automatedTotalMarks += automatedMaxMarks;
    pendingReviewMarks += questionPendingReviewMarks;
  }

  return {
    score,
    totalMarks,
    automatedTotalMarks,
    pendingReviewMarks,
    questionScores,
    markingVersion: ASSESSMENT_MARKING_VERSION,
  };
}
