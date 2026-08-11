const express = require('express');
const router = express.Router();
const {
  stockIn,
  stockOut,
  getTransactionHistory,
  getDashboardStats,
} = require('../controllers/inventoryController');
const { protect } = require('../middleware/auth');

router.post('/stock-in', protect, stockIn);
router.post('/stock-out', protect, stockOut);
router.get('/history', protect, getTransactionHistory);
router.get('/stats', protect, getDashboardStats);

module.exports = router;
