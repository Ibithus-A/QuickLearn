import { CompositeInverseFunctionsNativeLesson } from "@/components/composite-inverse-functions-native-lesson";
import { FunctionsModellingNativeLesson } from "@/components/functions-modelling-native-lesson";
import { GraphTransformationsNativeLesson } from "@/components/graph-transformations-native-lesson";
import { GraphsOfFunctionsNativeLesson } from "@/components/graphs-of-functions-native-lesson";
import { InequalitiesNativeLesson } from "@/components/inequalities-native-lesson";
import { LawsOfIndicesNativeLesson } from "@/components/laws-of-indices-native-lesson";
import { ModulusFunctionNativeLesson } from "@/components/modulus-function-native-lesson";
import { PartialFractionsNativeLesson } from "@/components/partial-fractions-native-lesson";
import { PolynomialsNativeLesson } from "@/components/polynomials-native-lesson";
import { QuadraticFunctionsNativeLesson } from "@/components/quadratic-functions-native-lesson";
import { SimultaneousEquationsNativeLesson } from "@/components/simultaneous-equations-native-lesson";
import { SurdsNativeLesson } from "@/components/surds-native-lesson";
import { NOTION_LESSON_DEFINITIONS } from "@/content/notion-lessons/definitions";
import type { NotionLessonDefinition } from "@/components/notion-lesson-renderer";
import type { ComponentType } from "react";

export type RegisteredNotionLesson = {
  definition: NotionLessonDefinition;
  Component: ComponentType;
};

const NOTION_LESSONS = [
  { definition: NOTION_LESSON_DEFINITIONS.lawsOfIndices, Component: LawsOfIndicesNativeLesson },
  { definition: NOTION_LESSON_DEFINITIONS.surds, Component: SurdsNativeLesson },
  { definition: NOTION_LESSON_DEFINITIONS.quadraticFunctions, Component: QuadraticFunctionsNativeLesson },
  { definition: NOTION_LESSON_DEFINITIONS.simultaneousEquations, Component: SimultaneousEquationsNativeLesson },
  { definition: NOTION_LESSON_DEFINITIONS.inequalities, Component: InequalitiesNativeLesson },
  { definition: NOTION_LESSON_DEFINITIONS.polynomials, Component: PolynomialsNativeLesson },
  { definition: NOTION_LESSON_DEFINITIONS.graphsOfFunctions, Component: GraphsOfFunctionsNativeLesson },
  { definition: NOTION_LESSON_DEFINITIONS.modulusFunction, Component: ModulusFunctionNativeLesson },
  { definition: NOTION_LESSON_DEFINITIONS.compositeInverseFunctions, Component: CompositeInverseFunctionsNativeLesson },
  { definition: NOTION_LESSON_DEFINITIONS.graphTransformations, Component: GraphTransformationsNativeLesson },
  { definition: NOTION_LESSON_DEFINITIONS.partialFractions, Component: PartialFractionsNativeLesson },
  { definition: NOTION_LESSON_DEFINITIONS.functionsModelling, Component: FunctionsModellingNativeLesson },
] satisfies RegisteredNotionLesson[];

function assertUniqueLessonField(
  field: "id" | "previewTitle" | "sourceTitle",
) {
  const values = new Set<string>();
  for (const lesson of NOTION_LESSONS) {
    const value = lesson.definition[field];
    if (values.has(value)) {
      throw new Error(`Duplicate Notion lesson ${field}: ${value}`);
    }
    values.add(value);
  }
}

assertUniqueLessonField("id");
assertUniqueLessonField("previewTitle");
assertUniqueLessonField("sourceTitle");

const lessonsByPreviewTitle = new Map(
  NOTION_LESSONS.map((lesson) => [lesson.definition.previewTitle, lesson]),
);

export function getNotionLesson(previewTitle: string | null | undefined) {
  return previewTitle ? lessonsByPreviewTitle.get(previewTitle) ?? null : null;
}

export function listNotionLessons(): readonly RegisteredNotionLesson[] {
  return NOTION_LESSONS;
}
