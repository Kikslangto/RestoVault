<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { Bookmark, MapPin, ChevronDown, Menu, X } from 'lucide-vue-next';
import { useSaved } from '../composables/useSaved';

const NAV_LINKS = [
  { label: 'Discover', to: '/discover' },
  { label: 'Top rated', to: '/top-rated' },
  { label: 'Our story', to: '/our-story' },
];

const route = useRoute();
const { count } = useSaved();
const mobileOpen = ref(false);
const isActive = (to) => route.path === to;
</script>

<template>
  <nav class="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
      <div class="flex items-center gap-8">
        <RouterLink to="/" class="flex items-center gap-2 shrink-0">
          <div class="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <span class="text-primary-foreground text-xs font-bold">R</span>
          </div>
          <span class="font-semibold text-foreground text-sm tracking-tight">RestoVault</span>
        </RouterLink>
        <div class="hidden md:flex items-center gap-6">
          <RouterLink
            v-for="link in NAV_LINKS"
            :key="link.to"
            :to="link.to"
            class="text-sm transition-colors"
            :class="isActive(link.to) ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'"
          >
            {{ link.label }}
          </RouterLink>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <RouterLink
          to="/saved"
          class="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Bookmark class="w-4 h-4" :class="isActive('/saved') ? 'fill-primary text-primary' : ''" />
          <span>Saved places</span>
          <span
            v-if="count > 0"
            class="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium"
          >
            {{ count }}
          </span>
        </RouterLink>
        <div class="flex items-center gap-1.5 bg-accent text-accent-foreground text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer">
          <MapPin class="w-3 h-3" />
          <span>Pampanga</span>
          <ChevronDown class="w-3 h-3" />
        </div>
        <button
          class="md:hidden p-1.5 rounded-md hover:bg-secondary transition-colors"
          :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
          @click="mobileOpen = !mobileOpen"
        >
          <X v-if="mobileOpen" class="w-5 h-5" />
          <Menu v-else class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div v-if="mobileOpen" class="md:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-2">
      <RouterLink
        v-for="link in NAV_LINKS"
        :key="link.to"
        :to="link.to"
        class="text-sm py-2 px-3 rounded-lg transition-colors"
        :class="isActive(link.to) ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'"
        @click="mobileOpen = false"
      >
        {{ link.label }}
      </RouterLink>
      <RouterLink
        to="/saved"
        class="text-sm py-2 px-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors flex items-center gap-2"
        @click="mobileOpen = false"
      >
        <Bookmark class="w-4 h-4" />
        Saved places
        <span
          v-if="count > 0"
          class="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium"
        >
          {{ count }}
        </span>
      </RouterLink>
    </div>
  </nav>
</template>
