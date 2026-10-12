<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  name: { type: String, default: '' },
});

const failed = ref(false);
watch(() => props.src, () => (failed.value = false));

const initials = computed(() =>
  props.name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
);
</script>

<template>
  <img v-if="src && !failed" :src="src" :alt="alt" @error="failed = true" />
  <div
    v-else
    role="img"
    :aria-label="alt || name"
    class="bg-gradient-to-br from-primary to-muted-foreground flex items-center justify-center font-display text-4xl text-primary-foreground/70"
  >
    {{ initials }}
  </div>
</template>
