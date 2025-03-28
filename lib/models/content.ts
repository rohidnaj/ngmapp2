import mongoose, { Schema } from 'mongoose';
import { ContentState } from '@/lib/content-context';

// Define TypeScript interface for model
interface ContentModel extends ContentState {
  _id: string;
  updatedAt: Date;
}

// Define the schema
const contentSchema = new Schema(
  {
    home: {
      heroImage: String,
      heroTitle: String,
      heroDescription: String,
      heroButtonText: String,
    },
    about: {
      story: String,
      image: String,
      stats: {
        years: Number,
        satisfaction: Number,
      },
    },
    services: [
      {
        title: String,
        description: String,
        image: String,
        features: [String],
      },
    ],
    testimonials: [
      {
        content: String,
        author: String,
        location: String,
      },
    ],
    galleryImages: [
      {
        url: String,
        title: String,
        description: String,
      },
    ],
    reviews: [
      {
        author: String,
        date: String,
        content: String,
      },
    ],
    blogPosts: [
      {
        title: String,
        date: String,
        image: String,
        excerpt: String,
      },
    ],
    contactInfo: {
      address: String,
      phone: String,
      email: String,
      businessHours: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create or retrieve the model
export default mongoose.models.Content || mongoose.model('Content', contentSchema); 