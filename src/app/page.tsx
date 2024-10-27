"use client";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FaPaperPlane } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

interface IMessage {
  role: string;
  content: string;
}

interface FormData {
  prompt: string;
}

export default function Home() {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [disableInput, setDisableInput] = useState(false);

  const handleGenerateMessage = useCallback(
    async (data: FormData) => {
      const prompt = data.prompt;
      if (!prompt) return;

      setMessages(prev => [...prev, { role: "user", content: prompt }]);
      setDisableInput(true);

      reset();

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
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

        // Update only the last assistant message in the messages array
        setMessages(prev => {
          const updatedMessages = [...prev];
          // Update the last message to keep the assistant's response
          if (
            updatedMessages.length > 0 &&
            updatedMessages[updatedMessages.length - 1].role === "assistant"
          ) {
            updatedMessages[updatedMessages.length - 1].content =
              assistantResponse;
          } else {
            // If there is no assistant message yet, add one
            updatedMessages.push({
              role: "assistant",
              content: assistantResponse,
            });
          }
          setDisableInput(false);
          return updatedMessages;
        });
      }
    },
    [reset],
  );

  return (
    <div className="pt-4 pb-32">
      <form
        onSubmit={handleSubmit(handleGenerateMessage)}
        className="fixed bottom-0 left-0 right-0 max-w-3xl mx-auto p-4 bg-white shadow-lg"
      >
        <input
          {...register("prompt")}
          className="max-w-3xl shadow-xl w-full mx-auto py-8 flex h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background"
          placeholder="Send a message..."
          disabled={disableInput}
        />
        <button
          type="submit"
          className="absolute right-10 top-1/2 transform -translate-y-1/2 bg-transparent border-none cursor-pointer"
        >
          <FaPaperPlane
            size={20}
            className="text-blue-500 hover:text-blue-800"
          />
        </button>
      </form>
      <div className="max-w-3xl mx-auto py-6 flex flex-col space-y-4">
        {messages.map((msg: IMessage, index: number) => (
          <div
            key={index}
            className={`p-3 rounded-md ${
              msg.role === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-black self-start"
            }`}
          >
            <ReactMarkdown className={`block whitespace-pre-wrap`}>
              {msg.content}
            </ReactMarkdown>
          </div>
        ))}
      </div>
    </div>
  );
}
