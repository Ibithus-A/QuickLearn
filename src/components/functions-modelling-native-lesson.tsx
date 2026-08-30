"use client";

import { NativeLessonDiagram, NativePlotSvg } from "@/components/native-lesson-diagram";
import {
  DisplayMath,
  LessonSection,
  MathText,
  NotionLessonRenderer,
  Question,
  Step,
} from "@/components/notion-lesson-renderer";
import { NOTION_LESSON_DEFINITIONS } from "@/content/notion-lessons/definitions";

function CostModelDiagram() {
  return (
    <NativeLessonDiagram
      caption={
        <>
          The two cost observations determine the line
          <MathText>{String.raw`y=0.84x+428`}</MathText>. Its <MathText>y</MathText>-intercept is the
          fixed cost, £428.
        </>
      }
    >
      <NativePlotSvg
        role="img"
        aria-label="Linear factory cost model through 300 bars and 680 pounds, and 800 bars and 1100 pounds, with fixed cost 428 pounds"
      >
        <line x1="62" y1="204" x2="364" y2="204" stroke="#a1a1aa" strokeWidth="1.25" />
        <line x1="62" y1="218" x2="62" y2="32" stroke="#a1a1aa" strokeWidth="1.25" />
        <line x1="160" y1="106" x2="160" y2="204" stroke="#d4d4d8" strokeWidth="1.25" strokeDasharray="4 4" />
        <line x1="318" y1="46" x2="318" y2="204" stroke="#d4d4d8" strokeWidth="1.25" strokeDasharray="4 4" />
        <path d="M62 142 L350 32" fill="none" stroke="#18181b" strokeWidth="2.25" strokeLinecap="round" />
        <circle cx="62" cy="142" r="3.5" fill="#71717a" />
        <circle cx="160" cy="106" r="3.5" fill="#18181b" />
        <circle cx="318" cy="46" r="3.5" fill="#18181b" />
        <text x="50" y="146" textAnchor="end" fontSize="12" fill="#52525b">428</text>
        <text x="160" y="228" textAnchor="middle" fontSize="12" fill="#52525b">300</text>
        <text x="318" y="228" textAnchor="middle" fontSize="12" fill="#52525b">800</text>
        <text x="374" y="208" fontSize="13" fill="#52525b">x</text>
        <text x="70" y="25" fontSize="12" fill="#52525b">cost (£), y</text>
      </NativePlotSvg>
    </NativeLessonDiagram>
  );
}

function ProjectileModelDiagram() {
  return (
    <NativeLessonDiagram
      caption={
        <>
          <MathText>{String.raw`H=-0.03(x-9)^2+4.43`}</MathText>. The model starts at
          <MathText>{String.raw`(0,2)`}</MathText>, reaches its maximum at
          <MathText>{String.raw`(9,4.43)`}</MathText>, and gives
          <MathText>{String.raw`H=0.8`}</MathText> when <MathText>{String.raw`x=20`}</MathText>.
        </>
      }
    >
      <NativePlotSvg
        role="img"
        aria-label="Downward projectile parabola beginning at 0 comma 2, reaching a maximum at 9 comma 4 point 43, and ending at 20 comma 0 point 8"
      >
        <line x1="62" y1="204" x2="364" y2="204" stroke="#a1a1aa" strokeWidth="1.25" />
        <line x1="62" y1="218" x2="62" y2="32" stroke="#a1a1aa" strokeWidth="1.25" />
        <line x1="192" y1="48" x2="192" y2="204" stroke="#d4d4d8" strokeWidth="1.25" strokeDasharray="4 4" />
        <line x1="350" y1="176" x2="350" y2="204" stroke="#d4d4d8" strokeWidth="1.25" strokeDasharray="4 4" />
        <path d="M62 134 Q206 -56 350 176" fill="none" stroke="#18181b" strokeWidth="2.25" strokeLinecap="round" />
        <circle cx="62" cy="134" r="3.5" fill="#18181b" />
        <circle cx="192" cy="48" r="3.5" fill="#18181b" />
        <circle cx="350" cy="176" r="3.5" fill="#18181b" />
        <text x="50" y="138" textAnchor="end" fontSize="12" fill="#52525b">2</text>
        <text x="192" y="228" textAnchor="middle" fontSize="12" fill="#52525b">9</text>
        <text x="350" y="228" textAnchor="middle" fontSize="12" fill="#52525b">20</text>
        <text x="374" y="208" fontSize="13" fill="#52525b">x</text>
        <text x="70" y="25" fontSize="12" fill="#52525b">height, H</text>
      </NativePlotSvg>
    </NativeLessonDiagram>
  );
}

