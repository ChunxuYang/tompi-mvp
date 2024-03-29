"use client";

import { memo } from "react";

import AICompletion from "@/components/ai-completion";
import ChatDialog from "@/components/chat-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getPrevText } from "@/lib/editor";
import { ChatBubbleIcon, MagicWandIcon } from "@radix-ui/react-icons";
import { mergeAttributes } from "@tiptap/core";
import {
  Editor,
  findChildren,
  Node,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    aiAssistance: {
      /**
       * Comments will be added to the autocomplete.
       */
      // yourCommand: (someProp: any) => ReturnType,
      triggerChat: () => ReturnType;
      triggerComplete: () => ReturnType;
      clearAIAssistance: () => ReturnType;
    };
  }
}

interface AIAssistanceComponentProps {
  editor: Editor;
  node: any;
  deleteNode: () => void;
  getPos: () => any;
}

type ChatNodeAttrs = {
  type: "chat";
};

type CompleteNodeAttrs = {
  type: "complete";
  completionText: string;
};

type AIAssistanceNodeAttrs = ChatNodeAttrs | CompleteNodeAttrs;

const AIAssistanceComponent = memo((props: AIAssistanceComponentProps) => {
  const { editor, getPos, node, deleteNode } = props;
  const { type } = node.attrs as AIAssistanceNodeAttrs;
  return (
    <NodeViewWrapper className="inline group">
      <div className="inline w-12 text-sm outline outline-orange-400 text-muted-foreground invisible group-hover:visible"></div>
      <div className="inline absolute -right-12">
        <DropdownMenu
          onOpenChange={(open) => {
            if (open) {
              editor.commands.setTextSelection({
                from: getPos(),
                to: getPos(),
              });
            }
          }}
        >
          <DropdownMenuTrigger asChild>
            <Button size={"icon"} className="rounded-full">
              {
                {
                  chat: <ChatBubbleIcon />,
                  complete: <MagicWandIcon />,
                }[type]
              }
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            className={"rounded-xl p-0"}
            sideOffset={15}
            align="start"
          >
            {
              {
                chat: <ChatDialog essay={editor.getText()} />,
                complete: (
                  <AICompletion
                    currentText={getPrevText(editor)}
                    completionText={node.attrs.completionText || ""}
                    onAccept={(completion: string) => {
                      editor.commands.insertContentAt(getPos(), completion);
                      deleteNode();
                    }}
                    onDismiss={() => {
                      deleteNode();
                    }}
                  />
                ),
              }[type]
            }
            {/* <ChatDialog essay={editor.getText()} /> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </NodeViewWrapper>
  );
});

interface AIAssistanceNodeOptions {
  complete: (text: string) => Promise<string>;
}

const AiAssistanceNode = Node.create<AIAssistanceNodeOptions, {}>({
  name: "aiAssistance",
  group: "inline",
  content: "inline*",
  inline: true,
  atom: true,

  addOptions() {
    return {
      complete: (text: string) => {
        return Promise.resolve("text");
      },
    };
  },

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

  addAttributes() {
    return {
      type: {
        default: "chat",
      },
      completionText: {
        default: "",
      },
    };
  },

  addCommands() {
    return {
      triggerChat:
        () =>
        ({ commands, editor }) => {
          return commands.insertContent({
            type: this.type.name,
            attrs: { type: "chat" },
          });
        },
      triggerComplete:
        () =>
        ({ commands }) => {
          this.options
            .complete(getPrevText(this.editor))
            .then((text) => {
              return commands.insertContent({
                type: this.type.name,
                attrs: { completionText: text, type: "complete" },
              });
            })
            .catch((e) => console.error(e));

          return true;
        },

      clearAIAssistance:
        () =>
        ({ commands }) => {
          const node = findChildren(this.editor.state.doc, (node) => {
            return node.type.name === this.type.name;
          })[0];
          if (!node) return false;
          console.log("clearing", node);

          commands.deleteRange({
            from: node.pos,
            to: node.pos + node.node.nodeSize,
          });

          return true;
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Shift-Enter": () => {
        return this.editor
          .chain()
          .insertContentAt(this.editor.state.selection.head, {
            type: this.type.name,
            attrs: {
              type: "chat",
            },
          })
          .focus()
          .run();
      },
      "Mod-Enter": () => {
        this.options
          .complete(getPrevText(this.editor))
          .then((text) => {
            return this.editor
              .chain()
              .insertContentAt(this.editor.state.selection.head, {
                type: this.type.name,
                attrs: { completionText: text, type: "complete" },
                //   type: "complete",
                //   completionText: text,
                // },
              })
              .focus()
              .run();
          })
          .catch((e) => console.error(e));

        return true;
      },
    };
  },
});

export default AiAssistanceNode;
