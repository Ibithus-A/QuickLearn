import { normalizeEmail, normalizeStudentName, type StudentAccount } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toRole(user: User): "tutor" | "student" {
  return user.user_metadata?.role === "tutor" ? "tutor" : "student";
}

function toStudentAccount(user: User): StudentAccount | null {
  if (toRole(user) !== "student") return null;
  const email = user.email ? normalizeEmail(user.email) : "";
  if (!email) return null;

  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? normalizeStudentName(user.user_metadata.full_name)
      : "";
  const fallbackName = normalizeStudentName(email.split("@")[0] ?? "");
  const name = fullName || fallbackName || "Student";

  return { name, email };
}

async function getAuthenticatedUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

async function listStudents(): Promise<StudentAccount[]> {
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw new Error(error.message);

  const students = data.users
    .map((user) => toStudentAccount(user))
    .filter((account): account is StudentAccount => Boolean(account));

  students.sort((left, right) => left.name.localeCompare(right.name));
  return students;
}

function buildUniqueStudentEmail(name: string, existingEmails: Set<string>) {
  const base = name.toLowerCase();
  let suffix = 0;

  while (suffix < 1000) {
    const localPart = suffix === 0 ? base : `${base}${suffix + 1}`;
    const candidate = normalizeEmail(`${localPart}@quicklearn.app`);
    if (!existingEmails.has(candidate)) return candidate;
    suffix += 1;
  }

  throw new Error("Unable to allocate a unique student email.");
}

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (toRole(user) === "student") {
    const account = toStudentAccount(user);
    return Response.json({ students: account ? [account] : [] });
  }

  try {
    const students = await listStudents();
    return Response.json({ students });
  } catch {
    return Response.json({ error: "Unable to load students." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (toRole(user) !== "tutor") {
    return Response.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const body = (await request.json()) as { name?: unknown; password?: unknown };
    if (typeof body.name !== "string") {
      return Response.json({ error: "Student name is required." }, { status: 400 });
    }
    if (typeof body.password !== "string") {
      return Response.json({ error: "Student password is required." }, { status: 400 });
    }

    const normalizedName = normalizeStudentName(body.name);
    const normalizedPassword = body.password.trim();
    if (!normalizedName) {
      return Response.json(
        { error: "Student name must contain letters or numbers." },
        { status: 400 },
      );
    }
    if (normalizedPassword.length < 8) {
      return Response.json(
        { error: "Student password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const admin = createAdminClient();
    const existingStudents = await listStudents();
    const existingNames = new Set(existingStudents.map((student) => student.name.toLowerCase()));
    if (existingNames.has(normalizedName.toLowerCase())) {
      return Response.json({ error: "A student with that name already exists." }, { status: 409 });
    }

    const existingEmails = new Set(existingStudents.map((student) => normalizeEmail(student.email)));
    const email = buildUniqueStudentEmail(normalizedName, existingEmails);

    const { data, error } = await admin.auth.admin.createUser({
      email,
      password: normalizedPassword,
      email_confirm: true,
      user_metadata: {
        role: "student",
        full_name: normalizedName,
      },
    });

    if (error || !data.user) {
      return Response.json({ error: error?.message ?? "Unable to create student." }, { status: 500 });
    }

    return Response.json({
      student: { name: normalizedName, email },
      credentials: { email, password: normalizedPassword },
    });
  } catch {
    return Response.json({ error: "Unable to create student." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (toRole(user) !== "tutor") {
    return Response.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const body = (await request.json()) as { email?: unknown };
    if (typeof body.email !== "string") {
      return Response.json({ error: "Student email is required." }, { status: 400 });
    }

    const targetEmail = normalizeEmail(body.email);
    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    const target = data.users.find((candidate) => normalizeEmail(candidate.email ?? "") === targetEmail);
    if (!target) {
      return Response.json({ error: "Student not found." }, { status: 404 });
    }
    if (toRole(target) !== "student") {
      return Response.json({ error: "Only student accounts can be removed here." }, { status: 400 });
    }

    const { error: deleteError } = await admin.auth.admin.deleteUser(target.id);
    if (deleteError) {
      return Response.json({ error: deleteError.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Unable to delete student." }, { status: 500 });
  }
}
