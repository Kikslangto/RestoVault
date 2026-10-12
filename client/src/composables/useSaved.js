import { ref, computed } from 'vue';

const KEY = 'restovault:saved';

function load() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Module-level state: every component shares the same list of saved slugs.
const saved = ref(load());

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(saved.value));
  } catch {
    /* storage unavailable (private mode, etc.) - the list still works for this session */
  }
}

export function useSaved() {
  const count = computed(() => saved.value.length);
  const isSaved = (slug) => saved.value.includes(slug);
  const toggleSave = (slug) => {
    saved.value = isSaved(slug) ? saved.value.filter((s) => s !== slug) : [...saved.value, slug];
    persist();
  };
  const clearSaved = () => {
    saved.value = [];
    persist();
  };
  return { saved, count, isSaved, toggleSave, clearSaved };
}
