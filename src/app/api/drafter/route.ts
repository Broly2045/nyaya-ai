import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { streamLegalDraft } from "@/lib/groq";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Rate limit: 20 drafts per hour
  const rl = await checkRateLimit(session.user.id, "drafter", 20, 3600);
  if (!rl.allowed) {
    return new Response("Drafting rate limit reached", { status: 429 });
  }

  const { documentType, jurisdiction, partyDetails, facts } = await req.json();

  if (!documentType || !facts) {
    return new Response("Missing details", { status: 400 });
  }

  const stream = await streamLegalDraft(
    documentType,
    jurisdiction || "Hon'ble Court",
    partyDetails || "Not specified",
    facts
  );

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
            );
          }
        }
      } catch {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: "Stream error" })}\n\n`
          )
        );
      } finally {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
