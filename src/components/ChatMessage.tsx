import React from "react";
import ReactMarkdown from "react-markdown";
import { Message } from "@/types";

interface MessageProps {
  message: Message;
}

export function ChatMessage({ message }: Readonly<MessageProps>) {
  return (
    <div
      className={`p-3 rounded-md ${
        message.role === "user"
          ? "bg-blue-500 text-white self-end"
          : "bg-gray-200 text-black self-start"
      }`}
    >
      <ReactMarkdown className="block whitespace-pre-wrap">
        {message.content}
      </ReactMarkdown>
    </div>
  );
}
