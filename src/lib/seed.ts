import type { FlowNode, FlowState } from "@/types/flowstate";

function makeNode(
  id: string,
  kind: "page" | "folder",
  title: string,
  parentId: string | null,
  childrenIds: string[],
  content: string,
  isExpanded = true,
  isLocked = false,
): FlowNode {
  const now = Date.now();
  return {
    id,
    kind,
    title,
    parentId,
    childrenIds,
    content,
    isLocked,
    isUnlockedOverride: false,
    isExpanded,
    createdAt: now,
    updatedAt: now,
  };
}

export function createSeedState(): FlowState {
  const nodes: Record<string, FlowNode> = {
    "getting-started": makeNode(
      "getting-started",
      "page",
      "Getting Started",
      null,
      [],
      `Welcome to QuickLearn 👋

This is your starter page.

What you can do:
- Create pages and folders
- Nest them infinitely
- Write notes in the editor
- Everything saves locally in your browser`,
      true,
    ),

    work: makeNode(
      "work",
      "folder",
      "Work",
      null,
      ["roadmap", "research"],
      "A folder can also hold notes, links, or context for a project.",
      true,
    ),

    roadmap: makeNode(
      "roadmap",
      "page",
      "Product Roadmap",
      "work",
      [],
      `Q1
- Polish onboarding
- Add keyboard shortcuts

Q2
- Search
- Drag and drop reordering`,
      true,
    ),

    research: makeNode(
      "research",
      "folder",
      "Research",
      "work",
      ["competitors"],
      "Use nested folders for organized research notes.",
      true,
    ),

    competitors: makeNode(
      "competitors",
      "page",
      "Competitor Notes",
      "research",
      [],
      `Notion
- Great editor UX
- Excellent templates

RemNote
- Strong knowledge graph and spaced repetition`,
      true,
    ),

    personal: makeNode(
      "personal",
      "page",
      "Personal",
      null,
      ["ideas"],
      "Personal planning, journaling, and life admin.",
      true,
    ),

    ideas: makeNode(
      "ideas",
      "folder",
      "Ideas",
      "personal",
      ["startup-ideas"],
      "Capture thoughts quickly here.",
      true,
    ),

    "startup-ideas": makeNode(
      "startup-ideas",
      "page",
      "Startup Ideas",
      "ideas",
      [],
      `- AI study planner
- Niche CRM for creators
- Voice-first note capture`,
      true,
    ),
  };

  return {
    nodes,
    rootIds: ["getting-started", "work", "personal"],
    selectedId: "getting-started",
  };
}
