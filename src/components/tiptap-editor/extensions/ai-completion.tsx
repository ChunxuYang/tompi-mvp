"use client";

import { useCompletion } from "ai/react";
import { useEffect, useRef } from "react";

import { getPrevText } from "@/lib/editor";
import { Editor } from "@tiptap/react";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    aiComplete: {
      /**
       * AI complete the current selection
       */
      aiComplete: () => ReturnType;
    };
  }
}

export const useAiCompletion = (editor: Editor | null) => {
  const prev = useRef("");

  const { completion, complete, isLoading, setCompletion } = useCompletion({
    id: "tompi-mvp",
    api: "/api/complete",
    onFinish: (_, completion) => {
      setCompletion("");
      editor?.commands.setTextSelection({
        from: editor.state.selection.from - completion.length,
        to: editor.state.selection.from,
      });

      editor?.commands.focus();
    },
  });

  useEffect(() => {
    const diff = completion.slice(prev.current.length);
    prev.current = completion;
    try {
      editor?.commands.insertContent(diff);
    } catch (e) {
      console.error(e);
    }
  }, [isLoading, completion, editor]);

  const triggerCompletion = () => {
    if (!editor) return;
    complete(getPrevText(editor));
  };

  return { triggerCompletion };
};
