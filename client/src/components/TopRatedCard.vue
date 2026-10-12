<script setup>
import { Bookmark, Star, ArrowRight } from 'lucide-vue-next';
import { useSaved } from '../composables/useSaved';

import RestaurantPhoto from '../components/RestaurantPhoto.vue';
defineProps({ r: { type: Object, required: true } });
const { isSaved, toggleSave } = useSaved();
</script>

<template>
  <div class="bg-card rounded-xl overflow-hidden border border-border group hover:shadow-lg transition-shadow duration-300">
    <div class="relative h-56 overflow-hidden">
      <RestaurantPhoto :src="r.image" :alt="r.name" :name="r.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <span v-if="r.badge" class="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
        {{ r.badge }}
      </span>
      <button
        class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
        :aria-label="isSaved(r.slug) ? 'Remove from saved' : 'Save restaurant'"
        @click.prevent="toggleSave(r.slug)"
      >
        <Bookmark class="w-4 h-4" :class="isSaved(r.slug) ? 'fill-primary text-primary' : 'text-foreground'" />
      </button>
    </div>
    <div class="p-5">
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs font-medium uppercase tracking-wide text-muted-foreground">{{ r.cuisine }}</span>
        <div class="flex items-center gap-1">
          <Star class="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span class="text-sm font-semibold text-foreground">{{ r.rating }} / 5</span>
        </div>
      </div>
      <h3 class="font-semibold text-foreground text-lg mb-2">{{ r.name }}</h3>
      <p class="text-sm text-muted-foreground leading-relaxed mb-4">{{ r.featuredDesc }}</p>
      <RouterLink :to="`/restaurant/${r.slug}`" class="text-sm font-medium text-primary flex items-center gap-1 hover:gap-2 transition-all">
        Discover this restaurant <ArrowRight class="w-4 h-4" />
      </RouterLink>
    </div>
  </div>
</template>
