<script setup lang="ts">
import { useStorage } from '@vueuse/core'

import { type JSONContent } from '@tiptap/vue-3';
const content = useStorage<JSONContent>('tompi-editor-content', {})
// const content = useState<JSONContent>('tompi-editor-content', () => ({}))


</script>

<template>
  <div class="w-[100svw] h-[100svh] flex flex-col p-5">
    <TiptapEditor v-model="content" />
    <!-- <pre><code>{{ content }}</code></pre> -->
  </div>
</template>
