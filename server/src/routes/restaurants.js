import { Router } from 'express';
import { Restaurant } from '../models/Restaurant.js';

const router = Router();

const SORTS = {
  recommended: { order: 1 },
  rating_desc: { rating: -1, order: 1 },
  rating_asc: { rating: 1, order: 1 },
  reviews: { reviewCount: -1, order: 1 },
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Photos live in client/public/images and are named after the restaurant's slug, e.g. /images/bale-dutung.jpg.
// A URL saved in the database (image / heroImage) always wins over this default.
const withImages = (r) => ({
  ...r,
  image: r.image || `/images/${r.slug}.jpg`,
  heroImage: r.heroImage || `/images/${r.slug}.jpg`,
});

// Lightweight fields for list views (leaves out menu, reviews, hours, ...).
const LIST_FIELDS =
  'order slug name cuisine price rating reviewCount address description image tag badge featured featuredDesc';

/**
 * GET /api/restaurants
 * Query: q, cuisine, price (comma list: P,PP,PPP), featured=true, slugs (comma list), sort, limit
 */
router.get('/', async (req, res, next) => {
  try {
    const { q, cuisine, price, featured, slugs, sort = 'recommended', limit } = req.query;
    const filter = {};

    if (cuisine && cuisine !== 'All') filter.tag = String(cuisine);
    if (price) filter.price = { $in: String(price).split(',').filter(Boolean) };
    if (featured === 'true') filter.featured = true;
    if (slugs) filter.slug = { $in: String(slugs).split(',').filter(Boolean) };
    if (q && String(q).trim()) {
      const rx = new RegExp(escapeRegex(String(q).trim()), 'i');
      filter.$or = [{ name: rx }, { address: rx }, { cuisine: rx }];
    }

    let query = Restaurant.find(filter).select(LIST_FIELDS).sort(SORTS[sort] || SORTS.recommended);
    const max = Number.parseInt(limit, 10);
    if (max > 0) query = query.limit(max);

    res.json((await query.lean()).map(withImages));
  } catch (err) {
    next(err);
  }
});

/** GET /api/restaurants/:slug -> { restaurant, similar } */
router.get('/:slug', async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({ slug: req.params.slug }).lean();
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    let similar = await Restaurant.find({ _id: { $ne: restaurant._id }, tag: restaurant.tag })
      .select(LIST_FIELDS)
      .sort({ order: 1 })
      .limit(3)
      .lean();

    if (similar.length < 3) {
      const exclude = [restaurant._id, ...similar.map((s) => s._id)];
      const more = await Restaurant.find({ _id: { $nin: exclude } })
        .select(LIST_FIELDS)
        .sort({ order: 1 })
        .limit(3 - similar.length)
        .lean();
      similar = [...similar, ...more];
    }

    res.json({ restaurant: withImages(restaurant), similar: similar.map(withImages) });
  } catch (err) {
    next(err);
  }
});

export default router;
