function stripOuterParens(value: string): string {
  const trimmed = value.trim();
  if (!trimmed.startsWith("(") || !trimmed.endsWith(")")) return trimmed;

  let depth = 0;
  for (let index = 0; index < trimmed.length; index += 1) {
    const char = trimmed[index];
    if (char === "(") depth += 1;
    if (char === ")") depth -= 1;
    if (depth === 0 && index < trimmed.length - 1) return trimmed;
  }
  return stripOuterParens(trimmed.slice(1, -1));
}

function findTopLevelOperator(value: string, operators: string[]) {
  let depth = 0;
  let inAbsoluteValue = false;
  for (let index = value.length - 1; index >= 0; index -= 1) {
    const char = value[index];
    if (char === "|") {
      inAbsoluteValue = !inAbsoluteValue;
      continue;
    }
    if (inAbsoluteValue) continue;
    if (char === ")") depth += 1;
    if (char === "(") depth -= 1;
    if (depth === 0 && operators.includes(char)) return index;
  }
  return -1;
}

function findTopLevelAddSubtract(value: string) {
  let depth = 0;
  let inAbsoluteValue = false;
  for (let index = value.length - 1; index > 0; index -= 1) {
    const char = value[index];
    if (char === "|") {
      inAbsoluteValue = !inAbsoluteValue;
      continue;
    }
    if (inAbsoluteValue) continue;
    if (char === ")") depth += 1;
    if (char === "(") depth -= 1;
    if (depth === 0 && (char === "+" || char === "-")) {
      const previous = value[index - 1];
      if ("(^_*/+-×·".includes(previous)) continue;
      return index;
    }
  }
  return -1;
}

function splitTopLevelArguments(value: string) {
  const argumentsList: string[] = [];
  let depth = 0;
  let inAbsoluteValue = false;
  let argumentStart = 0;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (char === "|") {
      inAbsoluteValue = !inAbsoluteValue;
      continue;
    }
    if (char === "(") depth += 1;
    if (char === ")") depth -= 1;
    if (char === "," && depth === 0 && !inAbsoluteValue) {
      argumentsList.push(value.slice(argumentStart, index));
      argumentStart = index + 1;
    }
  }
  argumentsList.push(value.slice(argumentStart));
  return argumentsList;
}

function formatPowerBase(value: string) {
  const trimmed = value.trim();
  if (trimmed.startsWith("(") && trimmed.endsWith(")")) {
    return `\\left(${formatPlainMath(trimmed.slice(1, -1))}\\right)`;
  }
  const formatted = formatPlainMath(trimmed);
  const hasBinaryAddSubtract = findTopLevelAddSubtract(trimmed) > 0;
  const hasTopLevelDivision = findTopLevelOperator(trimmed, ["/"]) > 0;
  return hasBinaryAddSubtract || hasTopLevelDivision ? `\\left(${formatted}\\right)` : formatted;
}

