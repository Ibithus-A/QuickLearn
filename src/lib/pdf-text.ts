import { promises as fs } from "node:fs";
import path from "node:path";
import { extractText, getDocumentProxy } from "unpdf";

type CacheEntry = {
  mtimeMs: number;
  text: string;
};

const MAX_PDF_TEXT_CHARS = 60_000;
const cache = new Map<string, CacheEntry>();

function sanitizeNodeId(nodeId: string): string | null {
  if (!/^[a-zA-Z0-9_-]+$/.test(nodeId)) return null;
  return nodeId;
}

export async function readPdfTextForNode(nodeId: string): Promise<string | null> {
  const safeId = sanitizeNodeId(nodeId);
  if (!safeId) return null;

  const pdfPath = path.join(process.cwd(), "public", "pdfs", `${safeId}.pdf`);

  let stat;
  try {
    stat = await fs.stat(pdfPath);
  } catch {
    return null;
  }

  const cached = cache.get(safeId);
  if (cached && cached.mtimeMs === stat.mtimeMs) {
    return cached.text;
  }

  const buffer = await fs.readFile(pdfPath);
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: true });
  const joined = Array.isArray(text) ? text.join("\n\n") : text;
  const trimmed = joined.slice(0, MAX_PDF_TEXT_CHARS);

  cache.set(safeId, { mtimeMs: stat.mtimeMs, text: trimmed });
  return trimmed;
}
