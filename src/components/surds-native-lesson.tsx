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

export function SurdsNativeLesson() {
  return (
    <NotionLessonRenderer
      definition={NOTION_LESSON_DEFINITIONS.surds}
      introduction={
        <p>
          A surd is an irrational root expression such as <MathText>{String.raw`\sqrt2`}</MathText>,
          <MathText>{String.raw`\sqrt5`}</MathText> or <MathText>{String.raw`3\sqrt7`}</MathText>.
          Surds arise naturally throughout A-Level mathematics and must be manipulated with
          precision.
        </p>
      }
    >

      <LessonSection title="Key Surd Results">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 px-4 py-3 sm:px-6 sm:py-4">
          <DisplayMath>{String.raw`\sqrt{ab}=\sqrt a\,\sqrt b`}</DisplayMath>
          <DisplayMath>{String.raw`\sqrt{\frac ab}=\frac{\sqrt a}{\sqrt b}`}</DisplayMath>
          <DisplayMath>{String.raw`(\sqrt a)^2=a`}</DisplayMath>
        </div>

        <div className="rounded-xl border border-zinc-200 p-4 sm:p-6">
          <p className="font-semibold text-zinc-950">Rationalising the denominator:</p>
          <DisplayMath>{String.raw`\frac1{\sqrt a}=\frac{\sqrt a}{a}`}</DisplayMath>
          <DisplayMath>
            {String.raw`\frac1{a+\sqrt b}=\frac{a-\sqrt b}{a^2-b}`}
          </DisplayMath>
          <p className="border-l-2 border-zinc-300 pl-4 text-sm text-zinc-600">
            The second uses the conjugate: multiply numerator and denominator by
            <MathText>{String.raw`(a-\sqrt b)`}</MathText>.
          </p>
        </div>

        <p>
          To simplify surds, extract the largest perfect square factor. For example,
          <MathText>{String.raw`\sqrt{98}=\sqrt{49\times2}=7\sqrt2`}</MathText>.
        </p>
      </LessonSection>

      <LessonSection title="Worked Examples">
        <div className="rounded-xl border border-zinc-200 p-4 sm:p-6">
          <p className="font-semibold text-zinc-950">
            Simplify (i) <MathText>{String.raw`\sqrt{98}+\sqrt2`}</MathText> (ii)
            <MathText>{String.raw`(\sqrt2+3)(2-3\sqrt2)`}</MathText>.
          </p>

          <div className="mt-6 space-y-6">
            <div>
              <p className="font-semibold text-zinc-900">(i) Simplify the surd:</p>
              <DisplayMath>{String.raw`\sqrt{98}=\sqrt{49\times2}=7\sqrt2`}</DisplayMath>
              <p>Therefore</p>
              <DisplayMath>{String.raw`\sqrt{98}+\sqrt2=7\sqrt2+\sqrt2=8\sqrt2`}</DisplayMath>
            </div>

            <div className="border-t border-zinc-200 pt-6">
              <p className="font-semibold text-zinc-900">(ii) Expand the product:</p>
              <DisplayMath>
                {String.raw`(\sqrt2+3)(2-3\sqrt2)=2\sqrt2-3(\sqrt2)^2+6-9\sqrt2`}
              </DisplayMath>
              <DisplayMath>{String.raw`=2\sqrt2-6+6-9\sqrt2`}</DisplayMath>
              <DisplayMath>{String.raw`=-7\sqrt2`}</DisplayMath>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-zinc-200 p-4 sm:p-6">
          <p className="font-semibold text-zinc-950">
            A cylinder has radius <MathText>{String.raw`\frac1{\sqrt2-1}`}</MathText> cm and
            height <MathText>{String.raw`(\sqrt2+1)`}</MathText> cm. Show that its volume is
            exactly <MathText>{String.raw`\pi(7+5\sqrt2)`}</MathText> cm
            <MathText>{String.raw`{}^3`}</MathText>.
          </p>

          <div className="mt-6 space-y-5">
            <Step number={1} title="Rationalise the radius.">
              <p>
                Multiply numerator and denominator by the conjugate
                <MathText>{String.raw`(\sqrt2+1)`}</MathText>:
              </p>
              <DisplayMath>
                {String.raw`r=\frac1{\sqrt2-1}\times\frac{\sqrt2+1}{\sqrt2+1}=\frac{\sqrt2+1}{2-1}=\sqrt2+1`}
              </DisplayMath>
            </Step>
            <Step number={2} title={String.raw`Find r².`}>
              <DisplayMath>{String.raw`r^2=(\sqrt2+1)^2=2+2\sqrt2+1=3+2\sqrt2`}</DisplayMath>
            </Step>
            <Step number={3} title="Compute the volume V = πr²h.">
              <DisplayMath>{String.raw`V=\pi(3+2\sqrt2)(\sqrt2+1)`}</DisplayMath>
              <DisplayMath>{String.raw`=\pi(3\sqrt2+3+2(\sqrt2)^2+2\sqrt2)`}</DisplayMath>
              <DisplayMath>{String.raw`=\pi(3\sqrt2+3+4+2\sqrt2)`}</DisplayMath>
              <DisplayMath>{String.raw`=\pi(7+5\sqrt2)`}</DisplayMath>
            </Step>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="Practice Questions">
        <ol className="space-y-5">
          <Question number={1}>
            Simplify <MathText>{String.raw`\frac{6+\sqrt5}{4-\sqrt5}`}</MathText>, giving your
            answer in the form <MathText>{String.raw`a+b\sqrt5`}</MathText> where
            <MathText>a</MathText> and <MathText>b</MathText> are rational.
          </Question>
          <Question number={2}>
            Show that <MathText>{String.raw`\frac{\sqrt{75}-\sqrt{27}}{\sqrt3}=2`}</MathText>.
          </Question>
          <Question number={3}>
            Express <MathText>{String.raw`\frac1{(\sqrt3+1)^2}`}</MathText> in the form
            <MathText>{String.raw`a+b\sqrt3`}</MathText> where <MathText>a</MathText> and
            <MathText>b</MathText> are rational.
          </Question>
        </ol>
      </LessonSection>

      <LessonSection title="Solutions to Practice Questions">
        <div className="space-y-9">
          <div>
            <h3 className="font-semibold text-zinc-950">
              1. Simplify <MathText>{String.raw`\frac{6+\sqrt5}{4-\sqrt5}`}</MathText>, giving
              your answer in the form <MathText>{String.raw`a+b\sqrt5`}</MathText>.
            </h3>
            <p className="mt-3">Multiply by the conjugate:</p>
            <DisplayMath>
              {String.raw`\frac{6+\sqrt5}{4-\sqrt5}\times\frac{4+\sqrt5}{4+\sqrt5}=\frac{(6+\sqrt5)(4+\sqrt5)}{16-5}`}
            </DisplayMath>
            <p>Expand the numerator:</p>
            <DisplayMath>
              {String.raw`(6+\sqrt5)(4+\sqrt5)=24+6\sqrt5+4\sqrt5+5=29+10\sqrt5`}
            </DisplayMath>
            <p>Therefore:</p>
            <DisplayMath>{String.raw`\frac{29+10\sqrt5}{11}=\frac{29}{11}+\frac{10}{11}\sqrt5`}</DisplayMath>
          </div>

          <div className="border-t border-zinc-200 pt-8">
            <h3 className="font-semibold text-zinc-950">
              2. Show that <MathText>{String.raw`\frac{\sqrt{75}-\sqrt{27}}{\sqrt3}=2`}</MathText>.
            </h3>
            <p className="mt-3">
              Simplify each surd: <MathText>{String.raw`\sqrt{75}=\sqrt{25\times3}=5\sqrt3`}</MathText>
              and <MathText>{String.raw`\sqrt{27}=\sqrt{9\times3}=3\sqrt3`}</MathText>.
            </p>
            <DisplayMath>{String.raw`\frac{5\sqrt3-3\sqrt3}{\sqrt3}=\frac{2\sqrt3}{\sqrt3}=2`}</DisplayMath>
          </div>

          <div className="border-t border-zinc-200 pt-8">
            <h3 className="font-semibold text-zinc-950">
              3. Express <MathText>{String.raw`\frac1{(\sqrt3+1)^2}`}</MathText> in the form
              <MathText>{String.raw`a+b\sqrt3`}</MathText>.
            </h3>
            <div className="mt-5 space-y-5">
              <Step number={1} title="Expand the denominator.">
                <DisplayMath>{String.raw`(\sqrt3+1)^2=3+2\sqrt3+1=4+2\sqrt3`}</DisplayMath>
              </Step>
              <Step number={2} title="Rationalise by multiplying by the conjugate (4 − 2√3):">
                <DisplayMath>
                  {String.raw`\frac1{4+2\sqrt3}\times\frac{4-2\sqrt3}{4-2\sqrt3}=\frac{4-2\sqrt3}{16-12}=\frac{4-2\sqrt3}{4}=1-\frac12\sqrt3`}
                </DisplayMath>
              </Step>
            </div>
          </div>
        </div>
      </LessonSection>
    </NotionLessonRenderer>
  );
}