export function formatPlainMath(value: string, fallback = "\\square"): string {
  const trimmed = stripOuterParens(value);
  if (!trimmed) return fallback;
  if (trimmed.includes("\\")) return trimmed;

  const sqrtSymbolMatch = trimmed.match(/^√\((.*)\)$/);
  if (sqrtSymbolMatch) return `\\sqrt{${formatPlainMath(sqrtSymbolMatch[1])}}`;

  const absSymbolMatch = trimmed.match(/^\|(.*)\|$/);
  if (absSymbolMatch) return `\\left|${formatPlainMath(absSymbolMatch[1])}\\right|`;

  const addSubtractIndex = findTopLevelAddSubtract(trimmed);
  if (addSubtractIndex > 0 && addSubtractIndex < trimmed.length - 1) {
    return `${formatPlainMath(trimmed.slice(0, addSubtractIndex))}${trimmed[addSubtractIndex]}${formatPlainMath(trimmed.slice(addSubtractIndex + 1))}`;
  }

  const divisionIndex = findTopLevelOperator(trimmed, ["/"]);
  if (divisionIndex > 0 && divisionIndex < trimmed.length - 1) {
    return `\\frac{${formatPlainMath(trimmed.slice(0, divisionIndex))}}{${formatPlainMath(trimmed.slice(divisionIndex + 1))}}`;
  }

  const powerIndex = findTopLevelOperator(trimmed, ["^"]);
  if (powerIndex > 0 && powerIndex < trimmed.length - 1) {
    return `${formatPowerBase(trimmed.slice(0, powerIndex))}^{${formatPlainMath(trimmed.slice(powerIndex + 1))}}`;
  }

  const subscriptIndex = findTopLevelOperator(trimmed, ["_"]);
  if (subscriptIndex > 0 && subscriptIndex < trimmed.length - 1) {
    return `${formatPowerBase(trimmed.slice(0, subscriptIndex))}_{${formatPlainMath(trimmed.slice(subscriptIndex + 1))}}`;
  }

  const functionMatch = trimmed.match(/^([a-zA-Z]+)\((.*)\)$/);
  if (functionMatch) {
    const [, rawName, argument] = functionMatch;
    const name = rawName.toLowerCase();
    const args = splitTopLevelArguments(argument);
    if (name === "int" && (args.length === 2 || args.length === 4)) {
      const [integrand, variable, lower, upper] = args;
      const bounds = args.length === 4
        ? `_{${formatPlainMath(lower)}}^{${formatPlainMath(upper)}}`
        : "";
      return `\\int${bounds} ${formatPlainMath(integrand)}\\,d${formatPlainMath(variable, "x")}`;
    }
    if (name === "lim" && args.length === 3) {
      const [variable, approaches, expression] = args;
      return `\\lim_{${formatPlainMath(variable, "x")}\\to ${formatPlainMath(approaches)}} ${formatPlainMath(expression)}`;
    }
    if (name === "sum" && args.length === 4) {
      const [index, start, end, expression] = args;
      return `\\sum_{${formatPlainMath(index, "n")}=${formatPlainMath(start, "1")}}^{${formatPlainMath(end)}} ${formatPlainMath(expression)}`;
    }
    const argumentLatex = formatPlainMath(argument);
    if (["sin", "cos", "tan", "ln", "log"].includes(name)) {
      return `\\${name}\\left(${argumentLatex}\\right)`;
    }
    if (name === "sqrt") return `\\sqrt{${argumentLatex}}`;
    if (name === "abs") return `\\left|${argumentLatex}\\right|`;
    if (name === "arcsin" || name === "asin") return `\\sin^{-1}\\left(${argumentLatex}\\right)`;
    if (name === "arccos" || name === "acos") return `\\cos^{-1}\\left(${argumentLatex}\\right)`;
    if (name === "arctan" || name === "atan") return `\\tan^{-1}\\left(${argumentLatex}\\right)`;
  }

  return trimmed
    .replace(/\*/g, "\\cdot ")
    .replace(/π(?=[a-zA-Z])/g, "\\pi ")
    .replace(/π/g, "\\pi")
    .replace(/θ(?=[a-zA-Z])/g, "\\theta ")
    .replace(/θ/g, "\\theta")
    .replace(/α(?=[a-zA-Z])/g, "\\alpha ")
    .replace(/α/g, "\\alpha")
    .replace(/β(?=[a-zA-Z])/g, "\\beta ")
    .replace(/β/g, "\\beta")
    .replace(/∞/g, "\\infty")
    .replace(/±/g, "\\pm")
    .replace(/×/g, "\\times")
    .replace(/·/g, "\\cdot")
    .replace(/≤/g, "\\leq")
    .replace(/≥/g, "\\geq")
    .replace(/≠/g, "\\neq")
    .replace(/≈/g, "\\approx")
    .replace(/→/g, "\\to")
    .replace(/(?<!\\)\bpi\b/gi, "\\pi")
    .replace(/(?<!\\)\btheta\b/gi, "\\theta")
    .replace(/(?<!\\)\balpha\b/gi, "\\alpha")
    .replace(/(?<!\\)\bbeta\b/gi, "\\beta");
}

export function mathExpression(value: string, fallback = "\\square") {
  return formatPlainMath(value, fallback);
}
