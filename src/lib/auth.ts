import type { AuthenticatedAccount, UserRole } from "@/types/auth";

type AccountProfile = {
  name: string;
  email: string;
  password: string;
};

const STUDENT_COUNT = 10;
const STUDENT_EMAIL_PATTERN = /^student(10|[1-9])@quicklearn\.com$/i;

export const TUTOR_ACCOUNT: AccountProfile = {
  name: "Tutor",
  email: "Tutor@QuickLearn.com",
  password: "Tutor123",
};

export const STUDENT_ACCOUNTS: Array<{ name: string; email: string }> = Array.from(
  { length: STUDENT_COUNT },
  (_, index) => {
    const number = index + 1;
    return {
      name: `Student${number}`,
      email: `Student${number}@QuickLearn.com`,
    };
  },
);

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function getStudentFromCredentials(
  email: string,
  password: string,
): AuthenticatedAccount | null {
  const normalizedEmail = normalizeEmail(email);
  const match = normalizedEmail.match(STUDENT_EMAIL_PATTERN);
  if (!match) return null;

  const studentNumber = match[1];
  const expectedPassword = `Student${studentNumber}`;
  if (password !== expectedPassword) return null;

  return {
    role: "student",
    name: `Student${studentNumber}`,
    email: `Student${studentNumber}@QuickLearn.com`,
  };
}

export function authenticateCredentials(
  role: UserRole,
  email: string,
  password: string,
): AuthenticatedAccount | null {
  if (role === "tutor") {
    const isTutorMatch =
      normalizeEmail(email) === normalizeEmail(TUTOR_ACCOUNT.email) &&
      password === TUTOR_ACCOUNT.password;

    return isTutorMatch
      ? { role: "tutor", name: TUTOR_ACCOUNT.name, email: TUTOR_ACCOUNT.email }
      : null;
  }

  return getStudentFromCredentials(email, password);
}
