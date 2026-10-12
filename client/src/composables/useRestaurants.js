import { ref, watch } from 'vue';
import { getRestaurants } from '../api';

/**
 * Loads restaurants from the API and reloads whenever the params change.
 * `getParams` must be a function that returns the query params, or null to skip the request.
 */
export function useRestaurants(getParams) {
  const restaurants = ref([]);
  const loading = ref(true);
  const error = ref('');
  let latest = 0;

  async function load() {
    const id = ++latest; // ignore out-of-order responses
    const params = getParams();
    error.value = '';
    if (params === null) {
      restaurants.value = [];
      loading.value = false;
      return;
    }
    loading.value = true;
    try {
      const data = await getRestaurants(params);
      if (id === latest) restaurants.value = data;
    } catch {
      if (id === latest) error.value = "We couldn't load restaurants. Check that the server and MongoDB are running.";
    } finally {
      if (id === latest) loading.value = false;
    }
  }

  watch(getParams, load, { immediate: true });
  return { restaurants, loading, error, reload: load };
}
