"use client";

import { useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";

import { useLocalStorage } from "@mantine/hooks";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import AiAssistanceNode from "./extensions/ai-assistance";
import { useAiCompletion } from "./extensions/ai-completion";

import type { Editor } from "@tiptap/core";
export default function TiptapEditor() {
  const [content, setContent] = useLocalStorage<JSONContent | null>({
    key: "tompi-editor-content",
    defaultValue: null,
  });

  const hydrated = useRef(false);

  const debouncedUpdate = useDebouncedCallback(async (editor: Editor) => {
    const json = editor.getJSON();

    setContent(json);
  }, 1000);

  const editor = useEditor({
    content: content,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm sm:prose lg:prose-lg mx-auto focus:outline-none",
      },
    },

    onUpdate: ({ editor }) => {
      debouncedUpdate(editor);
    },

    extensions: [
      StarterKit,

      Placeholder.configure({
        placeholder: "Start writing your essay here...",
        emptyEditorClass: "empty-editor",
      }),

      AiAssistanceNode,
    ],
  });

  const { triggerCompletion } = useAiCompletion(editor);

  useEffect(() => {
    if (!editor || hydrated.current) return;
    if (content) {
      setTimeout(() => {
        editor.commands.setContent(content);
        hydrated.current = true;
      });
    }
  }, [content, editor]);

  return (
    <Card
      className="flex-1 relative p-5 border rounded-lg overflow-auto"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        editor?.chain().focus().run();
      }}
    >
      <Card className="fixed bottom-0 right-0 m-10 z-10">
        <CardContent className="p-4">
          <Button
            onClick={() => {
              if (!editor) return;
              triggerCompletion();
            }}
          >
            Complete
          </Button>
        </CardContent>
      </Card>

      <EditorContent editor={editor} />
    </Card>
  );
}
