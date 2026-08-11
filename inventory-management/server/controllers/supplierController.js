const asyncHandler = require('express-async-handler');
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Private
const getSuppliers = asyncHandler(async (req, res) => {
  const suppliers = await Supplier.find({}).sort({ createdAt: -1 });
  res.json({ success: true, data: suppliers });
});

// @desc    Create supplier
// @route   POST /api/suppliers
// @access  Private/Admin
const createSupplier = asyncHandler(async (req, res) => {
  const { supplierName, email, phone, address } = req.body;

  if (!supplierName) {
    res.status(400);
    throw new Error('Supplier name is required');
  }

  const supplier = await Supplier.create({
    supplierName,
    email,
    phone,
    address,
  });

  res.status(201).json({ success: true, data: supplier });
});

// @desc    Update supplier
// @route   PUT /api/suppliers/:id
// @access  Private/Admin
const updateSupplier = asyncHandler(async (req, res) => {
  const { supplierName, email, phone, address } = req.body;

  const supplier = await Supplier.findById(req.params.id);

  if (supplier) {
    supplier.supplierName = supplierName || supplier.supplierName;
    supplier.email = email || supplier.email;
    supplier.phone = phone || supplier.phone;
    supplier.address = address || supplier.address;

    const updatedSupplier = await supplier.save();
    res.json({ success: true, data: updatedSupplier });
  } else {
    res.status(404);
    throw new Error('Supplier not found');
  }
});

// @desc    Delete supplier
// @route   DELETE /api/suppliers/:id
// @access  Private/Admin
const deleteSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);

  if (supplier) {
    const productsWithSupplier = await Product.findOne({ supplier: req.params.id });
    if (productsWithSupplier) {
      res.status(400);
      throw new Error('Cannot delete supplier. Products exist with this supplier.');
    }

    await supplier.deleteOne();
    res.json({ success: true, message: 'Supplier removed' });
  } else {
    res.status(404);
    throw new Error('Supplier not found');
  }
});

module.exports = {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
