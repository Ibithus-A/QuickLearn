import type { FlowNode, FlowState } from "@/types/flowstate";

export const A_LEVEL_MATHS_TITLE = "A Level Maths";
export const END_OF_TOPIC_ASSESSMENT_TITLE = "End Of Topic Assessment";

type ChapterDef = {
  title: string;
  subtopics: string[];
};

export const A_LEVEL_MATHS_CHAPTERS: ChapterDef[] = [
  {
    title: "Chapter 1: Algebra 1",
    subtopics: [
      "1.1 Surds",
      "1.2 Indices",
      "1.3 Quadratic Functions",
      "1.4 Completing The Square",
      "1.5 Simultaneous Equations",
      "1.6 Inequalities",
      "1.7 Graph Transformations",
    ],
  },
  {
    title: "Chapter 2: Algebra 2",
    subtopics: [
      "2.1 Partial Fractions",
      "2.2 The Factor Theorem",
      "2.3 Functions",
      "2.4 Composite And Inverse Functions",
      "2.5 The Binomial Expansion",
    ],
  },
  {
    title: "Chapter 3: Coordinate Geometry",
    subtopics: [
      "3.1 Straight-Line Graphs",
      "3.2 Parallel And Perpendicular Lines",
      "3.3 Circles",
      "3.4 Intersections Of Lines And Circles",
    ],
  },
  {
    title: "Chapter 4: Calculus 1",
    subtopics: [
      "4.1 Differentiation",
      "4.2 Tangents And Normals",
      "4.3 Stationary Points And Optimisation",
      "4.4 Integration",
      "4.5 Areas Under Curves",
    ],
  },
  {
    title: "Chapter 5: Trigonometry",
    subtopics: [
      "5.1 Radian Measure",
      "5.2 Trigonometric Graphs",
      "5.3 Trigonometric Identities",
      "5.4 Trigonometric Equations",
      "5.5 Trigonometric Modelling",
    ],
  },
  {
    title: "Chapter 6: Vectors",
    subtopics: [
      "6.1 Vectors In Two Dimensions",
      "6.2 Magnitude And Direction",
      "6.3 Vector Geometry",
    ],
  },
  {
    title: "Chapter 7: Units And Kinematics",
    subtopics: [
      "7.1 Quantities And Units",
      "7.2 Displacement, Velocity And Acceleration",
      "7.3 Constant Acceleration (SUVAT)",
      "7.4 Graphs Of Motion",
    ],
  },
  {
    title: "Chapter 8: Forces And Newton's Laws",
    subtopics: [
      "8.1 Forces And Resultants",
      "8.2 Newton's Laws Of Motion",
      "8.3 Friction",
      "8.4 Connected Particles",
    ],
  },
  {
    title: "Chapter 9: Working With Data",
    subtopics: [
      "9.1 Sampling",
      "9.2 Data Presentation",
      "9.3 Interpreting Data",
      "9.4 Outliers",
    ],
  },
  {
    title: "Chapter 10: Statistical Measures",
    subtopics: [
      "10.1 Measures Of Location",
      "10.2 Measures Of Spread",
      "10.3 Coding And Grouped Data",
      "10.4 Standard Deviation",
    ],
  },
  {
    title: "Chapter 11: Probability And Statistical Distributions",
    subtopics: [
      "11.1 Probability",
      "11.2 The Binomial Distribution",
      "11.3 The Normal Distribution",
    ],
  },
  {
    title: "Chapter 12: Algebra 3",
    subtopics: [
      "12.1 Proof",
      "12.2 Algebraic Fractions",
      "12.3 Partial Fractions (Further)",
      "12.4 The Binomial Expansion (Further)",
    ],
  },
  {
    title: "Chapter 13: Calculus 2",
    subtopics: [
      "13.1 The Chain Rule",
      "13.2 The Product Rule",
      "13.3 The Quotient Rule",
      "13.4 Implicit Differentiation",
      "13.5 Parametric Differentiation",
    ],
  },
  {
    title: "Chapter 14: Trigonometry 2",
    subtopics: [
      "14.1 Trigonometric Identities (Further)",
      "14.2 Trig Equations (Further)",
      "14.3 R sin(theta +/- alpha) / R cos(theta +/- alpha)",
      "14.4 Addition Formulae",
      "14.5 Double-Angle Formulae",
    ],
  },
  {
    title: "Chapter 15: Calculus 3",
    subtopics: [
      "15.1 Integration By Substitution",
      "15.2 Integration By Parts",
      "15.3 Integration Using Partial Fractions",
      "15.4 The Trapezium Rule",
      "15.5 Differential Equations",
    ],
  },
  {
    title: "Chapter 16: Vectors 2",
    subtopics: [
      "16.1 Vectors In Three Dimensions",
      "16.2 Vector Equations Of Lines",
      "16.3 The Scalar Product",
    ],
  },
  {
    title: "Chapter 17: Numerical Methods",
    subtopics: [
      "17.1 Locating Roots",
      "17.2 Iteration",
      "17.3 Newton-Raphson",
    ],
  },
  {
    title: "Chapter 18: Motion In Two Dimensions",
    subtopics: [
      "18.1 Kinematics In Two Dimensions",
      "18.2 Projectile Motion",
      "18.3 Forces In Two Dimensions",
    ],
  },
  {
    title: "Chapter 19: Momentum And Collisions",
    subtopics: [
      "19.1 Momentum And Impulse",
      "19.2 Conservation Of Momentum",
      "19.3 Collisions And Coefficient Of Restitution",
    ],
  },
  {
    title: "Chapter 20: Statistics 2",
    subtopics: ["20.1 Regression And Correlation", "20.2 The Poisson Distribution"],
  },
  {
    title: "Chapter 21: Hypothesis Testing 2",
    subtopics: [
      "21.1 Hypothesis Tests (Further)",
      "21.2 Tests Using The Poisson Distribution",
      "21.3 Tests For Correlation And Regression",
    ],
  },
];

