import React, { RefObject } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { UseFormRegister } from "react-hook-form";

interface FormData {
  prompt: string;
}

interface ChatInputProps {
  register: UseFormRegister<FormData>;
  isLoading: boolean;
  inputRef: RefObject<HTMLInputElement>;
}

export function ChatInput({
  register,
  isLoading,
  inputRef,
}: Readonly<ChatInputProps>) {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-3xl mx-auto p-4 bg-white shadow-lg">
      <input
        {...register("prompt")}
        ref={e => {
          register("prompt").ref(e);
          // Safe assignment using mutable ref callback
          if (e && inputRef) {
            (inputRef as { current: HTMLInputElement | null }).current = e;
          }
        }}
        className="max-w-3xl shadow-xl w-full mx-auto py-8 flex h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background"
        placeholder="Send a message..."
        disabled={isLoading}
      />
      <button
        type="submit"
        className={`absolute right-10 top-1/2 transform -translate-y-1/2 bg-transparent border-none cursor-${
          isLoading ? "" : "pointer"
        }`}
        disabled={isLoading}
      >
        <FaPaperPlane
          size={20}
          className={`text-blue-500 hover:${isLoading ? "" : "text-blue-800"}`}
        />
      </button>
    </div>
  );
}
