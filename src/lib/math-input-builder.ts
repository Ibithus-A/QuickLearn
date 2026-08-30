export type MathInputInsertion = {
  text: string;
  caret: number;
};

const wrap = (prefix: string, selection: string, suffix: string): MathInputInsertion => ({
  text: `${prefix}${selection}${suffix}`,
  caret: prefix.length + selection.length + (selection ? suffix.length : 0),
});

const fixed = (text: string): MathInputInsertion => ({ text, caret: text.length });

export function buildMathInputInsertion(id: string, selection = ""): MathInputInsertion {
  if (id.startsWith("variable-")) return fixed(id.slice("variable-".length));

  switch (id) {
    case "fraction":
      return selection
        ? { text: `${selection}/()`, caret: selection.length + 2 }
        : { text: "()/()", caret: 1 };
    case "sqrt":
      return wrap("√(", selection, ")");
    case "power":
      return selection
        ? { text: `${selection}^()`, caret: selection.length + 2 }
        : { text: "x^()", caret: 3 };
    case "squared":
      return fixed(`${selection || "x"}^2`);
    case "subscript":
      return selection
        ? { text: `${selection}_()`, caret: selection.length + 2 }
        : { text: "x_()", caret: 3 };
    case "brackets":
      return wrap("(", selection, ")");
    case "abs":
      return wrap("|", selection, "|");
    case "sin":
    case "cos":
    case "tan":
    case "asin":
    case "acos":
    case "atan":
    case "log":
    case "ln":
      return wrap(`${id}(`, selection, ")");
    case "exp": {
      const text = `e^(${selection})`;
      return { text, caret: selection ? text.length : 3 };
    }
    case "integral":
      return wrap("int(", selection, ",x)");
    case "definite-integral":
      return wrap("int(", selection, ",x,a,b)");
    case "derivative":
      return fixed(String.raw`\frac{d}{dx}`);
    case "dy-dx":
      return fixed(String.raw`\frac{dy}{dx}`);
    case "limit":
      return wrap("lim(x,a,", selection, ")");
    case "sum":
      return wrap("sum(n,1,N,", selection, ")");
    case "pi":
      return fixed("π");
    case "theta":
      return fixed("θ");
    case "alpha":
      return fixed("α");
    case "beta":
      return fixed("β");
    case "infty":
      return fixed("∞");
    case "pm":
      return fixed(" ± ");
    case "times":
      return fixed(" × ");
    case "cdot":
      return fixed(" · ");
    case "leq":
      return fixed(" ≤ ");
    case "geq":
      return fixed(" ≥ ");
    case "neq":
      return fixed(" ≠ ");
    case "approx":
      return fixed(" ≈ ");
    case "to":
      return fixed(" → ");
    default:
      throw new Error(`Unknown maths input key: ${id}`);
  }
}

export function applyMathInputInsertion({
  expression,
  start,
  end = start,
  id,
}: {
  expression: string;
  start: number;
  end?: number;
  id: string;
}) {
  const safeStart = Math.max(0, Math.min(start, expression.length));
  const safeEnd = Math.max(safeStart, Math.min(end, expression.length));
  const insertion = buildMathInputInsertion(id, expression.slice(safeStart, safeEnd));
  return {
    expression: `${expression.slice(0, safeStart)}${insertion.text}${expression.slice(safeEnd)}`,
    caret: safeStart + insertion.caret,
  };
}
