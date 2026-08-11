const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const InventoryTransaction = require('../models/InventoryTransaction');
const Category = require('../models/Category');
const Supplier = require('../models/Supplier');

// @desc    Stock In
// @route   POST /api/inventory/stock-in
// @access  Private
const stockIn = asyncHandler(async (req, res) => {
  const { productId, quantity, remarks } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    res.status(400);
    throw new Error('Product ID and a valid quantity are required');
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product.quantity += Number(quantity);
  await product.save();

  const transaction = await InventoryTransaction.create({
    product: productId,
    user: req.user._id,
    type: 'Stock In',
    quantity: Number(quantity),
    remarks,
  });

  res.status(201).json({
    success: true,
    data: {
      product,
      transaction,
    },
  });
});

// @desc    Stock Out
// @route   POST /api/inventory/stock-out
// @access  Private
const stockOut = asyncHandler(async (req, res) => {
  const { productId, quantity, remarks } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    res.status(400);
    throw new Error('Product ID and a valid quantity are required');
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.quantity - Number(quantity) < 0) {
    res.status(400);
    throw new Error('Insufficient stock for this operation');
  }

  product.quantity -= Number(quantity);
  await product.save();

  const transaction = await InventoryTransaction.create({
    product: productId,
    user: req.user._id,
    type: 'Stock Out',
    quantity: Number(quantity),
    remarks,
  });

  res.status(201).json({
    success: true,
    data: {
      product,
      transaction,
    },
  });
});

// @desc    Get transaction history
// @route   GET /api/inventory/history
// @access  Private
const getTransactionHistory = asyncHandler(async (req, res) => {
  const { product, type, user, dateFrom, dateTo, page = 1, limit = 10 } = req.query;

  const query = {};

  if (product) query.product = product;
  if (type) query.type = type;
  if (user) query.user = user;

  if (dateFrom || dateTo) {
    query.createdAt = {};
    if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
    if (dateTo) query.createdAt.$lte = new Date(dateTo);
  }

  const pageSize = Number(limit);
  const skip = pageSize * (Number(page) - 1);

  const count = await InventoryTransaction.countDocuments(query);
  const transactions = await InventoryTransaction.find(query)
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(skip)
    .populate('product', 'productName SKU image')
    .populate('user', 'name email');

  res.json({
    success: true,
    data: {
      transactions,
      total: count,
      pages: Math.ceil(count / pageSize),
      currentPage: Number(page),
    },
  });
});

// @desc    Get Dashboard Stats
// @route   GET /api/inventory/stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const totalCategories = await Category.countDocuments();
  const totalSuppliers = await Supplier.countDocuments();
  const lowStockProducts = await Product.countDocuments({ quantity: { $lt: 10 } });

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const todayTransactions = await InventoryTransaction.countDocuments({
    createdAt: { $gte: startOfToday },
  });

  const recentTransactions = await InventoryTransaction.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('product', 'productName')
    .populate('user', 'name');

  const productsByCategory = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'categoryInfo',
      },
    },
    {
      $unwind: '$categoryInfo',
    },
    {
      $project: {
        categoryName: '$categoryInfo.categoryName',
        count: 1,
      },
    },
  ]);

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyStockIn = await InventoryTransaction.aggregate([
    {
      $match: { type: 'Stock In', createdAt: { $gte: sixMonthsAgo } },
    },
    {
      $group: {
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        total: { $sum: '$quantity' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const monthlyStockOut = await InventoryTransaction.aggregate([
    {
      $match: { type: 'Stock Out', createdAt: { $gte: sixMonthsAgo } },
    },
    {
      $group: {
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        total: { $sum: '$quantity' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const lowStockItems = await Product.find({ quantity: { $lt: 10 } })
    .limit(5)
    .select('productName SKU quantity');

  res.json({
    success: true,
    data: {
      totalProducts,
      totalCategories,
      totalSuppliers,
      lowStockProducts,
      todayTransactions,
      recentTransactions,
      productsByCategory,
      monthlyStockIn,
      monthlyStockOut,
      lowStockItems,
    },
  });
});

module.exports = {
  stockIn,
  stockOut,
  getTransactionHistory,
  getDashboardStats,
};
