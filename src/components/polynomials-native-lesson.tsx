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


export function PolynomialsNativeLesson() {
  return (
    <NotionLessonRenderer
      definition={NOTION_LESSON_DEFINITIONS.polynomials}
      introduction={
        <p>
          Division of a polynomial <MathText>{String.raw`f(x)`}</MathText> by a linear divisor
          <MathText>{String.raw`(ax+b)`}</MathText> can be performed by long division or by
          inspection. The factor theorem provides a quick test: if
          <MathText>{String.raw`f\left(-\frac ba\right)=0`}</MathText>, then
          <MathText>{String.raw`(ax+b)`}</MathText> is a factor of <MathText>{String.raw`f(x)`}</MathText>.
        </p>
      }
    >

      <LessonSection title="The Factor Theorem">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 px-4 py-3 sm:px-6 sm:py-4">
          <p>If</p>
          <DisplayMath>{String.raw`f\left(\frac ba\right)=0`}</DisplayMath>
          <p>
            then <MathText>{String.raw`(ax-b)`}</MathText> is a factor of
            <MathText>{String.raw`f(x)`}</MathText>.
          </p>
        </div>
      </LessonSection>

      <LessonSection title="Algebraic Division">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 px-4 py-3 sm:px-6 sm:py-4">
          <DisplayMath>{String.raw`f(x)=(ax+b)\cdot Q(x)+R`}</DisplayMath>
          <p>
            where <MathText>{String.raw`Q(x)`}</MathText> is the quotient and
            <MathText>R</MathText> is the remainder.
          </p>
        </div>
        <p>
          <span className="font-semibold text-zinc-900">Simplifying Rational Expressions:</span>
          {" "}Factorise numerator and denominator, then cancel common factors.
        </p>
      </LessonSection>

      <LessonSection title="Worked Examples">
        <div className="rounded-xl border border-zinc-200 p-4 sm:p-6">
          <p className="font-semibold text-zinc-950">
            <MathText>{String.raw`f(x)=3x^3+2ax^2-4x+5a`}</MathText>. Given that
            <MathText>{String.raw`(x+3)`}</MathText> is a factor of <MathText>{String.raw`f(x)`}</MathText>,
            find the value of <MathText>a</MathText>.
          </p>
          <p className="mt-5">
            By the factor theorem, <MathText>{String.raw`(x+3)`}</MathText> is a factor means
            <MathText>{String.raw`f(-3)=0`}</MathText>:
          </p>
          <DisplayMath>{String.raw`f(-3)=3(-3)^3+2a(-3)^2-4(-3)+5a`}</DisplayMath>
          <DisplayMath>{String.raw`=-81+18a+12+5a`}</DisplayMath>
          <DisplayMath>{String.raw`=23a-69`}</DisplayMath>
          <p>
            Set equal to zero: <MathText>{String.raw`23a-69=0`}</MathText>, so
            <MathText>{String.raw`a=3`}</MathText>.
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-zinc-200 p-4 sm:p-6">
          <p className="font-semibold text-zinc-950">
            <MathText>{String.raw`f(x)=x^3+3x^2-24x+20`}</MathText>. (a) Show that
            <MathText>{String.raw`(x-1)`}</MathText> is a factor. (b) Factorise
            <MathText>{String.raw`f(x)`}</MathText> completely. (c) Solve
            <MathText>{String.raw`f(x)=0`}</MathText>.
          </p>

          <div className="mt-6 space-y-7">
            <div>
              <p className="font-semibold text-zinc-900">(a) Evaluate <MathText>{String.raw`f(1)`}</MathText>:</p>
              <DisplayMath>{String.raw`f(1)=1+3-24+20=0`}</DisplayMath>
              <p>
                Since <MathText>{String.raw`f(1)=0`}</MathText>, <MathText>{String.raw`(x-1)`}</MathText>
                is a factor by the factor theorem.
              </p>
            </div>

            <div className="border-t border-zinc-200 pt-6">
              <p className="font-semibold text-zinc-900">
                (b) Divide <MathText>{String.raw`f(x)`}</MathText> by <MathText>{String.raw`(x-1)`}</MathText>.
                By inspection or long division:
              </p>
              <DisplayMath>{String.raw`x^3+3x^2-24x+20=(x-1)(x^2+4x-20)`}</DisplayMath>
              <p>
                Check whether the quadratic factorises further:
                <MathText>{String.raw`\Delta=16+80=96`}</MathText>, which is not a perfect square.
                So the quadratic does not factorise over the rationals. Thus:
              </p>
              <DisplayMath>{String.raw`f(x)=(x-1)(x^2+4x-20)`}</DisplayMath>
            </div>

            <div className="border-t border-zinc-200 pt-6">
              <p className="font-semibold text-zinc-900">(c) Solve <MathText>{String.raw`f(x)=0`}</MathText>:</p>
              <p>
                <MathText>{String.raw`x=1`}</MathText> or <MathText>{String.raw`x^2+4x-20=0`}</MathText>,
                giving
              </p>
              <DisplayMath>{String.raw`x=\frac{-4\pm\sqrt{96}}2=-2\pm2\sqrt6`}</DisplayMath>
              <p>
                So <MathText>{String.raw`x=1`}</MathText>, <MathText>{String.raw`x=-2+2\sqrt6`}</MathText>
                or <MathText>{String.raw`x=-2-2\sqrt6`}</MathText>.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-zinc-200 p-4 sm:p-6">
          <p className="font-semibold text-zinc-950">
            Simplify <MathText>{String.raw`\frac{x^3+a^3}{x^2-a^2}`}</MathText>.
          </p>
          <p className="mt-5">
            Factorise the numerator (sum of cubes) and denominator (difference of squares):
          </p>
          <DisplayMath>
            {String.raw`\frac{x^3+a^3}{x^2-a^2}=\frac{(x+a)(x^2-ax+a^2)}{(x+a)(x-a)}`}
          </DisplayMath>
          <DisplayMath>{String.raw`=\frac{x^2-ax+a^2}{x-a}`}</DisplayMath>
        </div>
      </LessonSection>

      <LessonSection title="Practice Questions">
        <ol className="space-y-5">
          <Question number={1}>
            A cubic function is defined as <MathText>{String.raw`f(x)=x^3+x^2-x+k`}</MathText>.
            Given that <MathText>{String.raw`(x-k)`}</MathText> is a factor, determine the possible
            values of <MathText>k</MathText>.
          </Question>
          <Question number={2}>
            Factorise <MathText>{String.raw`6x^3+11x^2-x-6`}</MathText> completely.
          </Question>
          <Question number={3}>
            Simplify <MathText>{String.raw`\frac{2x^2+5x-3}{x^2+6x+9}`}</MathText>.
          </Question>
          <Question number={4}>
            Divide <MathText>{String.raw`2x^3-5x^2+1`}</MathText> by
            <MathText>{String.raw`(x-2)`}</MathText>, stating the quotient and remainder.
          </Question>
        </ol>
      </LessonSection>

      <LessonSection title="Solutions to Practice Questions">
        <div className="space-y-9">
          <div>
            <h3 className="font-semibold text-zinc-950">
              1. <MathText>{String.raw`f(x)=x^3+x^2-x+k`}</MathText>. Given
              <MathText>{String.raw`(x-k)`}</MathText> is a factor, find possible values of
              <MathText>k</MathText>.
            </h3>
            <p className="mt-3">By the factor theorem, <MathText>{String.raw`f(k)=0`}</MathText>:</p>
            <DisplayMath>{String.raw`k^3+k^2-k+k=0`}</DisplayMath>
            <DisplayMath>{String.raw`k^3+k^2=0`}</DisplayMath>
            <DisplayMath>{String.raw`k^2(k+1)=0`}</DisplayMath>
            <p>
              So <MathText>{String.raw`k=0`}</MathText> or <MathText>{String.raw`k=-1`}</MathText>.
            </p>
          </div>

          <div className="border-t border-zinc-200 pt-8">
            <h3 className="font-semibold text-zinc-950">
              2. Factorise <MathText>{String.raw`6x^3+11x^2-x-6`}</MathText> completely.
            </h3>
            <div className="mt-5 space-y-5">
              <Step number={1} title="Try simple roots.">
                <p>
                  Try <MathText>{String.raw`x=1`}</MathText>:
                  <MathText>{String.raw`6+11-1-6=10\ne0`}</MathText>.
                </p>
                <p>
                  Try <MathText>{String.raw`x=-1`}</MathText>:
                  <MathText>{String.raw`-6+11+1-6=0`}</MathText>. So
                  <MathText>{String.raw`(x+1)`}</MathText> is a factor.
                </p>
              </Step>
              <Step number={2} title="Divide by (x + 1):">
                <DisplayMath>{String.raw`6x^3+11x^2-x-6=(x+1)(6x^2+5x-6)`}</DisplayMath>
              </Step>
              <Step number={3} title="Factorise 6x² + 5x − 6.">
                <p>
                  We need factors of <MathText>{String.raw`6\times(-6)=-36`}</MathText> that sum
                  to 5: these are 9 and −4.
                </p>
                <DisplayMath>
                  {String.raw`6x^2+9x-4x-6=3x(2x+3)-2(2x+3)=(3x-2)(2x+3)`}
                </DisplayMath>
              </Step>
            </div>
            <p className="mt-5">Therefore</p>
            <DisplayMath>{String.raw`6x^3+11x^2-x-6=(x+1)(3x-2)(2x+3)`}</DisplayMath>
          </div>

          <div className="border-t border-zinc-200 pt-8">
            <h3 className="font-semibold text-zinc-950">
              3. Simplify <MathText>{String.raw`\frac{2x^2+5x-3}{x^2+6x+9}`}</MathText>.
            </h3>
            <p className="mt-3">Factorise:</p>
            <DisplayMath>{String.raw`2x^2+5x-3=(2x-1)(x+3)`}</DisplayMath>
            <DisplayMath>{String.raw`x^2+6x+9=(x+3)^2`}</DisplayMath>
            <p>Cancel the common factor:</p>
            <DisplayMath>
              {String.raw`\frac{(2x-1)(x+3)}{(x+3)^2}=\frac{2x-1}{x+3},\qquad x\ne-3`}
            </DisplayMath>
          </div>

          <div className="border-t border-zinc-200 pt-8">
            <h3 className="font-semibold text-zinc-950">
              4. Divide <MathText>{String.raw`2x^3-5x^2+1`}</MathText> by
              <MathText>{String.raw`(x-2)`}</MathText>, stating quotient and remainder.
            </h3>
            <p className="mt-3">By long division (or synthetic division):</p>
            <DisplayMath>
              {String.raw`2x^3-5x^2+0x+1=(x-2)(2x^2-x-2)+(-3)`}
            </DisplayMath>
            <p>Verify by expanding:</p>
            <DisplayMath>{String.raw`(x-2)(2x^2-x-2)`}</DisplayMath>
            <DisplayMath>{String.raw`=2x^3-x^2-2x-4x^2+2x+4`}</DisplayMath>
            <DisplayMath>{String.raw`=2x^3-5x^2+4`}</DisplayMath>
            <p>
              Then <MathText>{String.raw`2x^3-5x^2+4+(-3)=2x^3-5x^2+1`}</MathText>.
            </p>
            <p>
              Quotient: <MathText>{String.raw`2x^2-x-2`}</MathText>. Remainder:
              <MathText>{String.raw`-3`}</MathText>.
            </p>
          </div>
        </div>
      </LessonSection>
    </NotionLessonRenderer>
  );
}
