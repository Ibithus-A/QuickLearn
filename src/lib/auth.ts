const COMMON_FIRST_NAME_PREFIXES = [
  "muhammad",
  "mohammed",
  "ibrahim",
  "alexander",
  "christopher",
  "daniel",
  "joseph",
  "michael",
  "matthew",
  "benjamin",
  "charlotte",
  "emily",
  "hannah",
  "sophia",
  "olivia",
  "alex",
  "david",
  "james",
  "sarah",
  "jacob",
  "ahmed",
  "ibra",
].sort((left, right) => right.length - left.length);

function toDisplayName(value: string): string {
  const token = value.trim().split(/\s+/)[0].replace(/[^a-z0-9]/gi, "");
  if (!token) return "";
  return `${token[0].toUpperCase()}${token.slice(1)}`;
}

function splitMergedLowercaseToken(token: string): string {
  const normalized = token.toLowerCase();

  for (const prefix of COMMON_FIRST_NAME_PREFIXES) {
    if (!normalized.startsWith(prefix)) continue;
    if (normalized.length <= prefix.length) return prefix;

    const suffix = normalized.slice(prefix.length);
    if (suffix.length >= 2) {
      return prefix;
    }
  }

  return token;
}

function extractFirstNameToken(value: string): string {
  const source = value.includes("@") ? (value.split("@")[0] ?? "") : value;
  const normalized = source
    .trim()
    .replace(/[._+-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2");
  const firstToken = normalized.split(/\s+/).find(Boolean) ?? "";
  const alphaPrefix = (firstToken.match(/^[a-zA-Z]+/)?.[0] ?? "").trim();

  if (!alphaPrefix) {
    return firstToken.replace(/[^a-z0-9]/gi, "");
  }

  if (/^[a-z]+$/.test(alphaPrefix) && alphaPrefix.length >= 9) {
    return splitMergedLowercaseToken(alphaPrefix);
  }

  return alphaPrefix;
}

export function resolveDisplayFirstName(
  name: string,
  email: string,
  role: "tutor" | "student",
): string {
  const normalizedName = normalizeFirstName(name);
  if (normalizedName) return normalizedName;

  const emailName = normalizeFirstName(email);
  if (emailName) return emailName;

  return role === "tutor" ? "Tutor" : "Student";
}

export function normalizeStudentName(value: string): string {
  return toDisplayName(value);
}

export function normalizeFirstName(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const firstToken = extractFirstNameToken(trimmed);

  return toDisplayName(firstToken ?? "");
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
}
