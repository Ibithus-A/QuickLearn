export type UserRole = "tutor" | "student";

export type AuthenticatedAccount = {
  role: UserRole;
  name: string;
  email: string;
};
