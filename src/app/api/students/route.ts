import { promises as fs } from "node:fs";
import path from "node:path";
import {
  buildStudentEmail,
  DEFAULT_STUDENT_ACCOUNTS,
  normalizeStudentName,
  type StudentAccount,
} from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STUDENTS_FILE_PATH = path.join(process.cwd(), "src/lib/data/students.json");

function sanitizeStudents(input: unknown): StudentAccount[] {
  if (!Array.isArray(input)) return DEFAULT_STUDENT_ACCOUNTS;
  if (input.length === 0) return [];

  const unique = new Map<string, StudentAccount>();
  for (const entry of input) {
    if (!entry || typeof entry !== "object") continue;
    const candidate = entry as Partial<StudentAccount>;
    if (typeof candidate.name !== "string") continue;

    const normalizedName = normalizeStudentName(candidate.name);
    if (!normalizedName) continue;

    const key = normalizedName.toLowerCase();
    if (unique.has(key)) continue;

    unique.set(key, {
      name: normalizedName,
      email: buildStudentEmail(normalizedName),
    });
  }

  if (unique.size === 0) return [];
  return [...unique.values()].sort((left, right) => left.name.localeCompare(right.name));
}

async function readStudents(): Promise<StudentAccount[]> {
  try {
    const raw = await fs.readFile(STUDENTS_FILE_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return sanitizeStudents(parsed);
  } catch {
    return DEFAULT_STUDENT_ACCOUNTS;
  }
}

async function writeStudents(students: StudentAccount[]) {
  const sorted = [...students].sort((left, right) => left.name.localeCompare(right.name));
  await fs.writeFile(STUDENTS_FILE_PATH, `${JSON.stringify(sorted, null, 2)}\n`, "utf8");
}

export async function GET() {
  const students = await readStudents();
  return Response.json({ students });
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as { students?: unknown };
    const students = sanitizeStudents(body.students);
    await writeStudents(students);
    return Response.json({ students });
  } catch {
    return Response.json(
      { error: "Unable to update students file." },
      { status: 500 },
    );
  }
}
