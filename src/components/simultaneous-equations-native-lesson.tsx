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


export function SimultaneousEquationsNativeLesson() {
  return (
    <NotionLessonRenderer
      definition={NOTION_LESSON_DEFINITIONS.simultaneousEquations}
      introduction={
        <p>
          Simultaneous equations involving one linear and one quadratic equation are solved by
          substitution: rearrange the linear equation and substitute into the quadratic. The
          resulting equation may have two solutions, one solution (the line is tangent to the
          curve), or no solutions (the line and curve do not intersect).
        </p>
      }
    >

      <LessonSection title="Method for Simultaneous Equations (One Linear, One Quadratic)">
        <div className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 sm:p-6">
          <Step number={1} title="Rearrange the linear equation for one variable.">
            {null}
          </Step>
          <Step number={2} title="Substitute into the quadratic equation to obtain a single equation in one unknown.">
            {null}
          </Step>
          <Step number={3} title="Solve the resulting quadratic.">
            {null}
          </Step>
          <Step number={4} title="Substitute back to find the other variable.">
            {null}
          </Step>
        </div>

        <p>
          The number of intersection points corresponds to the discriminant of the resulting
          quadratic: <MathText>{String.raw`\Delta>0`}</MathText> gives two points,
          <MathText>{String.raw`\Delta=0`}</MathText> gives tangency,
          <MathText>{String.raw`\Delta<0`}</MathText> gives no intersection.
        </p>
      </LessonSection>

      <LessonSection title="Worked Examples">
        <div className="rounded-xl border border-zinc-200 p-4 sm:p-6">
          <p className="font-semibold text-zinc-950">
            Solve simultaneously: <MathText>{String.raw`y=2x+3`}</MathText> and
            <MathText>{String.raw`y=x^2-4x+8`}</MathText>.
          </p>

          <div className="mt-6 space-y-5">
            <Step number={1} title="Set the two expressions for y equal:">
              <DisplayMath>{String.raw`x^2-4x+8=2x+3`}</DisplayMath>
            </Step>
            <Step number={2} title="Rearrange to standard form:">
              <DisplayMath>{String.raw`x^2-6x+5=0`}</DisplayMath>
              <DisplayMath>{String.raw`(x-1)(x-5)=0`}</DisplayMath>
              <p>
                So <MathText>{String.raw`x=1`}</MathText> or <MathText>{String.raw`x=5`}</MathText>.
              </p>
            </Step>
            <Step number={3} title="Find corresponding y values using y = 2x + 3:">
              <p>
                When <MathText>{String.raw`x=1`}</MathText>: <MathText>{String.raw`y=5`}</MathText>.
                When <MathText>{String.raw`x=5`}</MathText>: <MathText>{String.raw`y=13`}</MathText>.
              </p>
              <p>The solutions are <MathText>{String.raw`(1,5)`}</MathText> and <MathText>{String.raw`(5,13)`}</MathText>.</p>
            </Step>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-zinc-200 p-4 sm:p-6">
          <p className="font-semibold text-zinc-950">
            The line <MathText>{String.raw`y=2x+c`}</MathText> is tangent to the curve
            <MathText>{String.raw`y=x^2+6x+7`}</MathText>. Using the discriminant, find the value of
            <MathText>c</MathText> and the coordinates of the point of contact.
          </p>

          <div className="mt-6 space-y-5">
            <Step number={1} title="At the point of tangency the equations are equal:">
              <DisplayMath>{String.raw`x^2+6x+7=2x+c`}</DisplayMath>
              <DisplayMath>{String.raw`x^2+4x+7-c=0`}</DisplayMath>
            </Step>
            <Step number={2} title="For tangency, the discriminant equals zero:">
              <DisplayMath>{String.raw`\Delta=16-4(7-c)=0`}</DisplayMath>
              <DisplayMath>{String.raw`16-28+4c=0`}</DisplayMath>
              <DisplayMath>{String.raw`4c=12`}</DisplayMath>
              <DisplayMath>{String.raw`c=3`}</DisplayMath>
            </Step>
            <Step number={3} title="Find the point of contact. With c = 3:">
              <DisplayMath>{String.raw`x^2+4x+4=0`}</DisplayMath>
              <DisplayMath>{String.raw`(x+2)^2=0\implies x=-2`}</DisplayMath>
              <p>
                Then <MathText>{String.raw`y=2(-2)+3=-1`}</MathText>. The point of contact is
                <MathText>{String.raw`(-2,-1)`}</MathText>.
              </p>
            </Step>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="Practice Questions">
        <ol className="space-y-5">
          <Question number={1}>
            Solve: <MathText>{String.raw`2x-3y=6`}</MathText> and
            <MathText>{String.raw`x^2-y^2+3x=50`}</MathText>.
          </Question>
          <Question number={2}>
            The line <MathText>{String.raw`y=5x+k`}</MathText> intersects the curve
            <MathText>{String.raw`y=4x^2-7x+11`}</MathText> at two distinct points. Show that
            <MathText>{String.raw`k>2`}</MathText>.
          </Question>
          <Question number={3}>
            Solve simultaneously: <MathText>{String.raw`x+y=5`}</MathText> and
            <MathText>{String.raw`x^2+y^2=13`}</MathText>.
          </Question>
        </ol>
      </LessonSection>

      <LessonSection title="Solutions to Practice Questions">
        <div className="space-y-9">
          <div>
            <h3 className="font-semibold text-zinc-950">
              1. Solve: <MathText>{String.raw`2x-3y=6`}</MathText> and
              <MathText>{String.raw`x^2-y^2+3x=50`}</MathText>.
            </h3>
            <p className="mt-3">
              From the linear equation: <MathText>{String.raw`x=\frac{6+3y}{2}`}</MathText>.
            </p>
            <p>Substitute into the quadratic:</p>
            <DisplayMath>
              {String.raw`\left(\frac{6+3y}{2}\right)^2-y^2+3\left(\frac{6+3y}{2}\right)=50`}
            </DisplayMath>
            <p>Expand:</p>
            <DisplayMath>
              {String.raw`\frac{36+36y+9y^2}{4}-y^2+\frac{18+9y}{2}=50`}
            </DisplayMath>
            <p>Multiply through by 4:</p>
            <DisplayMath>{String.raw`36+36y+9y^2-4y^2+36+18y=200`}</DisplayMath>
            <DisplayMath>{String.raw`5y^2+54y+72=200`}</DisplayMath>
            <DisplayMath>{String.raw`5y^2+54y-128=0`}</DisplayMath>
            <DisplayMath>{String.raw`(5y+64)(y-2)=0`}</DisplayMath>
            <p>
              <MathText>{String.raw`y=2`}</MathText> or <MathText>{String.raw`y=-\frac{64}{5}`}</MathText>.
            </p>
            <p>
              When <MathText>{String.raw`y=2`}</MathText>: <MathText>{String.raw`x=6`}</MathText>.
              When <MathText>{String.raw`y=-\frac{64}{5}`}</MathText>:
              <MathText>{String.raw`x=-\frac{81}{5}`}</MathText>.
            </p>
            <p>
              Solutions: <MathText>{String.raw`(6,2)`}</MathText> and
              <MathText>{String.raw`\left(-\frac{81}{5},-\frac{64}{5}\right)`}</MathText>.
            </p>
          </div>

          <div className="border-t border-zinc-200 pt-8">
            <h3 className="font-semibold text-zinc-950">
              2. The line <MathText>{String.raw`y=5x+k`}</MathText> intersects
              <MathText>{String.raw`y=4x^2-7x+11`}</MathText> at two distinct points. Show that
              <MathText>{String.raw`k>2`}</MathText>.
            </h3>
            <p className="mt-3">
              Set equal: <MathText>{String.raw`4x^2-7x+11=5x+k`}</MathText>, giving
              <MathText>{String.raw`4x^2-12x+(11-k)=0`}</MathText>.
            </p>
            <p>For two distinct intersections, <MathText>{String.raw`\Delta>0`}</MathText>:</p>
            <DisplayMath>{String.raw`(-12)^2-4(4)(11-k)>0`}</DisplayMath>
            <DisplayMath>{String.raw`144-176+16k>0`}</DisplayMath>
            <DisplayMath>{String.raw`16k>32`}</DisplayMath>
            <DisplayMath>{String.raw`k>2`}</DisplayMath>
          </div>

          <div className="border-t border-zinc-200 pt-8">
            <h3 className="font-semibold text-zinc-950">
              3. Solve simultaneously: <MathText>{String.raw`x+y=5`}</MathText> and
              <MathText>{String.raw`x^2+y^2=13`}</MathText>.
            </h3>
            <p className="mt-3">
              From the first equation: <MathText>{String.raw`y=5-x`}</MathText>. Substitute:
            </p>
            <DisplayMath>{String.raw`x^2+(5-x)^2=13`}</DisplayMath>
            <DisplayMath>{String.raw`x^2+25-10x+x^2=13`}</DisplayMath>
            <DisplayMath>{String.raw`2x^2-10x+12=0`}</DisplayMath>
            <DisplayMath>{String.raw`x^2-5x+6=0`}</DisplayMath>
            <DisplayMath>{String.raw`(x-2)(x-3)=0`}</DisplayMath>
            <p>
              <MathText>{String.raw`x=2,y=3`}</MathText> or
              <MathText>{String.raw`x=3,y=2`}</MathText>.
            </p>
          </div>
        </div>
      </LessonSection>
    </NotionLessonRenderer>
  );
}
