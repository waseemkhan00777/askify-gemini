import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.OPEN_AI_KEY ?? "");

interface IMessage {
  role: string;
  content: string;
}

export async function POST(req: Request) {
  const body = await req.json();
  const { messages } = body;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = messages.map((message: IMessage) => message.content)[0];
  const result = await model.generateContentStream(prompt);

  // Create a ReadableStream to send chunks to the client
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        controller.enqueue(new TextEncoder().encode(chunkText));
      }
      controller.close(); // Close the stream when done
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
