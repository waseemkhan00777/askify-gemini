import { Message } from "@/types";

export async function sendChatMessage(
  message: string,
  onChunkReceived: (text: string) => void,
): Promise<void> {
  if (!message) return;

  const messages: Message[] = [{ role: "user", content: message }];

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.body) return;

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let assistantResponse = "";

  // Read the stream chunk by chunk
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunkText = decoder.decode(value, { stream: true });
    assistantResponse += chunkText; // Accumulate the assistant's response

    onChunkReceived(assistantResponse);
  }
}
