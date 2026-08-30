"use client";

import { NativeLessonDiagram } from "@/components/native-lesson-diagram";
import {
  DisplayMath,
  LessonSection,
  MathText,
  NotionLessonRenderer,
  Question,
} from "@/components/notion-lesson-renderer";
import { NOTION_LESSON_DEFINITIONS } from "@/content/notion-lessons/definitions";

function FactorDecompositionDiagram() {
  return (
    <NativeLessonDiagram
      caption={
        <>
          Each distinct linear factor supplies one denominator in the decomposition.
        </>
      }
    >
      <div
        role="img"
        aria-label="The fraction 1 over V times 25 minus V separates into A over V plus B over 25 minus V"
        className="py-3"
      >
        <p className="text-center text-lg text-zinc-900">
          <MathText>{String.raw`\frac1{V(25-V)}`}</MathText>
        </p>
        <svg viewBox="0 0 400 64" className="my-2 h-16 w-full" aria-hidden="true">
          <line x1="200" y1="4" x2="200" y2="22" stroke="#a1a1aa" strokeWidth="1.25" />
          <path d="M200 22L112 52M200 22L288 52" fill="none" stroke="#a1a1aa" strokeWidth="1.25" />
          <path d="M108 47L112 52L118 48M282 48L288 52L292 47" fill="none" stroke="#a1a1aa" strokeWidth="1.25" />
        </svg>
        <div className="grid grid-cols-2 gap-10 text-center text-lg text-zinc-900">
          <p><MathText>{String.raw`\frac A V`}</MathText></p>
          <p><MathText>{String.raw`\frac B{25-V}`}</MathText></p>
        </div>
      </div>
    </NativeLessonDiagram>
  );
}

function PolynomialPartDiagram() {
  return (
    <NativeLessonDiagram
      caption={
        <>
          Division extracts the polynomial part; the remaining proper fraction has a constant
          numerator.
        </>
      }
    >
      <div
        role="img"
        aria-label="The improper fraction x squared plus 3 over x minus 1 becomes the polynomial x plus 1 and the proper fraction 4 over x minus 1"
        className="grid grid-cols-[minmax(0,1fr)_92px_minmax(0,1.2fr)] items-center gap-3 py-8"
      >
        <p className="text-center text-base text-zinc-900 sm:text-lg">
          <MathText>{String.raw`\frac{x^2+3}{x-1}`}</MathText>
        </p>
        <div className="flex min-w-0 flex-col items-center gap-1" aria-hidden="true">
          <span className="text-xs font-medium text-zinc-600">divide first</span>
          <svg viewBox="0 0 64 8" className="h-2 w-full" preserveAspectRatio="none">
            <line x1="1" y1="4" x2="59" y2="4" stroke="#a1a1aa" strokeWidth="1.25" />
            <path d="M55 1L60 4L55 7" fill="none" stroke="#a1a1aa" strokeWidth="1.25" />
          </svg>
        </div>
        <p className="text-center text-base text-zinc-900 sm:text-lg">
          <MathText>{String.raw`x+1+\frac4{x-1}`}</MathText>
        </p>
      </div>
    </NativeLessonDiagram>
  );
}

