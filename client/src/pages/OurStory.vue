<script setup>
import { reactive, ref } from 'vue';
import { ArrowRight, MapPin, Heart, Star, Utensils } from 'lucide-vue-next';
import { HERO_IMAGE_WIDE } from '../constants';

const TEAM = [
  {
    name: 'Urquico Rafael',
    role: 'Project Manager & UI/UX Designer',
    bio: 'Leads the development team, manages project planning, and designs intuitive user interfaces to ensure a smooth and engaging experience across the website.',
    initials: 'RU',
    color: 'bg-green-100 text-green-800',
  },
  {
    name: 'Ocampo Fran',
    role: 'Front-End Developer',
    bio: 'Develops responsive layouts and interactive website components using HTML, CSS, and JavaScript to deliver a seamless experience across devices.',
    initials: 'OF',
    color: 'bg-amber-100 text-amber-800',
  },
  {
    name: 'Morales Enzo',
    role: 'Back-End Developer',
    bio: 'Handles server-side functionality, database management, and API integration to ensure the website operates securely, efficiently, and reliably.',
    initials: 'ME',
    color: 'bg-blue-100 text-blue-800',
  },
  {
    name: 'Patio Kylle',
    role: 'Full-Stack Developer',
    bio: 'Works on both front-end and back-end development, integrating user interfaces with server-side functionality and maintaining overall website performance.',
    initials: 'PK',
    color: 'bg-rose-100 text-rose-800',
  },
  {
    name: 'Pereda Jan',
    role: 'Quality Assurance (QA) & Database Administratorr',
    bio: 'Tests website features, identifies and resolves issues, and maintains data organization and integrity to ensure reliable system performance.',
    initials: 'RD',
    color: 'bg-purple-100 text-purple-800',
  },
];

const STATS = [
  { icon: Utensils, value: '5', label: 'Restaurants listed' },
  { icon: MapPin, value: '4', label: 'Towns and cities covered' },
  { icon: Star, value: '778', label: 'Tripadvisor reviews behind our ratings' },
  { icon: Heart, value: '1', label: 'Province: Pampanga' },
];

const VALUES = [
  {
    icon: '🎯',
    title: 'Honest ratings',
    desc: 'Scores come straight from Tripadvisor traveler reviews, and every score shows how many reviews are behind it. No pay-to-play, no sponsored placements.',
  },
  {
    icon: '🏘️',
    title: 'Neighborhood first',
    desc: 'We believe the best dining experiences are often found in the least expected places. We champion the local and the independent.',
  },
  {
    icon: '❤️',
    title: 'Community-powered',
    desc: 'The ratings reflect hundreds of reviews from travelers and locals who care about good food as much as we do.',
  },
];

const PERKS = [
  'No listing fee — ever',
  'Editorial team visits before publishing',
  "Complete control over your restaurant's profile",
  'Direct connection to thousands of food lovers',
];

const inputClass =
  'w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors';

const form = reactive({ name: '', email: '', restaurant: '', message: '' });
const submitted = ref(false);

