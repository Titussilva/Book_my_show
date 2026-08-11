require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
const Supplier = require('./models/Supplier');
const Product = require('./models/Product');
const InventoryTransaction = require('./models/InventoryTransaction');
const connectDB = require('./config/db');

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Supplier.deleteMany();
    await Product.deleteMany();
    await InventoryTransaction.deleteMany();

    // Create Users
    const users = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@inventory.com',
        password: 'Admin@123', // Will be hashed by pre-save middleware (but insertMany bypasses pre-save) - wait, insertMany bypasses pre-save hook. Let's create one by one.
        role: 'admin',
      },
      {
        name: 'Employee User',
        email: 'employee@inventory.com',
        password: 'Employee@123',
        role: 'employee',
      },
    ]);
    
    // Quick fix: hashing for insertMany or save each user
    await User.deleteMany();
    
    const admin = new User({
        name: 'Admin User',
        email: 'admin@inventory.com',
        password: 'Admin@123',
        role: 'admin',
    });
    await admin.save();
    
    const employee = new User({
        name: 'Employee User',
        email: 'employee@inventory.com',
        password: 'Employee@123',
        role: 'employee',
    });
    await employee.save();


    // Create Categories
    const categories = await Category.insertMany([
      { categoryName: 'Electronics', description: 'Electronic items and accessories' },
      { categoryName: 'Furniture', description: 'Office and home furniture' },
      { categoryName: 'Stationery', description: 'Office stationery and supplies' },
    ]);

    // Create Suppliers
    const suppliers = await Supplier.insertMany([
      { supplierName: 'TechCorp', email: 'contact@techcorp.com', phone: '1234567890', address: '123 Tech St' },
      { supplierName: 'FurniHub', email: 'sales@furnihub.com', phone: '0987654321', address: '456 Wood Rd' },
      { supplierName: 'OfficePro', email: 'info@officepro.com', phone: '1122334455', address: '789 Paper Ave' },
    ]);

    // Create Products
    const products = await Product.insertMany([
      {
        productName: 'Laptop Pro',
        SKU: 'LAP-001',
        category: categories[0]._id,
        supplier: suppliers[0]._id,
        description: 'High performance laptop',
        purchasePrice: 800,
        sellingPrice: 1200,
        quantity: 50,
        unit: 'pcs',
      },
      {
        productName: 'Ergonomic Chair',
        SKU: 'CHR-001',
        category: categories[1]._id,
        supplier: suppliers[1]._id,
        description: 'Comfortable office chair',
        purchasePrice: 50,
        sellingPrice: 150,
        quantity: 100,
        unit: 'pcs',
      },
      {
        productName: 'Wireless Mouse',
        SKU: 'MOU-001',
        category: categories[0]._id,
        supplier: suppliers[0]._id,
        description: 'Bluetooth optical mouse',
        purchasePrice: 10,
        sellingPrice: 25,
        quantity: 8, // Low stock
        unit: 'pcs',
      },
      {
        productName: 'A4 Paper Ream',
        SKU: 'PAP-001',
        category: categories[2]._id,
        supplier: suppliers[2]._id,
        description: '500 sheets A4 paper',
        purchasePrice: 2,
        sellingPrice: 5,
        quantity: 200,
        unit: 'packs',
      },
      {
        productName: 'Standing Desk',
        SKU: 'DSK-001',
        category: categories[1]._id,
        supplier: suppliers[1]._id,
        description: 'Motorized standing desk',
        purchasePrice: 200,
        sellingPrice: 450,
        quantity: 15,
        unit: 'pcs',
      },
    ]);

    // Create Inventory Transactions
    const transactions = [];
    for (let i = 0; i < 5; i++) {
      transactions.push({
        product: products[i]._id,
        user: admin._id,
        type: 'Stock In',
        quantity: products[i].quantity,
        remarks: 'Initial stock',
      });
    }

    // Add some random Stock Out transactions
    transactions.push(
      {
        product: products[0]._id,
        user: employee._id,
        type: 'Stock Out',
        quantity: 5,
        remarks: 'Sales dispatch',
      },
      {
        product: products[1]._id,
        user: employee._id,
        type: 'Stock Out',
        quantity: 10,
        remarks: 'Bulk order',
      },
      {
        product: products[3]._id,
        user: admin._id,
        type: 'Stock Out',
        quantity: 20,
        remarks: 'Internal use',
      }
    );

    await InventoryTransaction.insertMany(transactions);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
