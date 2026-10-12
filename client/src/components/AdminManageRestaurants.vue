<script setup>
import { ref } from 'vue';
import { Trash2, ShieldCheck, RefreshCw } from 'lucide-vue-next';

const open = ref(false);
const stage = ref('list');
const username = ref('');
const password = ref('');
const token = ref('');
const restaurants = ref([]);
const selected = ref(null);
const busy = ref(false);
const message = ref('');
const messageType = ref('error');

function showMessage(text, type = 'error') {
  message.value = text;
  messageType.value = type;
}

async function readJson(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
  return data;
}

async function loadRestaurants() {
  busy.value = true;
  message.value = '';
  try {
    const response = await fetch('/api/restaurants?sort=recommended');
    restaurants.value = await readJson(response);
  } catch (error) {
    showMessage(error.message || 'Could not load restaurants.');
  } finally {
    busy.value = false;
  }
}

function launch() {
  open.value = true;
  stage.value = 'list';
  selected.value = null;
  token.value = '';
  username.value = '';
  password.value = '';
  message.value = '';
  loadRestaurants();
}

function requestDelete(restaurant) {
  selected.value = restaurant;
  username.value = '';
  password.value = '';
  token.value = '';
  stage.value = 'login';
  message.value = '';
}

async function verifyAdmin() {
  busy.value = true;
  message.value = '';
  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value }),
    });
    const data = await readJson(response);
    token.value = data.token;
    stage.value = 'confirm';
    password.value = '';
  } catch (error) {
    showMessage(error.message || 'Admin login failed.');
  } finally {
    busy.value = false;
  }
}

async function deleteRestaurant() {
  if (!selected.value || !token.value) return;
  busy.value = true;
  message.value = '';
  try {
    const response = await fetch(`/api/admin/restaurants/${encodeURIComponent(selected.value.slug)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token.value}` },
    });
    const data = await readJson(response);
    restaurants.value = restaurants.value.filter((r) => r.slug !== selected.value.slug);
    selected.value = null;
    token.value = '';
    stage.value = 'list';
    showMessage(data.message || 'Restaurant deleted.', 'success');
  } catch (error) {
    showMessage(error.message || 'Could not delete restaurant.');
    if (error.message?.toLowerCase().includes('session') || error.message?.toLowerCase().includes('login')) {
      token.value = '';
      stage.value = 'login';
    }
  } finally {
    busy.value = false;
  }
}

function close() {
  open.value = false;
  token.value = '';
  password.value = '';
}
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
    @click="launch"
  >
    <Trash2 class="h-4 w-4" />
  </button>

  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" @click.self="close">
    <section class="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-background p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="manage-title">
      <div class="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 id="manage-title" class="font-display text-2xl font-bold">
            {{ stage === 'login' ? 'Admin verification' : stage === 'confirm' ? 'Confirm deletion' : 'Manage restaurants' }}
          </h2>
          <p class="mt-1 text-sm text-muted-foreground">
            {{ stage === 'login' ? 'Sign in as an administrator before deleting.' : stage === 'confirm' ? 'This action permanently removes the restaurant from the database.' : 'Choose a restaurant to delete. Admin login is required for each deletion.' }}
          </p>
        </div>
        <button type="button" class="text-2xl leading-none" aria-label="Close" @click="close">×</button>
      </div>

      <div v-if="stage === 'list'">
        <div v-if="busy && !restaurants.length" class="py-8 text-center text-sm text-muted-foreground">Loading restaurants…</div>
        <div v-else-if="!restaurants.length" class="rounded-lg border border-border p-5 text-center text-sm text-muted-foreground">No restaurants found.</div>
        <ul v-else class="divide-y divide-border rounded-xl border border-border">
          <li v-for="restaurant in restaurants" :key="restaurant.slug" class="flex items-center justify-between gap-3 p-3">
            <div class="min-w-0">
              <p class="truncate font-medium">{{ restaurant.name }}</p>
              <p class="truncate text-xs text-muted-foreground">{{ restaurant.cuisine }} · {{ restaurant.address }}</p>
            </div>
            <button type="button" class="shrink-0 rounded-lg border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10" @click="requestDelete(restaurant)">
              Delete
            </button>
          </li>
        </ul>
        <button type="button" class="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground" :disabled="busy" @click="loadRestaurants">
          <RefreshCw class="h-4 w-4" /> Refresh list
        </button>
      </div>

      <form v-else-if="stage === 'login'" class="space-y-4" @submit.prevent="verifyAdmin">
        <div class="rounded-lg bg-secondary p-3 text-sm">
          Restaurant selected: <strong>{{ selected?.name }}</strong>
        </div>
        <label class="block text-sm">Admin username
          <input v-model="username" required autocomplete="username" class="mt-1 w-full rounded-lg border border-border bg-card p-3">
        </label>
        <label class="block text-sm">Admin password
          <input v-model="password" required type="password" autocomplete="current-password" class="mt-1 w-full rounded-lg border border-border bg-card p-3">
        </label>
        <div class="flex gap-3">
          <button type="button" class="flex-1 rounded-lg border border-border p-3" :disabled="busy" @click="stage='list'; message=''">Cancel</button>
          <button type="submit" class="flex-1 rounded-lg bg-primary p-3 font-medium text-primary-foreground disabled:opacity-60" :disabled="busy">
            {{ busy ? 'Verifying…' : 'Verify admin' }}
          </button>
        </div>
      </form>

      <div v-else class="space-y-4">
        <div class="flex gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <ShieldCheck class="h-5 w-5 shrink-0 text-destructive" />
          <div class="text-sm">
            <p class="font-semibold">You are signed in as admin.</p>
            <p class="mt-1">Are you sure you want to permanently delete <strong>{{ selected?.name }}</strong>? This cannot be undone.</p>
          </div>
        </div>
        <div class="flex gap-3">
          <button type="button" class="flex-1 rounded-lg border border-border p-3" :disabled="busy" @click="stage='list'; selected=null; token=''; message=''">Keep restaurant</button>
          <button type="button" class="flex-1 rounded-lg bg-destructive p-3 font-medium text-white disabled:opacity-60" :disabled="busy" @click="deleteRestaurant">
            {{ busy ? 'Deleting…' : 'Delete permanently' }}
          </button>
        </div>
      </div>

      <p v-if="message" class="mt-4 rounded-lg p-3 text-sm" :class="messageType === 'success' ? 'bg-accent text-accent-foreground' : 'bg-destructive/10 text-destructive'" role="status">{{ message }}</p>
    </section>
  </div>
</template>
