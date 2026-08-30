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

export function LawsOfIndicesNativeLesson() {
  return (
    <NotionLessonRenderer
      definition={NOTION_LESSON_DEFINITIONS.lawsOfIndices}
      introduction={
        <p>
          The laws of indices (or exponents) provide the algebraic rules for working with powers.
          These rules apply for all rational exponents, extending the familiar integer rules to
          fractional and negative powers.
        </p>
      }
    >

      <LessonSection title="Laws of Indices">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 px-4 py-3 sm:px-6 sm:py-4">
          <DisplayMath>{String.raw`a^m \times a^n = a^{m+n}`}</DisplayMath>
          <DisplayMath>{String.raw`a^m \div a^n = a^{m-n}`}</DisplayMath>
          <DisplayMath>{String.raw`(a^m)^n = a^{mn}`}</DisplayMath>
          <DisplayMath>{String.raw`a^0 = 1 \quad (a \ne 0)`}</DisplayMath>
          <DisplayMath>{String.raw`a^{-n} = \frac{1}{a^n}`}</DisplayMath>
          <DisplayMath>{String.raw`a^{\frac{m}{n}} = \sqrt[n]{a^m} = (\sqrt[n]{a})^m`}</DisplayMath>
        </div>

        <p>
          The equivalence <MathText>{String.raw`a^{m/n}=\sqrt[n]{a^m}`}</MathText> is essential.
          The denominator of the fractional exponent indicates the root, and the numerator
          indicates the power. For example,
          <MathText>{String.raw`8^{2/3}=(\sqrt[3]{8})^2=2^2=4`}</MathText>.
        </p>
      </LessonSection>

      <LessonSection title="Worked Examples">
        <div className="rounded-xl border border-zinc-200 p-4 sm:p-6">
          <p className="font-semibold text-zinc-950">
            Simplify <MathText>{String.raw`\frac{27^t}{3^{t-1}}`}</MathText>, giving your answer as
            a power of 3.
          </p>

          <div className="mt-6 space-y-5">
            <Step number={1} title="Rewrite 27 as a power of 3.">
              <p>
                Since <MathText>{String.raw`27=3^3`}</MathText>, we have
                <MathText>{String.raw`27^t=(3^3)^t=3^{3t}`}</MathText>.
              </p>
            </Step>
            <Step number={2} title="Apply the division law.">
              <DisplayMath>
                {String.raw`\frac{27^t}{3^{t-1}}=\frac{3^{3t}}{3^{t-1}}=3^{3t-(t-1)}=3^{3t-t+1}=3^{2t+1}`}
              </DisplayMath>
            </Step>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-zinc-200 p-4 sm:p-6">
          <p className="font-semibold text-zinc-950">
            Evaluate
            <MathText>
              {String.raw`\left(125^{1/3}\times25^{1/2}+16^{3/4}\times64^{1/3}+\frac{1}{49^{-1/2}}\right)^{-2/3}`}
            </MathText>, giving your answer as a simplified fraction. No calculator may be used.
          </p>

          <div className="mt-6 space-y-5">
            <Step number={1} title="Evaluate each term individually.">
              <DisplayMath>
                {String.raw`125^{1/3}=\sqrt[3]{125}=5,\qquad 25^{1/2}=\sqrt{25}=5`}
              </DisplayMath>
              <DisplayMath>
                {String.raw`16^{3/4}=(\sqrt[4]{16})^3=2^3=8,\qquad 64^{1/3}=\sqrt[3]{64}=4`}
              </DisplayMath>
              <DisplayMath>
                {String.raw`49^{-1/2}=\frac{1}{\sqrt{49}}=\frac17,\qquad \frac{1}{49^{-1/2}}=7`}
              </DisplayMath>
            </Step>
            <Step number={2} title="Substitute and simplify.">
              <DisplayMath>{String.raw`5\times5+8\times4+7=25+32+7=64`}</DisplayMath>
            </Step>
            <Step number={3} title="Apply the outer exponent.">
              <DisplayMath>
                {String.raw`64^{-2/3}=\frac{1}{64^{2/3}}=\frac{1}{(\sqrt[3]{64})^2}=\frac{1}{4^2}=\frac{1}{16}`}
              </DisplayMath>
            </Step>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="Practice Questions">
        <ol className="space-y-5">
          <Question number={1}>
            Simplify <MathText>{String.raw`\frac{(2x^3)^4}{4x^5}`}</MathText>, giving your answer
            in the form <MathText>{String.raw`ax^n`}</MathText>.
          </Question>
          <Question number={2}>
            Given that <MathText>{String.raw`3^{x+1}=9^{2x-3}`}</MathText>, find the value of
            <MathText>x</MathText>.
          </Question>
          <Question number={3}>
            Simplify <MathText>{String.raw`\left(\frac{16a^8}{81b^{12}}\right)^{-3/4}`}</MathText>.
          </Question>
          <Question number={4}>
            Solve the equation <MathText>{String.raw`\frac{27^t}{3^{t-1}}=3\sqrt3`}</MathText>,
            showing detailed working.
          </Question>
        </ol>
      </LessonSection>

      <LessonSection title="Solutions to Practice Questions">
        <div className="space-y-9">
          <div>
            <h3 className="font-semibold text-zinc-950">
              1. Simplify <MathText>{String.raw`\frac{(2x^3)^4}{4x^5}`}</MathText>, giving your
              answer in the form <MathText>{String.raw`ax^n`}</MathText>.
            </h3>
            <p className="mt-3">
              Expand the numerator using <MathText>{String.raw`(ab)^n=a^nb^n`}</MathText>:
            </p>
            <DisplayMath>{String.raw`(2x^3)^4=2^4\cdot(x^3)^4=16x^{12}`}</DisplayMath>
            <p>Divide by the denominator:</p>
            <DisplayMath>{String.raw`\frac{16x^{12}}{4x^5}=4x^{12-5}=4x^7`}</DisplayMath>
          </div>

          <div className="border-t border-zinc-200 pt-8">
            <h3 className="font-semibold text-zinc-950">
              2. Given that <MathText>{String.raw`3^{x+1}=9^{2x-3}`}</MathText>, find the value of
              <MathText>x</MathText>.
            </h3>
            <p className="mt-3">Rewrite 9 as <MathText>{String.raw`3^2`}</MathText>:</p>
            <DisplayMath>{String.raw`3^{x+1}=(3^2)^{2x-3}=3^{2(2x-3)}=3^{4x-6}`}</DisplayMath>
            <p>Since the bases are equal, equate the exponents:</p>
            <DisplayMath>{String.raw`x+1=4x-6`}</DisplayMath>
            <DisplayMath>{String.raw`7=3x`}</DisplayMath>
            <DisplayMath>{String.raw`x=\frac73`}</DisplayMath>
          </div>

          <div className="border-t border-zinc-200 pt-8">
            <h3 className="font-semibold text-zinc-950">
              3. Simplify <MathText>{String.raw`\left(\frac{16a^8}{81b^{12}}\right)^{-3/4}`}</MathText>.
            </h3>
            <p className="mt-3">A negative exponent inverts the fraction, so:</p>
            <DisplayMath>
              {String.raw`\left(\frac{16a^8}{81b^{12}}\right)^{-3/4}=\left(\frac{81b^{12}}{16a^8}\right)^{3/4}`}
            </DisplayMath>
            <p>
              Apply the exponent <MathText>{String.raw`\frac34`}</MathText> to each component.
              The denominator 4 means fourth root, and the numerator 3 means cube:
            </p>
            <DisplayMath>
              {String.raw`=\frac{81^{3/4}\cdot b^{12\times3/4}}{16^{3/4}\cdot a^{8\times3/4}}=\frac{(\sqrt[4]{81})^3\cdot b^9}{(\sqrt[4]{16})^3\cdot a^6}=\frac{3^3\cdot b^9}{2^3\cdot a^6}=\frac{27b^9}{8a^6}`}
            </DisplayMath>
          </div>

          <div className="border-t border-zinc-200 pt-8">
            <h3 className="font-semibold text-zinc-950">
              4. Solve the equation <MathText>{String.raw`\frac{27^t}{3^{t-1}}=3\sqrt3`}</MathText>,
              showing detailed working.
            </h3>
            <p className="mt-3 font-semibold text-zinc-900">Step 1: Express everything as powers of 3.</p>
            <p>
              The left-hand side: <MathText>{String.raw`27^t=3^{3t}`}</MathText>, so
              <MathText>{String.raw`\frac{3^{3t}}{3^{t-1}}=3^{3t-(t-1)}=3^{2t+1}`}</MathText>.
            </p>
            <p>
              The right-hand side: <MathText>{String.raw`3\sqrt3=3^1\cdot3^{1/2}=3^{3/2}`}</MathText>.
            </p>
            <p className="mt-4 font-semibold text-zinc-900">Step 2: Equate exponents.</p>
            <DisplayMath>{String.raw`2t+1=\frac32`}</DisplayMath>
            <DisplayMath>{String.raw`2t=\frac12`}</DisplayMath>
            <DisplayMath>{String.raw`t=\frac14`}</DisplayMath>
          </div>
        </div>
      </LessonSection>
    </NotionLessonRenderer>
  );
}
