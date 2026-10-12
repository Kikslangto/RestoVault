<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Search, ChevronDown, SlidersHorizontal, X } from 'lucide-vue-next';
import { useRestaurants } from '../composables/useRestaurants';
import { CUISINE_FILTERS } from '../constants';
import RestaurantCard from '../components/RestaurantCard.vue';
import StatusBlock from '../components/StatusBlock.vue';

const SORT_KEYS = {
  Recommended: 'recommended',
  'Rating: High to Low': 'rating_desc',
  'Rating: Low to High': 'rating_asc',
  'Most reviewed': 'reviews',
};
const SORT_OPTIONS = Object.keys(SORT_KEYS);
const PRICE_LABELS = { P: 'Budget', PP: 'Mid-range', PPP: 'Fine dining' };

const route = useRoute();
const router = useRouter();

const searchQuery = ref('');
const debouncedQuery = ref('');
const activeFilter = ref('All');
const sort = ref('Recommended');
const priceFilter = ref([]);
const showFilters = ref(false);

// Keep the form in sync with the URL (?q=...&cuisine=...), e.g. when arriving from the home page.
watch(
  () => route.query,
  (query) => {
    const q = typeof query.q === 'string' ? query.q : '';
    const c = typeof query.cuisine === 'string' ? query.cuisine : 'All';
    searchQuery.value = q;
    debouncedQuery.value = q;
    activeFilter.value = CUISINE_FILTERS.includes(c) ? c : 'All';
  },
  { immediate: true }
);

// Results update while typing, but wait a moment so we don't call the API on every keystroke.
let timer;
watch(searchQuery, (value) => {
  clearTimeout(timer);
  timer = setTimeout(() => (debouncedQuery.value = value), 250);
});
onBeforeUnmount(() => clearTimeout(timer));

const { restaurants, loading, error, reload } = useRestaurants(() => ({
  q: debouncedQuery.value.trim(),
  cuisine: activeFilter.value,
  price: priceFilter.value.join(','),
  sort: SORT_KEYS[sort.value],
}));

const hasActiveFilters = computed(
  () => searchQuery.value || activeFilter.value !== 'All' || priceFilter.value.length > 0
);

function togglePrice(p) {
  priceFilter.value = priceFilter.value.includes(p)
    ? priceFilter.value.filter((x) => x !== p)
    : [...priceFilter.value, p];
}

function handleSearch() {
  debouncedQuery.value = searchQuery.value;
  const query = {};
  if (searchQuery.value) query.q = searchQuery.value;
  if (activeFilter.value !== 'All') query.cuisine = activeFilter.value;
  router.push({ path: '/discover', query });
}

function clearAll() {
  searchQuery.value = '';
  debouncedQuery.value = '';
  activeFilter.value = 'All';
  priceFilter.value = [];
  router.push({ path: '/discover', query: {} });
}
</script>

<template>
  <div>
    <section class="bg-card border-b border-border">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">Pampanga</p>
        <h1 class="font-display text-4xl font-bold text-foreground mb-2">Discover restaurants</h1>
        <p class="text-muted-foreground">
          {{ restaurants.length }} {{ restaurants.length === 1 ? 'restaurant' : 'restaurants' }} waiting to be found
        </p>
      </div>
    </section>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <!-- Search + filter bar -->
      <div class="flex flex-col sm:flex-row gap-3 mb-6">
        <div class="flex-1 flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2.5 shadow-sm">
          <Search class="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search restaurants, cuisines, or neighborhoods..."
            class="flex-1 min-w-0 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
            @keydown.enter="handleSearch"
          />
          <button v-if="searchQuery" aria-label="Clear search" @click="searchQuery = ''">
            <X class="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
          </button>
        </div>
        <div class="flex gap-2">
          <button
            class="bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
            @click="handleSearch"
          >
            Search
          </button>
          <button
            class="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg border transition-colors"
            :class="showFilters ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-card hover:bg-secondary'"
            @click="showFilters = !showFilters"
          >
            <SlidersHorizontal class="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      <!-- Extended filters -->
      <div v-if="showFilters" class="bg-card border border-border rounded-xl p-5 mb-6 shadow-sm">
        <div class="grid sm:grid-cols-2 gap-6">
          <div>
            <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Price range</p>
            <div class="flex gap-2">
              <button
                v-for="(label, p) in PRICE_LABELS"
                :key="p"
                class="text-sm font-medium px-4 py-2 rounded-lg border transition-colors"
                :class="priceFilter.includes(p) ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-secondary'"
                @click="togglePrice(p)"
              >
                {{ label }}
              </button>
            </div>
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Sort by</p>
            <select
              v-model="sort"
              class="text-sm bg-background border border-border rounded-lg px-3 py-2 text-foreground outline-none cursor-pointer w-full"
            >
              <option v-for="o in SORT_OPTIONS" :key="o">{{ o }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Cuisine chips -->
      <div class="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        <button
          v-for="f in CUISINE_FILTERS"
          :key="f"
          class="shrink-0 text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
          :class="activeFilter === f ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:bg-secondary hover:text-foreground'"
          @click="activeFilter = f"
        >
          {{ f }}
        </button>
        <button
          v-if="hasActiveFilters"
          class="shrink-0 text-xs font-medium px-3 py-1.5 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors flex items-center gap-1"
          @click="clearAll"
        >
          <X class="w-3 h-3" /> Clear all
        </button>
      </div>

      <!-- Count + sort -->
      <div class="flex items-center justify-between mb-5">
        <p class="text-sm text-muted-foreground">
          Showing <span class="font-medium text-foreground">{{ restaurants.length }}</span> restaurants
        </p>
        <div class="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span>Sort:</span>
          <button class="font-medium text-foreground flex items-center gap-1 hover:underline" @click="showFilters = true">
            {{ sort }} <ChevronDown class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- Results -->
      <StatusBlock v-if="error" :error="error" @retry="reload" />
      <StatusBlock v-else-if="loading && !restaurants.length" />
      <div v-else-if="restaurants.length" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 transition-opacity" :class="loading ? 'opacity-60' : ''">
        <RestaurantCard v-for="r in restaurants" :key="r.slug" :r="r" />
      </div>
      <div v-else class="text-center py-20">
        <p class="text-5xl mb-4">🍽️</p>
        <p class="text-lg font-semibold text-foreground mb-2">No restaurants found</p>
        <p class="text-muted-foreground text-sm mb-6">Try adjusting your search or clearing some filters.</p>
        <button
          class="text-sm font-medium text-primary border border-primary/30 px-5 py-2 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
          @click="clearAll"
        >
          Clear all filters
        </button>
      </div>
    </div>
  </div>
</template>
