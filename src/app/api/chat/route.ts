import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import NyayaDocument from "@/models/Document";
import { streamChat } from "@/lib/groq";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Rate limit: 50 chat messages per hour
  const rl = await checkRateLimit(session.user.id, "chat", 50, 3600);
  if (!rl.allowed) {
    return new Response("Chat rate limit reached", { status: 429 });
  }

  const { messages, documentId } = await req.json();
  await connectToDatabase();

  const document = await NyayaDocument.findOne({
    _id: documentId,
    userId: session.user.id,
  }).select("+textContent");

  if (!document) {
    return new Response("Document not found", { status: 404 });
  }

  const stream = await streamChat(
    messages,
    document.textContent ?? "",
    document.detectedType ?? "Legal Document"
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
      } catch (err) {
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
