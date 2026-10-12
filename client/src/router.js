import { createRouter, createWebHistory } from 'vue-router';
import Home from './pages/Home.vue';
import Discover from './pages/Discover.vue';
import TopRated from './pages/TopRated.vue';
import OurStory from './pages/OurStory.vue';
import RestaurantDetail from './pages/RestaurantDetail.vue';
import SavedPlaces from './pages/SavedPlaces.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/discover', component: Discover },
    { path: '/top-rated', component: TopRated },
    { path: '/our-story', component: OurStory },
    { path: '/restaurant/:slug', component: RestaurantDetail },
    { path: '/saved', component: SavedPlaces },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to, from, saved) {
    if (saved) return saved;
    if (to.hash) return { el: to.hash, top: 72, behavior: 'smooth' };
    // Same page, only the query string changed (search/filter): keep scroll position.
    if (to.path === from.path) return false;
    return { top: 0 };
  },
});
