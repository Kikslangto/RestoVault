const BASE = import.meta.env.VITE_API_URL || '/api';

async function get(path, params = {}) {
  const clean = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '');
  const qs = clean.length ? `?${new URLSearchParams(clean)}` : '';
  const res = await fetch(`${BASE}${path}${qs}`);
  if (!res.ok) {
    const err = new Error(`Request failed: ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

/** params: q, cuisine, price ("P,PP"), featured, slugs, sort, limit */
export const getRestaurants = (params) => get('/restaurants', params);

/** Returns { restaurant, similar } or throws an error with status 404. */
export const getRestaurant = (slug) => get(`/restaurants/${encodeURIComponent(slug)}`);