function makeNode(
  id: string,
  kind: "page" | "folder",
  title: string,
  parentId: string | null,
  content: string,
): FlowNode {
  const now = Date.now();
  return {
    id,
    kind,
    title,
    parentId,
    childrenIds: [],
    content,
    isLocked: false,
    isUnlockedOverride: false,
    isExpanded: true,
    createdAt: now,
    updatedAt: now,
  };
}

function normalizeTitle(title: string) {
  return title.trim().toLowerCase();
}

export const A_LEVEL_MATHS_CHAPTER_TITLES = A_LEVEL_MATHS_CHAPTERS.map(
  (chapter) => chapter.title,
);

function makeNodeId(title: string, nodes: Record<string, FlowNode>, seed: { value: number }) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  while (true) {
    seed.value += 1;
    const id = `${slug || "node"}-${seed.value}`;
    if (!nodes[id]) return id;
  }
}

function cloneState(state: FlowState): FlowState {
  return {
    ...state,
    nodes: Object.fromEntries(
      Object.entries(state.nodes).map(([id, node]) => [
        id,
        {
          ...node,
          childrenIds: [...node.childrenIds],
        },
      ]),
    ),
    rootIds: [...state.rootIds],
  };
}

export function insertALevelMathsTree(state: FlowState): FlowState {
  const next = cloneState(state);
  const seed = { value: Object.keys(next.nodes).length };

  const createFolder = (title: string, parentId: string | null) => {
    const id = makeNodeId(title, next.nodes, seed);
    next.nodes[id] = makeNode(id, "folder", title, parentId, "");

    if (parentId) {
      next.nodes[parentId].childrenIds.push(id);
    } else {
      next.rootIds.push(id);
    }

    return id;
  };

  const createPage = (title: string, parentId: string) => {
    const id = makeNodeId(title, next.nodes, seed);
    next.nodes[id] = makeNode(
      id,
      "page",
      title,
      parentId,
      "Use this space for notes and examples.",
    );
    next.nodes[parentId].childrenIds.push(id);
    return id;
  };

  const existingCourseRootId = next.rootIds.find((rootId) => {
    const title = next.nodes[rootId]?.title;
    return title ? normalizeTitle(title) === normalizeTitle(A_LEVEL_MATHS_TITLE) : false;
  });

  const courseRootId = existingCourseRootId ?? createFolder(A_LEVEL_MATHS_TITLE, null);

  for (const chapter of A_LEVEL_MATHS_CHAPTERS) {
    const existingChapterId = next.nodes[courseRootId]?.childrenIds.find((childId) => {
      const child = next.nodes[childId];
      return child?.kind === "folder" && normalizeTitle(child.title) === normalizeTitle(chapter.title);
    });

    const chapterId = existingChapterId ?? createFolder(chapter.title, courseRootId);

    for (const subtopic of chapter.subtopics) {
      const hasSubtopic = next.nodes[chapterId]?.childrenIds.some((childId) => {
        const child = next.nodes[childId];
        return child?.kind === "page" && normalizeTitle(child.title) === normalizeTitle(subtopic);
      });
      if (!hasSubtopic) {
        createPage(subtopic, chapterId);
      }
    }

    const hasAssessment = next.nodes[chapterId]?.childrenIds.some((childId) => {
      const child = next.nodes[childId];
      return (
        child?.kind === "page" &&
        normalizeTitle(child.title) === normalizeTitle(END_OF_TOPIC_ASSESSMENT_TITLE)
      );
    });
    if (!hasAssessment) {
      createPage(END_OF_TOPIC_ASSESSMENT_TITLE, chapterId);
    }
  }

  if (!next.selectedId) {
    next.selectedId = courseRootId;
  }

  return next;
}

export function createSeedState(): FlowState {
  return insertALevelMathsTree({
    nodes: {},
    rootIds: [],
    selectedId: null,
  });
}