export function PartialFractionsNativeLesson() {
  return (
    <NotionLessonRenderer
      definition={NOTION_LESSON_DEFINITIONS.partialFractions}
      introduction={
        <p>
          Decomposing a rational expression into partial fractions reverses the process of adding
          algebraic fractions. This technique is essential for integration and for binomial
          expansions of rational functions.
        </p>
      }
    >

      <LessonSection title="Partial Fraction Forms">
        <div className="divide-y divide-zinc-200 rounded-xl border border-zinc-200">
          <div className="px-4 py-5 sm:px-6">
            <p className="text-sm font-medium text-zinc-500">Distinct linear factors</p>
            <DisplayMath>
              {String.raw`\frac{px+q}{(ax+b)(cx+d)}=\frac A{ax+b}+\frac B{cx+d}`}
            </DisplayMath>
          </div>
          <div className="px-4 py-5 sm:px-6">
            <p className="text-sm font-medium text-zinc-500">Three distinct linear factors</p>
            <DisplayMath>
              {String.raw`\frac{px+q}{(ax+b)(cx+d)(ex+f)}=\frac A{ax+b}+\frac B{cx+d}+\frac C{ex+f}`}
            </DisplayMath>
          </div>
          <div className="px-4 py-5 sm:px-6">
            <p className="text-sm font-medium text-zinc-500">Repeated linear factor</p>
            <DisplayMath>
              {String.raw`\frac{px+q}{(ax+b)(cx+d)^2}=\frac A{ax+b}+\frac B{cx+d}+\frac C{(cx+d)^2}`}
            </DisplayMath>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 px-4 py-4 sm:px-6">
          <p>
            <span className="font-semibold text-zinc-900">Important:</span> If the degree of the
            numerator <MathText>{String.raw`\ge`}</MathText> the degree of the denominator, perform
            polynomial division first to extract a polynomial part before decomposing.
          </p>
        </div>

        <p>
          Constants are found by substituting convenient values of <MathText>x</MathText> (cover-up
          method) or by comparing coefficients.
        </p>
      </LessonSection>

      <LessonSection title="Worked Examples">
        <div className="rounded-xl border border-zinc-200 p-4 sm:p-6">
          <p className="font-semibold text-zinc-950">
            Express <MathText>{String.raw`\frac1{V(25-V)}`}</MathText> in partial fractions.
          </p>
          <p className="mt-5">Write</p>
          <DisplayMath>{String.raw`\frac1{V(25-V)}=\frac A V+\frac B{25-V}`}</DisplayMath>
          <FactorDecompositionDiagram />
          <p>Multiply through by <MathText>{String.raw`V(25-V)`}</MathText>:</p>
          <DisplayMath>{String.raw`1=A(25-V)+BV`}</DisplayMath>
          <div className="space-y-3 border-l-2 border-zinc-200 pl-4">
            <p>
              Set <MathText>{String.raw`V=0`}</MathText>:
              <MathText>{String.raw`1=25A`}</MathText>, so <MathText>{String.raw`A=\frac1{25}`}</MathText>.
            </p>
            <p>
              Set <MathText>{String.raw`V=25`}</MathText>:
              <MathText>{String.raw`1=25B`}</MathText>, so <MathText>{String.raw`B=\frac1{25}`}</MathText>.
            </p>
          </div>
          <p>Therefore</p>
          <DisplayMath>
            {String.raw`\frac1{V(25-V)}=\frac1{25V}+\frac1{25(25-V)}`}
          </DisplayMath>
        </div>

        <div className="mt-6 rounded-xl border border-zinc-200 p-4 sm:p-6">
          <p className="font-semibold text-zinc-950">
            Express <MathText>{String.raw`\frac{x^2+3}{x-1}`}</MathText> in the form
            <MathText>{String.raw`Ax+B+\frac C{x-1}`}</MathText> and find
            <MathText>{String.raw`A,B,C`}</MathText>.
          </p>
          <p className="mt-5">
            Since the degree of the numerator equals the degree of the denominator plus one, we
            perform division. Multiply out the identity:
          </p>
          <DisplayMath>{String.raw`x^2+3=(Ax+B)(x-1)+C`}</DisplayMath>
          <DisplayMath>{String.raw`=Ax^2-Ax+Bx-B+C`}</DisplayMath>
          <DisplayMath>{String.raw`=Ax^2+(B-A)x+(C-B)`}</DisplayMath>
          <p>Compare coefficients:</p>
          <div className="space-y-2 border-l-2 border-zinc-200 pl-4">
            <p><MathText>{String.raw`x^2:A=1`}</MathText>.</p>
            <p><MathText>{String.raw`x^1:B-A=0`}</MathText>, so <MathText>{String.raw`B=1`}</MathText>.</p>
            <p><MathText>{String.raw`x^0:C-B=3`}</MathText>, so <MathText>{String.raw`C=4`}</MathText>.</p>
          </div>
          <p>Therefore</p>
          <DisplayMath>{String.raw`\frac{x^2+3}{x-1}=x+1+\frac4{x-1}`}</DisplayMath>
          <PolynomialPartDiagram />
        </div>
      </LessonSection>

      <LessonSection title="Practice Questions">
        <ol className="space-y-5">
          <Question number={1}>
            Express <MathText>{String.raw`\frac{5x+1}{(x+1)(x-3)}`}</MathText> in partial fractions.
          </Question>
          <Question number={2}>
            Express <MathText>{String.raw`\frac{3x^2+2}{(x-1)(x+2)^2}`}</MathText> in partial fractions.
          </Question>
          <Question number={3}>
            Express <MathText>{String.raw`\frac{4x^2+3x-1}{x(2x-1)}`}</MathText> in the form
            <MathText>{String.raw`A+\frac Bx+\frac C{2x-1}`}</MathText>.
          </Question>
        </ol>
      </LessonSection>

      <LessonSection title="Solutions to Practice Questions">
        <div className="space-y-9">
          <div>
            <h3 className="font-semibold text-zinc-950">1.</h3>
            <DisplayMath>
              {String.raw`\frac{5x+1}{(x+1)(x-3)}=\frac A{x+1}+\frac B{x-3}`}
            </DisplayMath>
            <DisplayMath>{String.raw`5x+1=A(x-3)+B(x+1)`}</DisplayMath>
            <p>
              <MathText>{String.raw`x=3`}</MathText>:
              <MathText>{String.raw`16=4B`}</MathText>, <MathText>{String.raw`B=4`}</MathText>.
              <MathText>{String.raw`x=-1`}</MathText>:
              <MathText>{String.raw`-4=-4A`}</MathText>, <MathText>{String.raw`A=1`}</MathText>.
            </p>
            <DisplayMath>
              {String.raw`\frac{5x+1}{(x+1)(x-3)}=\frac1{x+1}+\frac4{x-3}`}
            </DisplayMath>
          </div>

          <div className="border-t border-zinc-200 pt-8">
            <h3 className="font-semibold text-zinc-950">2.</h3>
            <DisplayMath>
              {String.raw`\frac{3x^2+2}{(x-1)(x+2)^2}=\frac A{x-1}+\frac B{x+2}+\frac C{(x+2)^2}`}
            </DisplayMath>
            <DisplayMath>
              {String.raw`3x^2+2=A(x+2)^2+B(x-1)(x+2)+C(x-1)`}
            </DisplayMath>
            <div className="space-y-3 border-l-2 border-zinc-200 pl-4">
              <p>
                <MathText>{String.raw`x=1`}</MathText>: <MathText>{String.raw`5=9A`}</MathText>,
                <MathText>{String.raw`A=\frac59`}</MathText>.
              </p>
              <p>
                <MathText>{String.raw`x=-2`}</MathText>: <MathText>{String.raw`14=-3C`}</MathText>,
                <MathText>{String.raw`C=-\frac{14}3`}</MathText>.
              </p>
              <p>
                <MathText>{String.raw`x=0`}</MathText>:
                <MathText>{String.raw`2=4A-2B-C=\frac{20}9-2B+\frac{14}3`}</MathText>.
              </p>
            </div>
            <DisplayMath>
              {String.raw`2=\frac{20}9+\frac{42}9-2B=\frac{62}9-2B`}
            </DisplayMath>
            <DisplayMath>{String.raw`2B=\frac{62}9-2=\frac{44}9,\qquad B=\frac{22}9`}</DisplayMath>
            <DisplayMath>
              {String.raw`\frac{3x^2+2}{(x-1)(x+2)^2}=\frac5{9(x-1)}+\frac{22}{9(x+2)}-\frac{14}{3(x+2)^2}`}
            </DisplayMath>
          </div>

          <div className="border-t border-zinc-200 pt-8">
            <h3 className="font-semibold text-zinc-950">3.</h3>
            <DisplayMath>
              {String.raw`\frac{4x^2+3x-1}{x(2x-1)}=A+\frac Bx+\frac C{2x-1}`}
            </DisplayMath>
            <p>
              Since the degree of the numerator equals the degree of the denominator, we need the
              polynomial part <MathText>A</MathText>. Multiply:
            </p>
            <DisplayMath>
              {String.raw`4x^2+3x-1=A\cdot x(2x-1)+B(2x-1)+Cx`}
            </DisplayMath>
            <DisplayMath>{String.raw`=2Ax^2-Ax+2Bx-B+Cx`}</DisplayMath>
            <DisplayMath>{String.raw`=2Ax^2+(-A+2B+C)x-B`}</DisplayMath>
            <div className="space-y-2 border-l-2 border-zinc-200 pl-4">
              <p><MathText>{String.raw`x^2:2A=4`}</MathText>, <MathText>{String.raw`A=2`}</MathText>.</p>
              <p>Constant: <MathText>{String.raw`-B=-1`}</MathText>, <MathText>{String.raw`B=1`}</MathText>.</p>
              <p><MathText>{String.raw`x^1:-2+2+C=3`}</MathText>, <MathText>{String.raw`C=3`}</MathText>.</p>
            </div>
            <DisplayMath>
              {String.raw`\frac{4x^2+3x-1}{x(2x-1)}=2+\frac1x+\frac3{2x-1}`}
            </DisplayMath>
          </div>
        </div>
      </LessonSection>
    </NotionLessonRenderer>
  );
}