export function FunctionsModellingNativeLesson() {
  return (
    <NotionLessonRenderer
      definition={NOTION_LESSON_DEFINITIONS.functionsModelling}
      introduction={
        <p>
          Functions are used to model real-world situations. Students should be able to set up
          function models, interpret their outputs, and consider limitations and refinements.
          Common modelling contexts include: direct and inverse proportion, quadratic models for
          projectile motion, and reciprocal models for inverse proportion.
        </p>
      }
    >

      <LessonSection title="Common Function Models">
        <div className="divide-y divide-zinc-200 rounded-xl border border-zinc-200">
          <div className="grid gap-1 px-4 py-4 sm:grid-cols-[170px_minmax(0,1fr)] sm:px-5">
            <p className="font-medium text-zinc-700">Direct proportion</p>
            <p className="text-zinc-950"><MathText>{String.raw`y=kx`}</MathText></p>
          </div>
          <div className="grid gap-1 px-4 py-4 sm:grid-cols-[170px_minmax(0,1fr)] sm:px-5">
            <p className="font-medium text-zinc-700">Inverse proportion</p>
            <p className="text-zinc-950"><MathText>{String.raw`y=\frac kx`}</MathText></p>
          </div>
          <div className="grid gap-1 px-4 py-4 sm:grid-cols-[170px_minmax(0,1fr)] sm:px-5">
            <p className="font-medium text-zinc-700">Quadratic model</p>
            <p className="text-zinc-950">
              <MathText>{String.raw`y=ax^2+bx+c`}</MathText>
              <span className="ml-2 text-sm text-zinc-500">(e.g. height of a projectile)</span>
            </p>
          </div>
        </div>

        <div className="mt-7">
          <p className="mb-4 font-semibold text-zinc-900">Modelling cycle:</p>
          <div className="space-y-4 border-l-2 border-zinc-200 pl-4 sm:pl-5">
            <Step number={1} title="Set up model">
              <p>Make assumptions.</p>
            </Step>
            <Step number={2} title="Solve or compute predictions" />
            <Step number={3} title="Interpret and compare with reality" />
            <Step number={4} title="Refine model if needed" />
          </div>
        </div>
      </LessonSection>

      <LessonSection title="Worked Examples">
        <div className="rounded-xl border border-zinc-200 p-4 sm:p-6">
          <p className="font-semibold text-zinc-950">
            A factory makes bars of soap. The cost £<MathText>y</MathText> of making
            <MathText>x</MathText> bars equals a fixed cost plus a cost proportional to the number of
            bars. When 800 bars are made, the profit is £500. When 300 bars are made, there is a
            loss of £80. Each bar is sold for £2. Show that
            <MathText>{String.raw`y=0.84x+428`}</MathText>.
          </p>
          <div className="mt-6 space-y-6">
            <Step number={1} title="Set up the linear model.">
              <p>
                The model is <MathText>{String.raw`y=mx+c`}</MathText> (linear, since cost per bar is
                constant).
              </p>
              <p>Revenue from selling <MathText>x</MathText> bars at £2 each is <MathText>{String.raw`2x`}</MathText>.</p>
              <p>
                Profit = Revenue − Cost, so Profit = <MathText>{String.raw`2x-y`}</MathText>.
              </p>
            </Step>
            <Step number={2} title="Use the two conditions.">
              <p>
                When <MathText>{String.raw`x=800`}</MathText>:
                <MathText>{String.raw`2(800)-y=500`}</MathText>, so <MathText>{String.raw`y=1100`}</MathText>.
              </p>
              <p>
                When <MathText>{String.raw`x=300`}</MathText>:
                <MathText>{String.raw`2(300)-y=-80`}</MathText>, so <MathText>{String.raw`y=680`}</MathText>.
              </p>
            </Step>
            <Step number={3} title="Find m and c.">
              <DisplayMath>{String.raw`m=\frac{1100-680}{800-300}=\frac{420}{500}=0.84`}</DisplayMath>
              <p>
                Substitute into <MathText>{String.raw`y=0.84x+c`}</MathText> with
                <MathText>{String.raw`(300,680)`}</MathText>:
                <MathText>{String.raw`680=252+c`}</MathText>, so <MathText>{String.raw`c=428`}</MathText>.
              </p>
            </Step>
          </div>
          <p className="mt-6">Therefore <MathText>{String.raw`y=0.84x+428`}</MathText>.</p>
          <CostModelDiagram />
        </div>
      </LessonSection>

      <LessonSection title="Practice Questions">
        <ol className="space-y-5">
          <Question number={1}>
            A ball is thrown and its height <MathText>H</MathText> metres above the ground is modelled
            by <MathText>{String.raw`H=ax^2+bx+c`}</MathText>, where <MathText>x</MathText> is the
            horizontal distance. The ball is thrown from height 2 m, reaches maximum height at
            <MathText>{String.raw`x=9`}</MathText>, and lands at <MathText>{String.raw`x=20`}</MathText>
            at height 0.8 m. Find <MathText>H</MathText> in terms of <MathText>x</MathText>.
          </Question>
          <Question number={2}>In the model from Q1, state one limitation.</Question>
        </ol>
      </LessonSection>

      <LessonSection title="Solutions to Practice Questions">
        <div className="space-y-9">
          <div>
            <h3 className="font-semibold text-zinc-950">
              1. Find <MathText>H</MathText> in terms of <MathText>x</MathText>.
            </h3>
            <div className="mt-5 space-y-6">
              <Step number={1} title="Use vertex form.">
                <p>
                  The maximum is at <MathText>{String.raw`x=9`}</MathText>:
                  <MathText>{String.raw`H=a(x-9)^2+d`}</MathText>.
                </p>
              </Step>
              <Step number={2} title="Substitute the two known points.">
                <p>
                  At <MathText>{String.raw`x=0`}</MathText>, <MathText>{String.raw`H=2`}</MathText>:
                  <MathText>{String.raw`a(81)+d=2`}</MathText>, so
                  <MathText>{String.raw`81a+d=2\ \ldots\ (1)`}</MathText>.
                </p>
                <p>
                  At <MathText>{String.raw`x=20`}</MathText>, <MathText>{String.raw`H=0.8`}</MathText>:
                  <MathText>{String.raw`a(121)+d=0.8`}</MathText>, so
                  <MathText>{String.raw`121a+d=0.8\ \ldots\ (2)`}</MathText>.
                </p>
              </Step>
              <Step number={3} title="Solve for a and d.">
                <p>
                  Subtract (1) from (2): <MathText>{String.raw`40a=-1.2`}</MathText>, so
                  <MathText>{String.raw`a=-0.03`}</MathText>.
                </p>
                <p>
                  From (1): <MathText>{String.raw`d=2-81(-0.03)=2+2.43=4.43`}</MathText>.
                </p>
              </Step>
            </div>
            <DisplayMath>{String.raw`H=-0.03(x-9)^2+4.43`}</DisplayMath>
            <p>Expanding:</p>
            <DisplayMath>{String.raw`H=-0.03x^2+0.54x+2`}</DisplayMath>
            <ProjectileModelDiagram />
          </div>

          <div className="border-t border-zinc-200 pt-8">
            <h3 className="font-semibold text-zinc-950">2.</h3>
            <p className="mt-3">
              One limitation: the model assumes the path is a perfect parabola, which ignores air
              resistance. Another valid answer: the model does not account for spin or wind.
            </p>
          </div>
        </div>
      </LessonSection>
    </NotionLessonRenderer>
  );
}
