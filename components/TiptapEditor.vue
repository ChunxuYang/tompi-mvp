<script setup lang="ts">
import { useEditor, EditorContent, type JSONContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

const content = defineModel<JSONContent>();

const editor = useEditor({
  content: content.value,
  // content: '<p>Tiptap with Nuxt.js</p>',
  editorProps: {
    attributes: {
      class:
        "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
    },
  },
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: "Start writing your essay here...",
      emptyEditorClass: "empty-editor",
    }),
  ],
  onUpdate: ({ editor }) => {
    content.value = editor.getJSON();
  },
});
</script>

<template>
  <div class="flex-1 p-5 border rounded-lg" @click.self="editor?.commands.focus()">
    <editor-content :editor="editor" />
  </div>
</template>

<style>
.tiptap p.empty-editor:first-child::before {
  @apply text-gray-400 content-[attr(data-placeholder)] float-left h-0 pointer-events-none;
}
</style>
