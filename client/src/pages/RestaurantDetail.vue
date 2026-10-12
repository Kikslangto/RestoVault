<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft, Star, MapPin, Phone, Globe, Clock, Bookmark, Share2, ChevronDown, ChevronUp } from 'lucide-vue-next';
import { getRestaurant } from '../api';
import { useSaved } from '../composables/useSaved';
import RestaurantCard from '../components/RestaurantCard.vue';
import StatusBlock from '../components/StatusBlock.vue';

import RestaurantPhoto from '../components/RestaurantPhoto.vue';
const route = useRoute();
const router = useRouter();
const { isSaved, toggleSave } = useSaved();

const restaurant = ref(null);
const similar = ref([]);
const loading = ref(true);
const error = ref('');
const notFound = ref(false);
const expandedMenu = ref(null);
const shareMsg = ref(false);
let latest = 0;

async function load() {
  const slug = route.params.slug;
  if (!slug) return; // the route is changing away from this page
  const id = ++latest;
  loading.value = true;
  error.value = '';
  notFound.value = false;
  expandedMenu.value = null;
  try {
    const data = await getRestaurant(slug);
    if (id !== latest) return;
    restaurant.value = data.restaurant;
    similar.value = data.similar;
  } catch (err) {
    if (id !== latest) return;
    restaurant.value = null;
    similar.value = [];
    if (err.status === 404) notFound.value = true;
    else error.value = "We couldn't load this restaurant. Check that the server and MongoDB are running.";
  } finally {
    if (id === latest) loading.value = false;
  }
}

// Re-run when moving between restaurants (e.g. from "You might also like").
watch(() => route.params.slug, load, { immediate: true });

function goBack() {
  if (window.history.state?.back) router.back();
  else router.push('/discover');
}

function handleShare() {
  navigator.clipboard?.writeText(window.location.href).catch(() => {});
  shareMsg.value = true;
  setTimeout(() => (shareMsg.value = false), 2000);
}

const toggleMenu = (category) => {
  expandedMenu.value = expandedMenu.value === category ? null : category;
};
</script>

