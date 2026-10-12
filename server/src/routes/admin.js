import { Router } from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';
import { Restaurant } from '../models/Restaurant.js';

const router = Router();
const here = path.dirname(fileURLToPath(import.meta.url));
const imageDir = path.resolve(here, '../../../client/public/images');
fs.mkdirSync(imageDir, { recursive: true });
const secret = () => process.env.ADMIN_TOKEN_SECRET || process.env.ADMIN_PASSWORD || '';
const sign = (payload) => {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${data}.${crypto.createHmac('sha256', secret()).update(data).digest('base64url')}`;
};
function requireAdmin(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const [data, signature] = token.split('.');
  if (!secret() || !data || !signature) return res.status(401).json({ message: 'Admin login required.' });
  const expected = crypto.createHmac('sha256', secret()).update(data).digest();
  let actual;
  try { actual = Buffer.from(signature, 'base64url'); } catch { return res.status(401).json({ message: 'Invalid admin session.' }); }
  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) return res.status(401).json({ message: 'Invalid admin session.' });
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString());
    if (payload.role !== 'admin') return res.status(403).json({ message: 'Administrator access required.' });
    if (!Number.isFinite(payload.exp) || payload.exp < Date.now()) return res.status(401).json({ message: 'Admin session expired. Please log in again.' });
  } catch { return res.status(401).json({ message: 'Invalid admin session.' }); }
  next();
}

router.post('/login', (req, res) => {
  const username = String(req.body?.username || '');
  const password = String(req.body?.password || '');
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    return res.status(503).json({ message: 'Admin login is not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD in server/.env.' });
  }
  const safeEqual = (a, b) => {
    const aa = Buffer.from(a); const bb = Buffer.from(b);
    return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
  };
  if (!safeEqual(username, process.env.ADMIN_USERNAME) || !safeEqual(password, process.env.ADMIN_PASSWORD)) {
    return res.status(401).json({ message: 'Incorrect username or password.' });
  }
  if (!secret()) return res.status(503).json({ message: 'Set ADMIN_TOKEN_SECRET in server/.env.' });
  res.json({ token: sign({ role: 'admin', exp: Date.now() + 8 * 60 * 60 * 1000 }) });
});

router.post('/restaurants', requireAdmin, (req, res, next) => {
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, imageDir),
    filename: (_request, _file, cb) => cb(null, `restaurant-upload-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.png`),
  });
  const pngUpload = multer({
    storage,
    limits: { fileSize: 3 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => file.mimetype === 'image/png' ? cb(null, true) : cb(new Error('Please upload a PNG image only.')),
  }).single('image');

  pngUpload(req, res, async (uploadError) => {
    if (uploadError) return res.status(400).json({ message: uploadError.message || 'Image upload failed.' });
    try {
      const name = String(req.body.name || '').trim();
      const cuisine = String(req.body.cuisine || '').trim();
      const address = String(req.body.address || '').trim();
      const price = String(req.body.price || 'PP');
      const rating = Number(req.body.rating ?? 0);
      const description = String(req.body.description || '').trim();
      if (!name || !cuisine || !address) {
        if (req.file) fs.unlink(req.file.path, () => {});
        return res.status(400).json({ message: 'Restaurant name, cuisine, and address are required.' });
      }
      if (!req.file) return res.status(400).json({ message: 'Please choose a PNG image.' });
      if (!['P', 'PP', 'PPP'].includes(price)) return res.status(400).json({ message: 'Choose a valid price range.' });
      if (!Number.isFinite(rating) || rating < 0 || rating > 5) return res.status(400).json({ message: 'Rating must be between 0 and 5.' });
      const slug = name.toLowerCase().normalize('NFKD').replace(/[\\u0300-\\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const existing = await Restaurant.findOne({ slug });
      const finalFilename = `${slug}-${Date.now()}.png`;
      const finalPath = path.join(imageDir, finalFilename);
      if (!existing) {
        fs.renameSync(req.file.path, finalPath);
        req.file.path = finalPath;
        req.file.filename = finalFilename;
      }
      if (existing) {
        fs.unlink(req.file.path, () => {});
        return res.status(409).json({ message: 'A restaurant with that name already exists.' });
      }
      const count = await Restaurant.countDocuments();
      const restaurant = await Restaurant.create({
        order: count + 1, slug, name, cuisine, tag: cuisine, price, rating,
        reviewCount: 0, address, description,
        image: `/images/${path.basename(req.file.filename)}`,
        heroImage: `/images/${path.basename(req.file.filename)}`,
        featured: false, menu: [], reviews: [], hours: [], tags: [],
      });
      res.status(201).json({ message: 'Restaurant added successfully.', restaurant });
    } catch (err) {
      if (req.file) fs.unlink(req.file.path, () => {});
      next(err);
    }
  });
});


// Delete a restaurant. This endpoint is protected by the signed admin session.
router.delete('/restaurants/:slug', requireAdmin, async (req, res, next) => {
  try {
    const slug = String(req.params.slug || '').trim();
    if (!slug) return res.status(400).json({ message: 'Restaurant slug is required.' });

    const restaurant = await Restaurant.findOneAndDelete({ slug });
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found. It may already have been deleted.' });

    // Keep the recommended ordering compact after a deletion.
    const remaining = await Restaurant.find().sort({ order: 1, _id: 1 }).select('_id order').lean();
    await Promise.all(remaining.map((item, index) =>
      Restaurant.updateOne({ _id: item._id }, { $set: { order: index + 1 } })
    ));

    res.json({ message: `${restaurant.name} was deleted successfully.`, slug: restaurant.slug });
  } catch (err) {
    next(err);
  }
});

export default router;