function handleSubmit() {
  if (form.name && form.email) submitted.value = true;
}
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0">
        <img :src="HERO_IMAGE_WIDE" alt="Restaurant interior" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-primary/80" />
      </div>
      <div class="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 text-primary-foreground">
        <div class="max-w-2xl">
          <p class="text-xs font-medium uppercase tracking-widest text-primary-foreground/60 mb-4">Our story</p>
          <h1 class="font-display text-5xl font-bold mb-6 leading-tight">We believe great food deserves to be found.</h1>
          <p class="text-primary-foreground/80 text-lg leading-relaxed">
            RestoVault started as a personal spreadsheet — a list of places too good to forget and too good not to share. Today it's a guide to the best tables in Pampanga, the Culinary Capital of the Philippines.
          </p>
        </div>
      </div>
    </section>

    <!-- Mission -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">Our mission</p>
          <h2 class="font-display text-3xl font-bold text-foreground mb-5">Finding the places that make a city worth living in</h2>
          <p class="text-muted-foreground leading-relaxed mb-4">
            Pampanga is known as the Culinary Capital of the Philippines, with everything from roadside sisig stalls to chef-led dining rooms. Much of it goes unnoticed outside the province.
          </p>
          <p class="text-muted-foreground leading-relaxed mb-4">
            We built RestoVault because we believe every great restaurant deserves to be discovered — not just the ones with big marketing budgets, but the neighborhood spots, the family-run kitchens, the chefs doing quietly extraordinary work.
          </p>
          <p class="text-muted-foreground leading-relaxed">
            Ratings on RestoVault come from Tripadvisor traveler reviews, and we show how many reviews sit behind each score. We do not accept payment for placement.
          </p>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="s in STATS" :key="s.label" class="bg-card border border-border rounded-xl p-6 text-center">
            <div class="w-10 h-10 rounded-full bg-accent flex items-center justify-center mx-auto mb-3">
              <component :is="s.icon" class="w-5 h-5 text-accent-foreground" />
            </div>
            <p class="font-display text-3xl font-bold text-foreground mb-1">{{ s.value }}</p>
            <p class="text-xs text-muted-foreground">{{ s.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="bg-card border-y border-border py-16">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center max-w-xl mx-auto mb-12">
          <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">What we stand for</p>
          <h2 class="font-display text-3xl font-bold text-foreground">Our values</h2>
        </div>
        <div class="grid sm:grid-cols-3 gap-6">
          <div v-for="v in VALUES" :key="v.title" class="text-center px-4">
            <div class="text-4xl mb-4">{{ v.icon }}</div>
            <h3 class="font-semibold text-foreground text-lg mb-3">{{ v.title }}</h3>
            <p class="text-muted-foreground text-sm leading-relaxed">{{ v.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div class="mb-10">
        <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">The people behind it</p>
        <h2 class="font-display text-3xl font-bold text-foreground">Meet the team</h2>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="m in TEAM" :key="m.name" class="bg-card border border-border rounded-xl p-6">
          <div class="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold mb-4" :class="m.color">
            {{ m.initials }}
          </div>
          <h3 class="font-semibold text-foreground mb-0.5">{{ m.name }}</h3>
          <p class="text-xs text-primary font-medium mb-3">{{ m.role }}</p>
          <p class="text-sm text-muted-foreground leading-relaxed">{{ m.bio }}</p>
        </div>
      </div>
    </section>

    <!-- List your restaurant + Contact -->
    <section id="list" class="bg-card border-y border-border py-16">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="grid lg:grid-cols-2 gap-12">
          <div>
            <div class="flex items-center gap-2 mb-3">
              <Heart class="w-5 h-5 text-primary" />
              <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">For restaurateurs</p>
            </div>
            <h2 class="font-display text-2xl font-bold text-foreground mb-4">List your restaurant</h2>
            <p class="text-muted-foreground leading-relaxed mb-6">
              Are you running a restaurant that deserves to be discovered? We would love to hear from you. Our editorial team reviews all submissions and personally visits restaurants before listing them.
            </p>
            <ul class="space-y-3 mb-6">
              <li v-for="item in PERKS" :key="item" class="flex items-start gap-2 text-sm text-muted-foreground">
                <span class="text-primary mt-0.5">✓</span>
                {{ item }}
              </li>
            </ul>
            <RouterLink
              :to="{ hash: '#contact' }"
              class="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
            >
              Submit your restaurant <ArrowRight class="w-4 h-4" />
            </RouterLink>
          </div>

          <div id="contact">
            <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">Get in touch</p>
            <h2 class="font-display text-2xl font-bold text-foreground mb-6">Say hello</h2>
            <div v-if="submitted" class="bg-accent rounded-xl p-8 text-center">
              <p class="text-4xl mb-3">✉️</p>
              <p class="font-semibold text-foreground mb-2">Message received</p>
              <p class="text-sm text-muted-foreground">We will get back to you within 2 business days. Thank you!</p>
            </div>
            <form v-else class="space-y-4" @submit.prevent="handleSubmit">
              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label for="name" class="block text-xs font-medium text-muted-foreground mb-1.5">Your name</label>
                  <input id="name" v-model="form.name" type="text" placeholder="Maria Santos" required :class="inputClass" />
                </div>
                <div>
                  <label for="email" class="block text-xs font-medium text-muted-foreground mb-1.5">Email address</label>
                  <input id="email" v-model="form.email" type="email" placeholder="hello@example.com" required :class="inputClass" />
                </div>
              </div>
              <div>
                <label for="restaurant" class="block text-xs font-medium text-muted-foreground mb-1.5">Restaurant name (optional)</label>
                <input id="restaurant" v-model="form.restaurant" type="text" placeholder="Your restaurant" :class="inputClass" />
              </div>
              <div>
                <label for="message" class="block text-xs font-medium text-muted-foreground mb-1.5">Message</label>
                <textarea id="message" v-model="form.message" rows="4" placeholder="Tell us what's on your mind..." :class="[inputClass, 'resize-none']" />
              </div>
              <button type="submit" class="w-full bg-primary text-primary-foreground text-sm font-medium py-2.5 rounded-lg hover:opacity-90 transition-opacity">
                Send message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