<template>
  <div>
    <StatusBlock v-if="error" :error="error" @retry="load" />
    <StatusBlock v-else-if="loading" />

    <div v-else-if="notFound" class="max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center">
      <p class="text-5xl mb-4">🍽️</p>
      <h1 class="text-2xl font-bold text-foreground mb-3">Restaurant not found</h1>
      <p class="text-muted-foreground mb-6">This restaurant might have moved or doesn't exist.</p>
      <RouterLink
        to="/discover"
        class="inline-block bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90"
      >
        Browse all restaurants
      </RouterLink>
    </div>

    <template v-else-if="restaurant">
      <!-- Hero image -->
      <div class="relative h-64 sm:h-80 lg:h-96">
        <RestaurantPhoto :src="restaurant.heroImage" :alt="restaurant.name" :name="restaurant.name" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div class="absolute bottom-0 left-0 right-0 max-w-6xl mx-auto px-4 sm:px-6 pb-6">
          <button class="flex items-center gap-2 text-white/80 text-sm mb-4 hover:text-white transition-colors" @click="goBack">
            <ArrowLeft class="w-4 h-4" /> Back
          </button>
          <div class="flex items-end justify-between gap-4">
            <div>
              <span v-if="restaurant.badge" class="inline-block bg-accent text-accent-foreground text-xs font-semibold px-2.5 py-1 rounded-full mb-2">
                {{ restaurant.badge }}
              </span>
              <p class="text-white/70 text-sm uppercase tracking-wider font-medium mb-1">{{ restaurant.cuisine }}</p>
              <h1 class="font-display text-3xl sm:text-4xl font-bold text-white">{{ restaurant.name }}</h1>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <button
                class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors text-white"
                title="Copy link"
                aria-label="Copy link"
                @click="handleShare"
              >
                <Share2 class="w-4 h-4" />
              </button>
              <button
                class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors text-white"
                :aria-label="isSaved(restaurant.slug) ? 'Remove from saved' : 'Save restaurant'"
                @click="toggleSave(restaurant.slug)"
              >
                <Bookmark class="w-4 h-4" :class="isSaved(restaurant.slug) ? 'fill-white' : ''" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="shareMsg"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background text-sm font-medium px-4 py-2 rounded-full shadow-lg"
      >
        Link copied to clipboard
      </div>

      <!-- Content -->
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div class="grid lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-8">
            <!-- About -->
            <section>
              <div class="flex items-center gap-4 mb-5">
                <div class="flex items-center gap-1.5">
                  <Star class="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span class="text-xl font-bold text-foreground">{{ restaurant.rating.toFixed(1) }}</span>
                </div>
                <span class="text-muted-foreground text-sm">{{ restaurant.reviewCount }} reviews{{ restaurant.ratingSource ? ` on ${restaurant.ratingSource}` : '' }}</span>
                <span class="text-muted-foreground text-sm font-medium">{{ restaurant.price }}</span>
              </div>
              <p class="text-foreground leading-relaxed">{{ restaurant.longDescription }}</p>
              <div class="flex flex-wrap gap-2 mt-4">
                <span v-for="tag in restaurant.tags" :key="tag" class="text-xs font-medium bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full">
                  {{ tag }}
                </span>
              </div>
            </section>

            <!-- Known for -->
            <section v-if="restaurant.menu?.length">
              <h2 class="font-display text-xl font-bold text-foreground mb-4">Known for</h2>
              <div class="space-y-3">
                <div v-for="section in restaurant.menu" :key="section.category" class="bg-card border border-border rounded-xl overflow-hidden">
                  <button
                    class="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-secondary/50 transition-colors"
                    :aria-expanded="expandedMenu === section.category"
                    @click="toggleMenu(section.category)"
                  >
                    <span class="font-semibold text-foreground">{{ section.category }}</span>
                    <ChevronUp v-if="expandedMenu === section.category" class="w-4 h-4 text-muted-foreground" />
                    <ChevronDown v-else class="w-4 h-4 text-muted-foreground" />
                  </button>
                  <div v-if="expandedMenu === section.category" class="border-t border-border divide-y divide-border">
                    <div v-for="item in section.items" :key="item.name" class="px-5 py-4 flex items-start justify-between gap-4">
                      <div>
                        <p class="font-medium text-foreground text-sm">{{ item.name }}</p>
                        <p class="text-xs text-muted-foreground mt-0.5">{{ item.description }}</p>
                      </div>
                      <span v-if="item.price" class="text-sm font-semibold text-foreground shrink-0">{{ item.price }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Reviews -->
            <section v-if="restaurant.reviews?.length">
              <div class="flex items-center justify-between mb-4">
                <h2 class="font-display text-xl font-bold text-foreground">What people are saying</h2>
                <div class="flex items-center gap-1.5">
                  <Star class="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span class="font-semibold text-foreground">{{ restaurant.rating.toFixed(1) }}</span>
                  <span class="text-muted-foreground text-sm">/ 5</span>
                </div>
              </div>
              <div class="space-y-4">
                <div v-for="review in restaurant.reviews" :key="review.author" class="bg-card border border-border rounded-xl p-5">
                  <div class="flex items-start justify-between gap-4 mb-3">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-accent-foreground shrink-0">
                        {{ review.avatar }}
                      </div>
                      <div>
                        <p class="font-medium text-foreground text-sm">{{ review.author }}</p>
                        <p class="text-xs text-muted-foreground">{{ review.date }}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-0.5" :aria-label="`${review.rating} out of 5 stars`">
                      <Star
                        v-for="i in 5"
                        :key="i"
                        class="w-4 h-4"
                        :class="i <= Math.round(review.rating) ? 'fill-amber-400 text-amber-400' : 'text-muted'"
                      />
                    </div>
                  </div>
                  <p class="text-sm text-muted-foreground leading-relaxed">{{ review.text }}</p>
                </div>
              </div>
            </section>

            <!-- Rating source (when there are no written reviews) -->
            <section v-if="!restaurant.reviews?.length && restaurant.sourceUrl">
              <h2 class="font-display text-xl font-bold text-foreground mb-4">What people are saying</h2>
              <div class="bg-card border border-border rounded-xl p-5">
                <p class="text-sm text-muted-foreground leading-relaxed mb-3">
                  The {{ restaurant.rating.toFixed(1) }} / 5 rating comes from {{ restaurant.reviewCount }} traveler reviews on
                  {{ restaurant.ratingSource || 'the source site' }}. Read what diners wrote before you go.
                </p>
                <a
                  :href="restaurant.sourceUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm font-medium text-primary hover:underline"
                >
                  Read reviews on {{ restaurant.ratingSource || 'the source site' }}
                </a>
              </div>
            </section>
          </div>

          <!-- Sidebar -->
          <div class="space-y-5">
            <div class="bg-card border border-border rounded-xl p-5 space-y-4 sticky top-20">
              <h3 class="font-semibold text-foreground">Restaurant info</h3>
              <div class="space-y-3">
                <div class="flex items-start gap-3">
                  <MapPin class="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p class="text-sm text-foreground">{{ restaurant.address }}</p>
                    <a
                      :href="`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(restaurant.name + ', ' + restaurant.address)}`"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-xs text-primary hover:underline mt-0.5 block"
                    >
                      Get directions
                    </a>
                  </div>
                </div>
                <div v-if="restaurant.phone" class="flex items-center gap-3">
                  <Phone class="w-4 h-4 text-muted-foreground shrink-0" />
                  <a :href="`tel:${restaurant.phone}`" class="text-sm text-foreground hover:text-primary transition-colors">{{ restaurant.phone }}</a>
                </div>
                <div v-if="restaurant.website" class="flex items-center gap-3">
                  <Globe class="w-4 h-4 text-muted-foreground shrink-0" />
                  <span class="text-sm text-primary">{{ restaurant.website }}</span>
                </div>
                <div v-if="restaurant.hours?.length" class="flex items-start gap-3">
                  <Clock class="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div class="space-y-1">
                    <div v-for="h in restaurant.hours" :key="h.day">
                      <p class="text-xs font-medium text-foreground">{{ h.day }}</p>
                      <p class="text-xs text-muted-foreground">{{ h.time }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pt-2 space-y-2">
                <button class="w-full bg-primary text-primary-foreground text-sm font-medium py-2.5 rounded-lg hover:opacity-90 transition-opacity">
                  Make a reservation
                </button>
                <button
                  class="w-full text-sm font-medium py-2.5 rounded-lg border transition-colors flex items-center justify-center gap-2"
                  :class="isSaved(restaurant.slug) ? 'bg-accent text-accent-foreground border-accent' : 'border-border hover:bg-secondary'"
                  @click="toggleSave(restaurant.slug)"
                >
                  <Bookmark class="w-4 h-4" :class="isSaved(restaurant.slug) ? 'fill-current' : ''" />
                  {{ isSaved(restaurant.slug) ? 'Saved' : 'Save restaurant' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Similar restaurants -->
        <section v-if="similar.length" class="mt-14">
          <h2 class="font-display text-2xl font-bold text-foreground mb-6">You might also like</h2>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <RestaurantCard v-for="r in similar" :key="r.slug" :r="r" />
          </div>
        </section>
      </div>
    </template>
  </div>
</template>
