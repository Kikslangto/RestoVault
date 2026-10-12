<script setup>
import { ref } from 'vue';
import { Instagram, Twitter, Mail, ArrowRight } from 'lucide-vue-next';

const email = ref('');
const subscribed = ref(false);

const EXPLORE = [
  { label: 'Home', to: '/' },
  { label: 'Restaurants', to: '/discover' },
  { label: 'Top rated', to: '/top-rated' },
  { label: 'Saved places', to: '/saved' },
];
const COMPANY = [
  { label: 'Our story', to: '/our-story' },
  { label: 'Contact us', to: '/our-story#contact' },
  { label: 'List your restaurant', to: '/our-story#list' },
  { label: 'Help center', to: '/our-story#help' },
];

function subscribe() {
  if (email.value.includes('@')) {
    subscribed.value = true;
    email.value = '';
  }
}
</script>

<template>
  <footer class="bg-primary text-primary-foreground">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-14">
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <RouterLink to="/" class="flex items-center gap-2 mb-4">
            <div class="w-7 h-7 rounded-md bg-white/20 flex items-center justify-center">
              <span class="text-white text-xs font-bold">R</span>
            </div>
            <span class="font-semibold text-sm tracking-tight">RestoVault</span>
          </RouterLink>
          <p class="text-sm text-primary-foreground/70 leading-relaxed mb-5">
            Good food brings us together. We help you find the places, people, and flavors that make Pampanga worth exploring.
          </p>
          <div class="flex items-center gap-3">
            <button class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Instagram">
              <Instagram class="w-3.5 h-3.5" />
            </button>
            <button class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Twitter">
              <Twitter class="w-3.5 h-3.5" />
            </button>
            <button class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Email">
              <Mail class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div>
          <p class="text-xs font-semibold uppercase tracking-widest text-primary-foreground/50 mb-4">Explore</p>
          <ul class="space-y-2.5">
            <li v-for="l in EXPLORE" :key="l.to">
              <RouterLink :to="l.to" class="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{{ l.label }}</RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <p class="text-xs font-semibold uppercase tracking-widest text-primary-foreground/50 mb-4">RestoVault</p>
          <ul class="space-y-2.5">
            <li v-for="l in COMPANY" :key="l.label">
              <RouterLink :to="l.to" class="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{{ l.label }}</RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <p class="font-display text-sm font-semibold text-primary-foreground mb-1">A little food inspiration.</p>
          <p class="text-xs text-primary-foreground/60 leading-relaxed mb-4">
            Fresh finds and local favorites, delivered monthly. No noise, just good taste.
          </p>
          <p v-if="subscribed" class="text-sm text-accent font-medium">You are on the list. Good things coming.</p>
          <template v-else>
            <div class="flex items-center gap-2">
              <input
                v-model="email"
                type="email"
                placeholder="Your email address"
                class="flex-1 min-w-0 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-primary-foreground placeholder:text-primary-foreground/40 outline-none focus:border-white/40 transition-colors"
                @keydown.enter="subscribe"
              />
              <button
                class="w-9 h-9 rounded-lg bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center shrink-0"
                aria-label="Subscribe"
                @click="subscribe"
              >
                <ArrowRight class="w-4 h-4" />
              </button>
            </div>
            <p class="text-xs text-primary-foreground/40 mt-2">By subscribing, you agree to our Privacy Policy.</p>
          </template>
        </div>
      </div>

      <div class="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-xs text-primary-foreground/40">© 2026 RestoVault. All rights reserved.</p>
        <div class="flex items-center gap-5">
          <button v-for="l in ['Privacy Policy', 'Terms of Use']" :key="l" class="text-xs text-primary-foreground/40 hover:text-primary-foreground/70 transition-colors">
            {{ l }}
          </button>
        </div>
        <p class="text-xs text-primary-foreground/40">Made for the love of food</p>
      </div>
    </div>
  </footer>
</template>
