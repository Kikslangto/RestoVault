<script setup>
import { Star, Trophy } from 'lucide-vue-next';
import { useRestaurants } from '../composables/useRestaurants';
import TopRestaurantRow from '../components/TopRestaurantRow.vue';
import StatusBlock from '../components/StatusBlock.vue';

import RestaurantPhoto from '../components/RestaurantPhoto.vue';
const MEDALS = ['🥇', '🥈', '🥉'];
const { restaurants, loading, error, reload } = useRestaurants(() => ({ sort: 'rating_desc' }));
</script>

<template>
  <div>
    <section class="bg-card border-b border-border">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <Trophy class="w-5 h-5 text-amber-500" />
          </div>
          <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">Exquisite picks</p>
        </div>
        <h1 class="font-display text-4xl font-bold text-foreground mb-2">Top-rated restaurants</h1>
        <p class="text-muted-foreground max-w-xl">
          The tables everyone is talking about. Ranked by Tripadvisor traveler ratings, with the number of reviews behind each score.
        </p>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-8">
      <StatusBlock v-if="error" :error="error" @retry="reload" />
      <StatusBlock v-else-if="loading" />
      <template v-else>
        <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">Top 3 by rating</p>
        <div class="grid sm:grid-cols-3 gap-5 mb-12">
          <RouterLink v-for="(r, i) in restaurants.slice(0, 3)" :key="r.slug" :to="`/restaurant/${r.slug}`" class="group block">
            <div class="relative rounded-xl overflow-hidden h-60 mb-4">
              <RestaurantPhoto :src="r.image" :alt="r.name" :name="r.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div class="absolute top-3 left-3 text-2xl">{{ MEDALS[i] }}</div>
              <span v-if="r.badge" class="absolute top-3 right-3 bg-accent text-accent-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
                {{ r.badge }}
              </span>
              <div class="absolute bottom-4 left-4 text-white">
                <p class="text-xs opacity-75 uppercase tracking-wide">{{ r.cuisine }}</p>
                <h3 class="font-display text-lg font-semibold">{{ r.name }}</h3>
                <div class="flex items-center gap-1 mt-1">
                  <Star class="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span class="text-sm font-medium">{{ r.rating.toFixed(1) }}</span>
                  <span class="text-xs opacity-60">({{ r.reviewCount }})</span>
                </div>
              </div>
            </div>
          </RouterLink>
        </div>

        <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">All ranked</p>
        <div class="flex flex-col gap-4">
          <TopRestaurantRow v-for="(r, i) in restaurants" :key="r.slug" :r="r" :rank="i + 1" />
        </div>
      </template>
    </section>
  </div>
</template>
