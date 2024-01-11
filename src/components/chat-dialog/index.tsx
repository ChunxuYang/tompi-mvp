"use client";

import { Message, useChat } from "ai/react";

import { cn } from "@/lib/utils";
import { PaperPlaneIcon, StopIcon, TrashIcon } from "@radix-ui/react-icons";

import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Textarea } from "../ui/textarea";

interface ChatDialogProps {
  essay: string;
}

export default function ChatDialog({ essay }: ChatDialogProps) {
  const initialMessages: Message[] = [
    {
      id: "tompi-mvp",
      role: "system",
      content: "The following is an essay. Do what the user says. \n" + essay,
    },
  ];

  const {
    messages,
    input,
    handleInputChange,
    setMessages,
    append,
    setInput,
    stop,
    isLoading,
  } = useChat({
    initialMessages,

    id: "tompi-mvp",
  });

  return (
    <>
      <CardHeader className="p-2 text-center border-b flex flex-row justify-between items-center">
        <span className="text-sm">Chat with GPT-3.5-Turbo</span>
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => {
            if (!isLoading) setMessages(initialMessages);
          }}
        >
          <TrashIcon />
        </Button>
      </CardHeader>
      <CardContent className="overflow-y-auto max-h-96 pt-2 w-96">
        <div className="space-y-4">
          {messages
            .filter((m) => m.role !== "system")
            .map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                  message.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {message.content}
              </div>
            ))}
        </div>
      </CardContent>
      <CardFooter className="p-2">
        <form className="w-full relative border rounded-xl">
          <Textarea
            value={input}
            onChange={handleInputChange}
            autoResize
            rows={1}
            className="max-h-32 resize-none border-0 bg-transparent py-[10px] pr-10 focus:ring-0 focus-visible:ring-0"
            placeholder="Enter a prompt for AI assistance..."
          ></Textarea>
          <Button
            className="absolute bottom-1 right-1 rounded-lg w-8 h-8"
            size={"icon"}
            // disabled={prompt.length === 0}
            type={"submit"}
            onClick={async (e) => {
              e.preventDefault();

              if (isLoading) stop();
              await append({
                role: "user",
                content: input,
              });

              setInput("");
            }}
          >
            {isLoading ? <StopIcon /> : <PaperPlaneIcon />}

            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </>
  );
}
