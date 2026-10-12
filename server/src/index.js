import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import adminRouter from './routes/admin.js';
import cors from 'cors';
import mongoose from 'mongoose';
import restaurantsRouter from './routes/restaurants.js';
import { seedRestaurants } from './seed.js';

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/restovault';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' })
);
app.use('/api/admin', adminRouter);
app.use('/api/restaurants', restaurantsRouter);
app.use('/api', (_req, res) => res.status(404).json({ message: 'Not found' }));

// After `npm run build`, the Express server can also serve the Vue app itself.
const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

try {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
  const seeded = await seedRestaurants(); // only seeds when the collection is empty
  if (seeded) console.log(`Seeded ${seeded} sample restaurants.`);
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
} catch (err) {
  console.error('\nCould not connect to MongoDB at:', MONGODB_URI);
  console.error(err.message);
  console.error('\nMake sure MongoDB is running (or fix MONGODB_URI in server/.env).\n');
  process.exit(1);
}
