import { promises as fs } from "node:fs";
import path from "node:path";
import { extractText, getDocumentProxy } from "unpdf";

type CacheEntry = {
  mtimeMs: number;
  text: string;
};

const MAX_PDF_TEXT_CHARS = 60_000;
const cache = new Map<string, CacheEntry>();
const PDF_SUBJECT_DIRECTORIES = ["Pure Mathematics", "Mechanics", "Statistics"];

export async function readPdfTextForSubtopic(title: string): Promise<string | null> {
  const safeTitle = title.trim();
  if (!safeTitle || safeTitle.includes("/") || safeTitle.includes("\\") || safeTitle.includes("..")) {
    return null;
  }

  const assetRoot = path.join(process.cwd(), "public", "assets");
  const candidatePaths = [
    path.join(assetRoot, `${safeTitle}.pdf`),
    ...PDF_SUBJECT_DIRECTORIES.map((directory) =>
      path.join(assetRoot, directory, `${safeTitle}.pdf`),
    ),
  ];

  let pdfPath: string | null = null;
  let stat = null;
  for (const candidatePath of candidatePaths) {
    try {
      stat = await fs.stat(candidatePath);
      pdfPath = candidatePath;
      break;
    } catch {
      // Try the next supported subject directory.
    }
  }
  if (!pdfPath || !stat) return null;

  const cached = cache.get(pdfPath);
  if (cached && cached.mtimeMs === stat.mtimeMs) {
    return cached.text;
  }

  const buffer = await fs.readFile(pdfPath);
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: true });
  const joined = Array.isArray(text) ? text.join("\n\n") : text;
  const trimmed = joined.slice(0, MAX_PDF_TEXT_CHARS);

  cache.set(pdfPath, { mtimeMs: stat.mtimeMs, text: trimmed });
  return trimmed;
}
