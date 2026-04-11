import { NextResponse } from "next/server";

type AssistantMessage = {
  role: "user" | "assistant";
  content: string;
};

type ArthurRequestBody = {
  pageTitle?: string;
  pageContent?: string;
  messages?: AssistantMessage[];
};

const COHERE_API_URL = "https://api.cohere.com/v2/chat";
const ARTHUR_SYSTEM_PROMPT = `
You are Arthur, a friendly AI study assistant inside the Excelora workspace.
Be concise, accurate, and encouraging.
Use the provided page title and page content as the primary context when answering.
If the page content is sparse or missing, say that you are working from limited page context.
Prefer helpful study actions like explanation, recap, quizzes, worked examples, and revision support.
Do not claim to see anything outside the provided page context and user messages.
`.trim();

export async function POST(request: Request) {
  const apiKey = process.env.COHERE_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing COHERE_API_KEY on the server." },
      { status: 500 },
    );
  }

  try {
    const body = (await request.json()) as ArthurRequestBody;
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const pageTitle = body.pageTitle?.trim() ?? "Untitled page";
    const pageContent = body.pageContent?.trim() ?? "";
    const latestUserMessage = messages[messages.length - 1];

    if (!latestUserMessage || latestUserMessage.role !== "user" || !latestUserMessage.content.trim()) {
      return NextResponse.json(
        { error: "A user message is required." },
        { status: 400 },
      );
    }

    const conversation = messages.map((message) => ({
      role: message.role,
      content: [{ type: "text", text: message.content }],
    }));

    const cohereResponse = await fetch(COHERE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command-a-03-2025",
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content: [
              {
                type: "text",
                text: `${ARTHUR_SYSTEM_PROMPT}\n\nPage title: ${pageTitle}\n\nPage content:\n${pageContent || "(blank page)"}`,
              },
            ],
          },
          ...conversation,
        ],
      }),
    });

    const payload = (await cohereResponse.json()) as {
      message?: { content?: Array<{ type?: string; text?: string }> };
      error?: string | { message?: string };
    };

    if (!cohereResponse.ok) {
      const providerError =
        typeof payload.error === "string"
          ? payload.error
          : payload.error?.message ?? "Cohere request failed.";
      return NextResponse.json({ error: providerError }, { status: cohereResponse.status });
    }

    const text =
      payload.message?.content
        ?.filter((item) => item.type === "text" && typeof item.text === "string")
        .map((item) => item.text?.trim() ?? "")
        .filter(Boolean)
        .join("\n\n") ?? "";

    if (!text) {
      return NextResponse.json(
        { error: "Cohere returned an empty response." },
        { status: 502 },
      );
    }

    return NextResponse.json({ message: text });
  } catch {
    return NextResponse.json(
      { error: "Arthur could not process that request." },
      { status: 500 },
    );
  }
}
