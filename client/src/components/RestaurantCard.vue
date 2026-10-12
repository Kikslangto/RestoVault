<script setup>
import { Bookmark, Star, MapPin, ArrowRight } from 'lucide-vue-next';
import { useSaved } from '../composables/useSaved';

import RestaurantPhoto from '../components/RestaurantPhoto.vue';
defineProps({ r: { type: Object, required: true } });
const { isSaved, toggleSave } = useSaved();
</script>

<template>
  <div class="bg-card rounded-xl overflow-hidden border border-border group hover:shadow-lg transition-shadow duration-300">
    <div class="relative h-52 overflow-hidden">
      <RestaurantPhoto :src="r.image" :alt="r.name" :name="r.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <button
        class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
        :aria-label="isSaved(r.slug) ? 'Remove from saved' : 'Save restaurant'"
        @click.prevent="toggleSave(r.slug)"
      >
        <Bookmark class="w-4 h-4" :class="isSaved(r.slug) ? 'fill-primary text-primary' : 'text-foreground'" />
      </button>
    </div>
    <div class="p-4">
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs font-medium uppercase tracking-wide text-muted-foreground">{{ r.cuisine }}</span>
        <span class="text-xs text-muted-foreground font-medium">{{ r.price }}</span>
      </div>
      <h3 class="font-semibold text-foreground text-base mb-1">{{ r.name }}</h3>
      <p class="text-sm text-muted-foreground mb-3">{{ r.description }}</p>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Star class="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span class="text-sm font-medium text-foreground">{{ r.rating.toFixed(1) }}</span>
          <span class="text-xs text-muted-foreground">({{ r.reviewCount }})</span>
        </div>
        <RouterLink :to="`/restaurant/${r.slug}`" class="text-xs font-medium text-primary flex items-center gap-0.5 hover:underline">
          View details <ArrowRight class="w-3 h-3" />
        </RouterLink>
      </div>
      <div class="flex items-center gap-1 mt-2">
        <MapPin class="w-3 h-3 text-muted-foreground shrink-0" />
        <span class="text-xs text-muted-foreground truncate">{{ r.address }}</span>
      </div>
    </div>
  </div>
</template>
