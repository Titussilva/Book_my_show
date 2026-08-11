const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

// @desc    Get all products
// @route   GET /api/products
// @access  Private
const getProducts = asyncHandler(async (req, res) => {
  const { search, category, status, sort, page = 1, limit = 10 } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { productName: { $regex: search, $options: 'i' } },
      { SKU: { $regex: search, $options: 'i' } },
    ];
  }

  if (category) {
    query.category = category;
  }

  if (status) {
    if (status === 'low') query.quantity = { $lt: 10, $gt: 0 };
    if (status === 'out') query.quantity = { $eq: 0 };
    if (status === 'in') query.quantity = { $gte: 10 };
  }

  let sortCriteria = { createdAt: -1 };
  if (sort === 'newest') sortCriteria = { createdAt: -1 };
  if (sort === 'oldest') sortCriteria = { createdAt: 1 };
  if (sort === 'price_asc') sortCriteria = { sellingPrice: 1 };
  if (sort === 'price_desc') sortCriteria = { sellingPrice: -1 };
  if (sort === 'stock_asc') sortCriteria = { quantity: 1 };
  if (sort === 'stock_desc') sortCriteria = { quantity: -1 };

  const pageSize = Number(limit);
  const skip = pageSize * (Number(page) - 1);

  const count = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort(sortCriteria)
    .limit(pageSize)
    .skip(skip)
    .populate('category', 'categoryName')
    .populate('supplier', 'supplierName');

  res.json({
    success: true,
    data: {
      products,
      total: count,
      pages: Math.ceil(count / pageSize),
      currentPage: Number(page),
    },
  });
});

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Private
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'categoryName')
    .populate('supplier', 'supplierName');

  if (product) {
    res.json({ success: true, data: product });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    productName,
    SKU,
    category,
    supplier,
    description,
    purchasePrice,
    sellingPrice,
    quantity,
    unit,
  } = req.body;

  const productExists = await Product.findOne({ SKU });
  if (productExists) {
    res.status(400);
    throw new Error('Product with this SKU already exists');
  }

  let image = '';
  let imagePublicId = '';

  if (req.file) {
    image = req.file.path;
    imagePublicId = req.file.filename;
  }

  const product = await Product.create({
    productName,
    SKU,
    category,
    supplier,
    description,
    purchasePrice,
    sellingPrice,
    quantity,
    unit,
    image,
    imagePublicId,
  });

  res.status(201).json({ success: true, data: product });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    product.productName = req.body.productName || product.productName;
    product.category = req.body.category || product.category;
    product.supplier = req.body.supplier || product.supplier;
    product.description = req.body.description || product.description;
    product.purchasePrice = req.body.purchasePrice || product.purchasePrice;
    product.sellingPrice = req.body.sellingPrice || product.sellingPrice;
    product.quantity = req.body.quantity !== undefined ? req.body.quantity : product.quantity;
    product.unit = req.body.unit || product.unit;

    if (req.body.SKU && req.body.SKU !== product.SKU) {
      const skuExists = await Product.findOne({ SKU: req.body.SKU });
      if (skuExists) {
        res.status(400);
        throw new Error('Product with this SKU already exists');
      }
      product.SKU = req.body.SKU;
    }

    if (req.file) {
      if (product.imagePublicId) {
        await cloudinary.uploader.destroy(product.imagePublicId);
      }
      product.image = req.file.path;
      product.imagePublicId = req.file.filename;
    }

    const updatedProduct = await product.save();
    res.json({ success: true, data: updatedProduct });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId);
    }
    await product.deleteOne();
    res.json({ success: true, message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
