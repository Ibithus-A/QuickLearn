export type StudentAccount = {
  name: string;
  email: string;
};

const DEFAULT_STUDENT_NAMES = [
  "Alex",
  "Blake",
  "Casey",
  "Drew",
  "Eden",
  "Harper",
  "Jordan",
  "Logan",
  "Parker",
  "Riley",
] as const;

function toDisplayName(value: string): string {
  const token = value.trim().split(/\s+/)[0].replace(/[^a-z0-9]/gi, "");
  if (!token) return "";
  return `${token[0].toUpperCase()}${token.slice(1)}`;
}

export function getDefaultStudentName(index: number): string {
  if (index < 0) return "Learner";
  return DEFAULT_STUDENT_NAMES[index] ?? `Learner${index + 1}`;
}

export function normalizeStudentName(value: string): string {
  return toDisplayName(value);
}

export function buildStudentEmail(studentName: string): string {
  const normalizedName = normalizeStudentName(studentName);
  if (!normalizedName) return "";
  return `${normalizedName}@QuickLearn.com`;
}

export function buildStudentPassword(studentName: string): string {
  return normalizeStudentName(studentName);
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export const DEFAULT_STUDENT_ACCOUNTS: StudentAccount[] = DEFAULT_STUDENT_NAMES.map((name) => ({
  name,
  email: buildStudentEmail(name),
}));
