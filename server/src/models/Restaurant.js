import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  { name: String, description: String, price: String },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    date: String,
    text: String,
    avatar: String,
  },
  { _id: false }
);

const restaurantSchema = new mongoose.Schema(
  {
    order: { type: Number, required: true, index: true }, // display order for "Recommended"
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    cuisine: { type: String, required: true },
    price: { type: String, enum: ['P', 'PP', 'PPP'], required: true },
    rating: { type: Number, min: 0, max: 5, required: true },
    reviewCount: { type: Number, default: 0 },
    ratingSource: String, // where rating/reviewCount come from, e.g. "Tripadvisor"
    sourceUrl: String, // link to the reviews page
    address: { type: String, required: true },
    description: String,
    longDescription: String,
    image: String,
    heroImage: String,
    tag: { type: String, index: true }, // cuisine filter chip, e.g. "Filipino"
    badge: { type: String, default: null },
    featured: { type: Boolean, default: false },
    featuredDesc: String,
    hours: [{ _id: false, day: String, time: String }],
    phone: String,
    website: String,
    menu: [{ _id: false, category: String, items: [menuItemSchema] }],
    reviews: [reviewSchema],
    tags: [String],
  },
  { timestamps: true }
);

export const Restaurant = mongoose.model('Restaurant', restaurantSchema);
