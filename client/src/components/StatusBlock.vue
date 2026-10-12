<script setup>
defineProps({ error: { type: String, default: '' } });
defineEmits(['retry']);
</script>

<template>
  <div class="text-center py-20" role="status">
    <template v-if="error">
      <p class="text-lg font-semibold text-foreground mb-2">Restaurants didn't load</p>
      <p class="text-muted-foreground text-sm mb-6 max-w-md mx-auto">{{ error }}</p>
      <button
        class="text-sm font-medium text-primary border border-primary/30 px-5 py-2 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
        @click="$emit('retry')"
      >
        Try again
      </button>
    </template>
    <template v-else>
      <div class="w-8 h-8 rounded-full border-2 border-border border-t-primary animate-spin mx-auto mb-4" />
      <p class="text-sm text-muted-foreground">Loading restaurants…</p>
    </template>
  </div>
</template>
