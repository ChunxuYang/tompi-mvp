import { useEffect } from "react";

import { useIdle } from "@mantine/hooks";
import { Editor } from "@tiptap/react";

export function useBlock(editor: Editor | null) {
  const idle = useIdle(2000, {
    initialState: false,
    events: ["mousedown", "keydown"],
  });

  useEffect(() => {
    setTimeout(() => {
      if (idle) {
        editor?.commands.triggerChat();
      } else {
        editor?.commands.clearAIAssistance();
      }
    });
  }, [idle, editor]);
}
