const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a movie title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    genre: {
      type: [String],
      required: [true, 'Please add at least one genre'],
    },
    language: {
      type: [String],
      required: [true, 'Please add at least one language'],
    },
    duration: {
      type: Number,
      required: [true, 'Please add duration in minutes'],
    },
    releaseDate: {
      type: Date,
      required: [true, 'Please add a release date'],
    },
    poster: {
      type: String,
      required: [true, 'Please add a poster image URL'],
    },
    backdrop: {
      type: String,
    },
    trailerUrl: {
      type: String,
      required: [true, 'Please add a trailer URL'],
    },
    cast: [
      {
        name: {
          type: String,
          required: true,
        },
        role: String,
        image: String,
      },
    ],
    director: {
      type: String,
      required: [true, 'Please add a director'],
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    ageRating: {
      type: String,
      required: [true, 'Please add an age rating (e.g., U, UA, A)'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Movie', movieSchema);
