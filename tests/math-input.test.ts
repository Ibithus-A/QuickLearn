import assert from "node:assert/strict";
import test from "node:test";
import katex from "katex";
import { SHARED_MATH_INPUT_GROUPS } from "../src/lib/math-input-catalog.ts";
import {
  applyMathInputInsertion,
  buildMathInputInsertion,
} from "../src/lib/math-input-builder.ts";
import { formatPlainMath } from "../src/lib/math-format.ts";

const allItems = SHARED_MATH_INPUT_GROUPS.flatMap((group) => group.items);

function assertRenders(latex: string) {
  assert.doesNotThrow(() => {
    katex.renderToString(latex.replace(/\{\}/g, "{\\square}"), {
      throwOnError: true,
      strict: "ignore",
    });
  }, `Expected KaTeX to render: ${latex}`);
}

test("shared catalogue has the complete, unique category and key set", () => {
  assert.deepEqual(
    SHARED_MATH_INPUT_GROUPS.map((group) => group.id),
    ["structure", "variables", "calculus", "functions", "symbols"],
  );

  const ids = allItems.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length, "maths input IDs must be unique");
  assert.equal(SHARED_MATH_INPUT_GROUPS.find((group) => group.id === "variables")?.items.length, 26);
  for (const required of [
    "fraction", "power", "subscript", "integral", "definite-integral", "derivative",
    "limit", "sum", "asin", "acos", "atan", "cdot", "leq", "geq", "to",
  ]) {
    assert.ok(ids.includes(required), `missing shared maths key: ${required}`);
  }
});

test("every shared key supports empty and selected insertion with a valid caret", () => {
  for (const item of allItems) {
    for (const selection of ["", "x+1"]) {
      const insertion = buildMathInputInsertion(item.id, selection);
      assert.ok(insertion.text.length > 0, `${item.id} produced no text`);
      assert.ok(insertion.caret >= 0, `${item.id} produced a negative caret`);
      assert.ok(insertion.caret <= insertion.text.length, `${item.id} caret exceeds its text`);
      assertRenders(formatPlainMath(insertion.text));
    }
  }
});

test("empty structural keys produce usable placeholders rather than missing bases", () => {
  assert.deepEqual(buildMathInputInsertion("fraction"), { text: "()/()", caret: 1 });
  assert.deepEqual(buildMathInputInsertion("power"), { text: "x^()", caret: 3 });
  assert.deepEqual(buildMathInputInsertion("squared"), { text: "x^2", caret: 3 });
  assert.deepEqual(buildMathInputInsertion("subscript"), { text: "x_()", caret: 3 });
  assert.equal(formatPlainMath("()/()"), String.raw`\frac{\square}{\square}`);
  assert.equal(formatPlainMath("x^()"), String.raw`x^{\square}`);
  assert.equal(formatPlainMath("x_()"), String.raw`x_{\square}`);
});

test("cursor insertion, selection replacement and out-of-range selections are safe", () => {
  assert.deepEqual(
    applyMathInputInsertion({ expression: "2+3", start: 2, id: "variable-x" }),
    { expression: "2+x3", caret: 3 },
  );
  assert.deepEqual(
    applyMathInputInsertion({ expression: "2+(x+1)", start: 2, end: 7, id: "squared" }),
    { expression: "2+(x+1)^2", caret: 9 },
  );
  assert.deepEqual(
    applyMathInputInsertion({ expression: "abc", start: -20, end: 50, id: "sqrt" }),
    { expression: "√(abc)", caret: 6 },
  );
});

test("plain expressions preserve precedence and render clean mathematical notation", () => {
  const cases: Array<[string, string]> = [
    ["2x+3", "2x+3"],
    ["(x+1)/(x-1)", String.raw`\frac{x+1}{x-1}`],
    ["1/(x/(y+1))", String.raw`\frac{1}{\frac{x}{y+1}}`],
    ["√(x^2+1)", String.raw`\sqrt{x^{2}+1}`],
    ["|2x-3|", String.raw`\left|2x-3\right|`],
    ["sin(x^2)+cos(y)", String.raw`\sin\left(x^{2}\right)+\cos\left(y\right)`],
    ["asin(x)+acos(y)+atan(z)", String.raw`\sin^{-1}\left(x\right)+\cos^{-1}\left(y\right)+\tan^{-1}\left(z\right)`],
    ["log(x)+ln(y)", String.raw`\log\left(x\right)+\ln\left(y\right)`],
    ["e^(x+1)", String.raw`e^{x+1}`],
    ["x^-2", String.raw`x^{-2}`],
    ["-x^2", String.raw`-x^{2}`],
    ["(-x)^2", String.raw`\left(-x\right)^{2}`],
    ["a_n^2", String.raw`a_{n}^{2}`],
    ["πr^2", String.raw`\pi r^{2}`],
    ["α+β≤θ", String.raw`\alpha+\beta\leq\theta`],
    ["x ≠ y → x ≈ y", String.raw`x \neq y \to x \approx y`],
    ["a · b", String.raw`a \cdot b`],
    ["|x-1|/(x+2)", String.raw`\frac{\left|x-1\right|}{x+2}`],
    ["(-b+√(b^2-4ac))/(2a)", String.raw`\frac{-b+\sqrt{b^{2}-4ac}}{2a}`],
    ["sin(x)^2+cos(x)^2", String.raw`\sin\left(x\right)^{2}+\cos\left(x\right)^{2}`],
  ];

  for (const [plain, expected] of cases) {
    const actual = formatPlainMath(plain);
    assert.equal(actual, expected, plain);
    assertRenders(actual);
  }
});

test("calculus insertions render with and without a selected expression", () => {
  const cases = [
    ["integral", "x^2"],
    ["definite-integral", "sin(x)"],
    ["derivative", ""],
    ["dy-dx", ""],
    ["limit", "f(x)"],
    ["sum", "n^2"],
  ] as const;

  for (const [id, selection] of cases) {
    const insertion = buildMathInputInsertion(id, selection);
    assertRenders(formatPlainMath(insertion.text));
  }

  const calculusCases: Array<[string, string]> = [
    ["int(x^2,x)", String.raw`\int x^{2}\,dx`],
    ["int(sin(x),x,0,π)", String.raw`\int_{0}^{\pi} \sin\left(x\right)\,dx`],
    ["lim(x,0,sin(x)/x)", String.raw`\lim_{x\to 0} \frac{\sin\left(x\right)}{x}`],
    ["sum(n,1,N,n^2)", String.raw`\sum_{n=1}^{N} n^{2}`],
  ];
  for (const [plain, expected] of calculusCases) {
    const actual = formatPlainMath(plain);
    assert.equal(actual, expected);
    assertRenders(actual);
  }
});

test("in-progress and incomplete drafts never crash the preview formatter", () => {
  for (const draft of ["(", "x+", "sin(", "|x", "x^(", "int(,x)", "sum(n,1,N,)"]) {
    assert.doesNotThrow(() => {
      const latex = formatPlainMath(draft);
      katex.renderToString(latex, { throwOnError: false, strict: "ignore" });
    }, draft);
  }
});

test("unknown keys fail explicitly instead of silently inserting broken notation", () => {
  assert.throws(() => buildMathInputInsertion("not-a-real-key"), /Unknown maths input key/);
});
