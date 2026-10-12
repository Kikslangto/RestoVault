<script setup>
import { computed } from 'vue';
import { Bookmark, ArrowRight, Trash2, MapPin, Star } from 'lucide-vue-next';
import { useSaved } from '../composables/useSaved';
import { useRestaurants } from '../composables/useRestaurants';
import StatusBlock from '../components/StatusBlock.vue';

import RestaurantPhoto from '../components/RestaurantPhoto.vue';
const { saved, toggleSave, clearSaved } = useSaved();

// Fetch the saved restaurants once from MongoDB. Un-saving afterwards just hides them locally.
const initialSlugs = saved.value.slice();
const { restaurants, loading, error, reload } = useRestaurants(() =>
  initialSlugs.length ? { slugs: initialSlugs.join(',') } : null
);

const savedRestaurants = computed(() => restaurants.value.filter((r) => saved.value.includes(r.slug)));
</script>

<template>
  <div>
    <section class="bg-card border-b border-border">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div class="flex items-center gap-3 mb-2">
          <Bookmark class="w-5 h-5 text-primary" />
          <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">Your collection</p>
        </div>
        <h1 class="font-display text-4xl font-bold text-foreground mb-2">Saved places</h1>
        <p class="text-muted-foreground">
          {{
            savedRestaurants.length > 0
              ? `${savedRestaurants.length} restaurant${savedRestaurants.length === 1 ? '' : 's'} saved for later`
              : 'Your saved restaurants will appear here'
          }}
        </p>
      </div>
    </section>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <StatusBlock v-if="error" :error="error" @retry="reload" />
      <StatusBlock v-else-if="loading" />

      <div v-else-if="savedRestaurants.length === 0" class="text-center py-20">
        <div class="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
          <Bookmark class="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 class="text-xl font-semibold text-foreground mb-3">No saved places yet</h2>
        <p class="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">
          Bookmark restaurants as you browse to build your personal collection of places to visit.
        </p>
        <RouterLink
          to="/discover"
          class="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
        >
          Explore restaurants <ArrowRight class="w-4 h-4" />
        </RouterLink>
      </div>

      <template v-else>
        <div class="flex items-center justify-between mb-6">
          <p class="text-sm text-muted-foreground">
            <span class="font-medium text-foreground">{{ savedRestaurants.length }}</span> saved
          </p>
          <button class="text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1.5" @click="clearSaved">
            <Trash2 class="w-3.5 h-3.5" />
            Clear all
          </button>
        </div>

        <div class="flex flex-col gap-4 mb-10">
          <div
            v-for="r in savedRestaurants"
            :key="r.slug"
            class="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow group"
          >
            <div class="flex flex-col sm:flex-row">
              <div class="relative w-full sm:w-44 h-40 sm:h-auto shrink-0 overflow-hidden">
                <RestaurantPhoto :src="r.image" :alt="r.name" :name="r.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div class="flex-1 p-5 flex flex-col justify-between">
                <div>
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">{{ r.cuisine }}</p>
                      <h3 class="font-display font-semibold text-foreground text-lg">{{ r.name }}</h3>
                    </div>
                    <button
                      class="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors shrink-0"
                      aria-label="Remove from saved"
                      @click="toggleSave(r.slug)"
                    >
                      <Bookmark class="w-3.5 h-3.5 fill-primary text-primary" />
                    </button>
                  </div>
                  <p class="text-sm text-muted-foreground mt-1">{{ r.description }}</p>
                </div>
                <div class="flex items-center justify-between mt-4 flex-wrap gap-3">
                  <div class="flex items-center gap-4">
                    <div class="flex items-center gap-1.5">
                      <Star class="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span class="text-sm font-medium text-foreground">{{ r.rating.toFixed(1) }}</span>
                      <span class="text-xs text-muted-foreground">({{ r.reviewCount }})</span>
                    </div>
                    <span class="text-xs text-muted-foreground font-medium">{{ r.price }}</span>
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="hidden sm:flex items-center gap-1">
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
        </div>

        <div class="bg-card border border-border rounded-xl p-8 text-center">
          <h3 class="font-display font-semibold text-foreground text-lg mb-2">Discover more restaurants</h3>
          <p class="text-sm text-muted-foreground mb-5">There are always more great places waiting to be found.</p>
          <RouterLink
            to="/discover"
            class="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            Browse all restaurants <ArrowRight class="w-4 h-4" />
          </RouterLink>
        </div>
      </template>
    </div>
  </div>
</template>
