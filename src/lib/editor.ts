import { Editor } from "@tiptap/core";

export const getPrevText = (
  editor: Editor,
  limit: number = 5000,
  offset: number = 0
) => {
  return editor.state.doc.textBetween(
    Math.max(0, editor.state.selection.from - limit),
    editor.state.selection.from - offset,
    "\n"
  );
};
