const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/role');
const upload = require('../middleware/upload');

router.route('/')
  .get(protect, getProducts)
  .post(protect, adminOnly, upload.single('image'), createProduct);

router.route('/:id')
  .get(protect, getProductById)
  .put(protect, adminOnly, upload.single('image'), updateProduct)
  .delete(protect, adminOnly, deleteProduct);

module.exports = router;
