"use client";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Message } from "@/types";
import { sendChatMessage } from "@/lib/api";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";

interface FormData {
  prompt: string;
}

type MessageWithId = Message & { id: string };

// Function to update messages with assistant response
function updateMessagesWithResponse(
  messages: MessageWithId[],
  assistantResponse: string,
): MessageWithId[] {
  const updatedMessages = [...messages];
  const assistantMessageIndex = updatedMessages.findIndex(
    msg => msg.role === "assistant" && !msg.id.startsWith("user-"),
  );

  if (assistantMessageIndex >= 0) {
    // Update existing assistant message
    updatedMessages[assistantMessageIndex].content = assistantResponse;
  } else {
    // Add new assistant message
    updatedMessages.push({
      role: "assistant",
      content: assistantResponse,
      id: `assistant-${Date.now()}`,
    });
  }
  return updatedMessages;
}

export interface ChatInterfaceProps {
  className?: string;
}

export function ChatInterface({
  className = "",
}: Readonly<ChatInterfaceProps>) {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [messages, setMessages] = useState<MessageWithId[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleGenerateMessage = useCallback(
    async (data: FormData) => {
      const prompt = data.prompt;
      if (!prompt) return;

      const userMessageId = `user-${Date.now()}`;
      setMessages(prev => [
        ...prev,
        { role: "user", content: prompt, id: userMessageId },
      ]);
      setIsLoading(true);
      reset();

      await sendChatMessage(prompt, assistantResponse => {
        setMessages(prev =>
          updateMessagesWithResponse(prev, assistantResponse),
        );
      });

      setIsLoading(false);
      inputRef?.current?.focus();
    },
    [reset],
  );

  return (
    <div className={`pt-4 pb-32 ${className}`}>
      <form onSubmit={handleSubmit(handleGenerateMessage)}>
        <ChatInput
          register={register}
          isLoading={isLoading}
          inputRef={inputRef}
        />
      </form>
      <div className="max-w-3xl mx-auto py-6 flex flex-col space-y-4">
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
      </div>
    </div>
  );
}
