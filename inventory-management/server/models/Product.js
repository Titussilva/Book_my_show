const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    SKU: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
    },
    description: {
      type: String,
    },
    purchasePrice: {
      type: Number,
    },
    sellingPrice: {
      type: Number,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
    },
    image: {
      type: String,
    },
    imagePublicId: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

productSchema.virtual('lowStock').get(function () {
  return this.quantity < 10;
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
