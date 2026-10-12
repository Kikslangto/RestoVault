import 'dotenv/config';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import mongoose from 'mongoose';
import { Restaurant } from './models/Restaurant.js';

const data = JSON.parse(
  fs.readFileSync(new URL('./data/restaurants.json', import.meta.url), 'utf8')
);

/** Inserts the sample restaurants. Pass { force: true } to wipe the collection first. */
export async function seedRestaurants({ force = false } = {}) {
  const count = await Restaurant.countDocuments();
  if (count > 0 && !force) return 0;
  await Restaurant.deleteMany({});
  await Restaurant.insertMany(data);
  return data.length;
}

// Run directly: `npm run seed`
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/restovault';
  try {
    await mongoose.connect(uri);
    const n = await seedRestaurants({ force: true });
    console.log(`Seeded ${n} restaurants into ${mongoose.connection.name}.`);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}
