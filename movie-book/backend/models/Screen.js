const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a screen name (e.g., Screen 1)'],
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: true,
    },
    // We can store a simplified seating layout here, but for now we'll 
    // dynamically generate a standard layout during booking or show creation.
    // e.g., 5 rows, 10 columns
    rows: {
      type: Number,
      default: 5,
    },
    columns: {
      type: Number,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Screen', screenSchema);
