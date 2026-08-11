const express = require('express');
const router = express.Router();
const {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require('../controllers/supplierController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/role');

router.route('/')
  .get(protect, getSuppliers)
  .post(protect, adminOnly, createSupplier);

router.route('/:id')
  .put(protect, adminOnly, updateSupplier)
  .delete(protect, adminOnly, deleteSupplier);

module.exports = router;
