<script setup>
import { Star, ArrowRight, Bookmark, MapPin } from 'lucide-vue-next';
import { useSaved } from '../composables/useSaved';

import RestaurantPhoto from '../components/RestaurantPhoto.vue';
defineProps({
  r: { type: Object, required: true },
  rank: { type: Number, required: true },
});
const { isSaved, toggleSave } = useSaved();
</script>

<template>
  <div class="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
    <div class="flex flex-col sm:flex-row">
      <div class="relative w-full sm:w-52 h-44 sm:h-auto shrink-0 overflow-hidden">
        <RestaurantPhoto :src="r.image" :alt="r.name" :name="r.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div class="absolute top-3 left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow">
          {{ rank }}
        </div>
        <span v-if="r.badge" class="absolute bottom-3 left-3 bg-accent text-accent-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
          {{ r.badge }}
        </span>
      </div>
      <div class="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">{{ r.cuisine }}</p>
              <h3 class="font-display text-xl font-semibold text-foreground mb-1">{{ r.name }}</h3>
              <p class="text-sm text-muted-foreground">{{ r.description }}</p>
            </div>
            <button
              class="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors shrink-0"
              :aria-label="isSaved(r.slug) ? 'Remove from saved' : 'Save restaurant'"
              @click="toggleSave(r.slug)"
            >
              <Bookmark class="w-4 h-4" :class="isSaved(r.slug) ? 'fill-primary text-primary' : 'text-muted-foreground'" />
            </button>
          </div>
          <p v-if="r.featured" class="text-sm text-muted-foreground leading-relaxed mt-3">{{ r.featuredDesc }}</p>
        </div>
        <div class="flex items-center justify-between mt-4 flex-wrap gap-3">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-1.5">
              <Star class="w-4 h-4 fill-amber-400 text-amber-400" />
              <span class="text-sm font-semibold text-foreground">{{ r.rating.toFixed(1) }}</span>
              <span class="text-xs text-muted-foreground">({{ r.reviewCount }} reviews)</span>
            </div>
            <span class="text-xs text-muted-foreground font-medium">{{ r.price }}</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1">
              <MapPin class="w-3 h-3 text-muted-foreground" />
              <span class="text-xs text-muted-foreground">{{ r.address }}</span>
            </div>
            <RouterLink :to="`/restaurant/${r.slug}`" class="text-sm font-medium text-primary flex items-center gap-1 hover:gap-2 transition-all">
              View <ArrowRight class="w-3.5 h-3.5" />
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
