"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import {
  ChatBubbleIcon,
  CursorTextIcon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";
import { mergeAttributes, Node } from "@tiptap/core";
import { Editor, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";

import { useAiCompletion } from "./ai-completion";

interface AIAssistanceComponentProps {
  editor: Editor;
  node: Node;
  deleteNode: () => void;
  getPos: () => any;
}

const AIAssistanceComponent = (props: AIAssistanceComponentProps) => {
  const { editor, deleteNode, getPos } = props;
  const { triggerCompletion } = useAiCompletion(editor);
  const [prompt, setPrompt] = useState("");
  return (
    <NodeViewWrapper className="inline group">
      <div className="inline w-12 text-sm outline outline-orange-400 text-muted-foreground invisible group-hover:visible"></div>
      <div className="inline absolute -right-12">
        <DropdownMenu
          onOpenChange={(open) => {
            if (open) {
              console.log("clicked");
              editor.commands.setTextSelection({
                from: getPos(),
                to: getPos(),
              });
            }
          }}
        >
          <DropdownMenuTrigger asChild>
            <Button size={"icon"} className="rounded-full">
              <ChatBubbleIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            className="p-3 space-y-2"
            sideOffset={15}
            align="start"
          >
            <div className="w-full relative border rounded-xl">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                autoResize
                rows={1}
                className="w-80 resize-none border-0 bg-transparent py-[10px] pr-10 focus:ring-0 focus-visible:ring-0"
                placeholder="Enter a prompt for AI assistance..."
              ></Textarea>
              <Button
                className="absolute bottom-1 right-1 rounded-lg w-8 h-8"
                size={"icon"}
                disabled={prompt.length === 0}
                onClick={() => {
                  deleteNode();
                  triggerCompletion();
                }}
              >
                <PaperPlaneIcon />
              </Button>
            </div>
            <div className="w-full flex">
              <Button
                variant="outline"
                size={"sm"}
                onClick={() => {
                  deleteNode();
                }}
              >
                Dismiss
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </NodeViewWrapper>
  );
};

const AiAssistanceNode = Node.create({
  name: "aiAssistance",
  group: "inline",
  content: "inline*",
  inline: true,
  atom: true,

  parseHTML() {
    return [
      {
        tag: "ai-assistance",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["ai-assistance", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AIAssistanceComponent);
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Enter": () => {
        return this.editor
          .chain()
          .insertContentAt(this.editor.state.selection.head, {
            type: this.type.name,
          })
          .focus()
          .run();
      },
    };
  },
});

export default AiAssistanceNode;
