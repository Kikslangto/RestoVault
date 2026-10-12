<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Search, ArrowRight, ToggleLeft, ToggleRight, ChevronDown } from 'lucide-vue-next';
import { useRestaurants } from '../composables/useRestaurants';
import { HERO_IMAGE, CUISINE_FILTERS } from '../constants';
import RestaurantCard from '../components/RestaurantCard.vue';
import TopRatedCard from '../components/TopRatedCard.vue';
import StatusBlock from '../components/StatusBlock.vue';
import AdminAddRestaurant from '../components/AdminAddRestaurant.vue';
import AdminManageRestaurants from '../components/AdminManageRestaurants.vue';

const router = useRouter();
const searchQuery = ref('');
const cuisine = ref('All cuisines');
const groupByCuisine = ref(false);
const activeFilter = ref('All');

const { restaurants, loading, error, reload } = useRestaurants(() => ({ cuisine: activeFilter.value }));
const { restaurants: featured } = useRestaurants(() => ({ featured: 'true' }));

function handleSearch() {
  const query = {};
  if (searchQuery.value) query.q = searchQuery.value;
  if (cuisine.value !== 'All cuisines') query.cuisine = cuisine.value;
  router.push({ path: '/discover', query });
}
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-10">
      <div class="grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <div class="flex items-center gap-2 mb-5">
            <div class="h-px w-8 bg-primary/40" />
            <span class="text-xs font-medium uppercase tracking-widest text-muted-foreground">Your next great meal</span>
          </div>
          <h1 class="font-display text-5xl sm:text-6xl font-bold leading-tight mb-5 text-foreground">
            Good food.<br />Great finds.<br />Right here.
          </h1>
          <p class="text-muted-foreground text-base leading-relaxed mb-7 max-w-sm">
            Discover Pampanga's heritage kitchens and unforgettable tables. Your next favorite restaurant is waiting.
          </p>
          <div class="flex items-center gap-3 flex-wrap">
            <RouterLink
              to="/discover"
              class="bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              Explore restaurants <ArrowRight class="w-4 h-4" />
            </RouterLink>
            <RouterLink
              to="/our-story"
              class="text-sm font-medium text-foreground px-5 py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors"
            >
              Our story
            </RouterLink>
          </div>
        </div>
        <div class="relative rounded-2xl overflow-hidden h-72 lg:h-96 shadow-xl">
          <img :src="HERO_IMAGE" alt="Elegant restaurant interior" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div class="absolute bottom-4 left-4 text-white">
            <p class="text-xs font-medium uppercase tracking-wider opacity-75 mb-1">Featured guide</p>
            <h3 class="font-display text-lg font-semibold">Pampanga Dining Guide</h3>
            <p class="text-xs opacity-75 mt-0.5">Curated picks, neighborhood favorites, and chef-led spots across the province.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Search bar -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 pb-8">
      <div class="bg-card rounded-xl border border-border shadow-sm p-4">
        <div class="mb-3 flex items-center justify-between gap-3"><p class="text-xs text-muted-foreground font-medium">Find your next table</p><div class="flex items-center gap-2"><AdminManageRestaurants /><AdminAddRestaurant /></div></div>
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="flex-1 flex items-center gap-2 bg-input-background border border-border rounded-lg px-3 py-2.5">
            <Search class="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Restaurant or neighborhood"
              class="flex-1 min-w-0 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              @keydown.enter="handleSearch"
            />
          </div>
          <div class="flex items-center gap-3 flex-wrap">
            <select
              v-model="cuisine"
              class="text-sm bg-input-background border border-border rounded-lg px-3 py-2.5 text-foreground outline-none cursor-pointer min-w-36"
            >
              <option>All cuisines</option>
              <option v-for="c in CUISINE_FILTERS.slice(1)" :key="c">{{ c }}</option>
            </select>
            <button
              class="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap hover:text-foreground transition-colors"
              @click="groupByCuisine = !groupByCuisine"
            >
              <ToggleRight v-if="groupByCuisine" class="w-8 h-5 text-primary" />
              <ToggleLeft v-else class="w-8 h-5" />
              Group by cuisine
            </button>
            <button
              class="bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity shrink-0"
              @click="handleSearch"
            >
              Search
            </button>
          </div>
        </div>
        <div class="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
          <button
            v-for="f in CUISINE_FILTERS"
            :key="f"
            class="shrink-0 text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
            :class="activeFilter === f ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'"
            @click="activeFilter = f"
          >
            {{ f }}
          </button>
        </div>
      </div>
    </section>

    <!-- Restaurant grid -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 pb-14">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="font-display text-2xl font-bold text-foreground">All restaurants</h2>
          <p class="text-sm text-muted-foreground mt-0.5">
            {{ restaurants.length }} delicious {{ restaurants.length === 1 ? 'discovery' : 'discoveries' }} across Pampanga
          </p>
        </div>
        <div class="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span>Sort by:</span>
          <button class="font-medium text-foreground flex items-center gap-1">
            Recommended <ChevronDown class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <StatusBlock v-if="error" :error="error" @retry="reload" />
      <StatusBlock v-else-if="loading && !restaurants.length" />
      <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 transition-opacity" :class="loading ? 'opacity-60' : ''">
        <RestaurantCard v-for="r in restaurants" :key="r.slug" :r="r" />
      </div>

      <div class="flex justify-center mt-8">
        <RouterLink
          to="/discover"
          class="text-sm font-medium text-primary border border-primary/30 px-6 py-2.5 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-2"
        >
          View all restaurants <ArrowRight class="w-4 h-4" />
        </RouterLink>
      </div>
    </section>

    <!-- Top-rated section -->
    <section v-if="featured.length" class="bg-card border-y border-border py-14">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="mb-8">
          <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">Exquisite picks</p>
          <h2 class="font-display text-3xl font-bold text-foreground">Top-rated restaurants</h2>
          <p class="text-muted-foreground text-sm mt-1">
            The tables everyone is talking about. Three standouts worth making plans for.
          </p>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <TopRatedCard v-for="r in featured" :key="r.slug" :r="r" />
        </div>
        <div class="flex justify-center mt-8">
          <RouterLink
            to="/top-rated"
            class="text-sm font-medium text-primary border border-primary/30 px-6 py-2.5 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-2"
          >
            See all top-rated <ArrowRight class="w-4 h-4" />
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>
