export type SharedMathInputItem = {
  id: string;
  label: string;
  labelLatex: string;
  ariaLabel: string;
  wide?: boolean;
};

export type SharedMathInputGroup = {
  id: string;
  label: string;
  items: SharedMathInputItem[];
};

const VARIABLES: SharedMathInputItem[] = Array.from(
  "abcdefghijklmnopqrstuvwxyz",
  (letter) => ({
    id: `variable-${letter}`,
    label: letter,
    labelLatex: letter,
    ariaLabel: `Insert variable ${letter}`,
  }),
);

export const SHARED_MATH_INPUT_GROUPS: SharedMathInputGroup[] = [
  {
    id: "structure",
    label: "Structure",
    items: [
      { id: "fraction", label: "fraction", labelLatex: String.raw`\frac{a}{b}`, ariaLabel: "Insert fraction" },
      { id: "sqrt", label: "sqrt", labelLatex: String.raw`\sqrt{x}`, ariaLabel: "Insert square root" },
      { id: "power", label: "xⁿ", labelLatex: String.raw`x^{n}`, ariaLabel: "Insert exponent" },
      { id: "squared", label: "x²", labelLatex: String.raw`x^{2}`, ariaLabel: "Insert squared" },
      { id: "subscript", label: "xₙ", labelLatex: String.raw`x_{n}`, ariaLabel: "Insert subscript" },
      { id: "brackets", label: "(…)", labelLatex: String.raw`\left(\square\right)`, ariaLabel: "Insert brackets" },
      { id: "abs", label: "|x|", labelLatex: String.raw`|x|`, ariaLabel: "Insert absolute value" },
    ],
  },
  { id: "variables", label: "Variables", items: VARIABLES },
  {
    id: "calculus",
    label: "Calculus",
    items: [
      { id: "integral", label: "integral", labelLatex: String.raw`\int f(x)\,dx`, ariaLabel: "Insert indefinite integral", wide: true },
      { id: "definite-integral", label: "definite integral", labelLatex: String.raw`\int_{a}^{b} f(x)\,dx`, ariaLabel: "Insert definite integral", wide: true },
      { id: "derivative", label: "d/dx", labelLatex: String.raw`\tfrac{d}{dx}`, ariaLabel: "Insert derivative operator" },
      { id: "dy-dx", label: "dy/dx", labelLatex: String.raw`\tfrac{dy}{dx}`, ariaLabel: "Insert dy over dx" },
      { id: "limit", label: "limit", labelLatex: String.raw`\lim_{x\to a}`, ariaLabel: "Insert limit" },
      { id: "sum", label: "sum", labelLatex: String.raw`\sum_{n=1}^{N}`, ariaLabel: "Insert summation" },
    ],
  },
  {
    id: "functions",
    label: "Functions",
    items: [
      { id: "sin", label: "sin", labelLatex: String.raw`\sin x`, ariaLabel: "Insert sine" },
      { id: "cos", label: "cos", labelLatex: String.raw`\cos x`, ariaLabel: "Insert cosine" },
      { id: "tan", label: "tan", labelLatex: String.raw`\tan x`, ariaLabel: "Insert tangent" },
      { id: "asin", label: "sin⁻¹", labelLatex: String.raw`\sin^{-1}x`, ariaLabel: "Insert inverse sine" },
      { id: "acos", label: "cos⁻¹", labelLatex: String.raw`\cos^{-1}x`, ariaLabel: "Insert inverse cosine" },
      { id: "atan", label: "tan⁻¹", labelLatex: String.raw`\tan^{-1}x`, ariaLabel: "Insert inverse tangent" },
      { id: "log", label: "log", labelLatex: String.raw`\log x`, ariaLabel: "Insert logarithm" },
      { id: "ln", label: "ln", labelLatex: String.raw`\ln x`, ariaLabel: "Insert natural logarithm" },
      { id: "exp", label: "eˣ", labelLatex: String.raw`e^x`, ariaLabel: "Insert exponential" },
    ],
  },
  {
    id: "symbols",
    label: "Symbols",
    items: [
      { id: "pi", label: "π", labelLatex: String.raw`\pi`, ariaLabel: "Insert pi" },
      { id: "theta", label: "θ", labelLatex: String.raw`\theta`, ariaLabel: "Insert theta" },
      { id: "alpha", label: "α", labelLatex: String.raw`\alpha`, ariaLabel: "Insert alpha" },
      { id: "beta", label: "β", labelLatex: String.raw`\beta`, ariaLabel: "Insert beta" },
      { id: "infty", label: "∞", labelLatex: String.raw`\infty`, ariaLabel: "Insert infinity" },
      { id: "pm", label: "±", labelLatex: String.raw`\pm`, ariaLabel: "Insert plus or minus" },
      { id: "times", label: "×", labelLatex: String.raw`\times`, ariaLabel: "Insert times" },
      { id: "cdot", label: "·", labelLatex: String.raw`\cdot`, ariaLabel: "Insert dot product" },
      { id: "leq", label: "≤", labelLatex: String.raw`\leq`, ariaLabel: "Insert less than or equal" },
      { id: "geq", label: "≥", labelLatex: String.raw`\geq`, ariaLabel: "Insert greater than or equal" },
      { id: "neq", label: "≠", labelLatex: String.raw`\neq`, ariaLabel: "Insert not equal" },
      { id: "approx", label: "≈", labelLatex: String.raw`\approx`, ariaLabel: "Insert approximately" },
      { id: "to", label: "→", labelLatex: String.raw`\to`, ariaLabel: "Insert right arrow" },
    ],
  },
];
