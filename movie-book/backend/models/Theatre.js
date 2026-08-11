const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a theatre name'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Please add a city'],
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    facilities: {
      type: [String],
      default: ['Parking', 'Food & Beverage'],
    },
    images: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Theatre', theatreSchema);
