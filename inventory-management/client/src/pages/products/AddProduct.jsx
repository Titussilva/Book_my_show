import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiUploadCloud, FiCheck } from 'react-icons/fi';
import { createProduct } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import { getSuppliers } from '../../services/supplierService';
import Button from '../../components/common/Button';

/**
 * Add Product page — Admin only
 * Handles product creation with Cloudinary image upload via FormData
 */
const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    productName: '',
    SKU: '',
    category: '',
    supplier: '',
    purchasePrice: '',
    sellingPrice: '',
    quantity: '0',
    unit: 'pcs',
    description: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    Promise.all([getCategories(), getSuppliers()])
      .then(([catRes, supRes]) => {
        setCategories(catRes.data.data || []);
        setSuppliers(supRes.data.data || []);
      })
      .catch(() => toast.error('Failed to load categories or suppliers'));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file (JPG, PNG, WebP)');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.productName.trim()) errs.productName = 'Product name is required';
    if (!formData.SKU.trim()) errs.SKU = 'SKU code is required';
    if (!formData.purchasePrice || Number(formData.purchasePrice) < 0)
      errs.purchasePrice = 'Valid purchase price is required';
    if (!formData.sellingPrice || Number(formData.sellingPrice) < 0)
      errs.sellingPrice = 'Valid selling price is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });
      if (imageFile) {
        data.append('image', imageFile);
      }

      await createProduct(data);
      toast.success('Product created successfully!');
      navigate('/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/products')}>
            <FiArrowLeft /> Back
          </Button>

          <div>
            <h1 className="page-title">Add New Product</h1>
            <p className="page-subtitle">Fill in product specifications and pricing</p>
          </div>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Row 1: Name & SKU */}
          <div className="two-col-grid">
            <div className="form-group">
              <label className="form-label">
                Product Name <span className="required">*</span>
              </label>
              <input
                name="productName"
                className={`form-input ${errors.productName ? 'error' : ''}`}
                placeholder="e.g. Wireless Ergonomic Mouse"
                value={formData.productName}
                onChange={handleChange}
              />
              {errors.productName && <p className="form-error">{errors.productName}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">
                SKU (Stock Keeping Unit) <span className="required">*</span>
              </label>
              <input
                name="SKU"
                className={`form-input ${errors.SKU ? 'error' : ''}`}
                placeholder="e.g. ELEC-MOU-001"
                value={formData.SKU}
                onChange={handleChange}
              />
              {errors.SKU && <p className="form-error">{errors.SKU}</p>}
            </div>
          </div>

          {/* Row 2: Category & Supplier */}
          <div className="two-col-grid">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">-- Select Category --</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Supplier</label>
              <select
                name="supplier"
                className="form-select"
                value={formData.supplier}
                onChange={handleChange}
              >
                <option value="">-- Select Supplier --</option>
                {suppliers.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.supplierName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Prices */}
          <div className="two-col-grid">
            <div className="form-group">
              <label className="form-label">
                Purchase Price ($) <span className="required">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="purchasePrice"
                className={`form-input ${errors.purchasePrice ? 'error' : ''}`}
                placeholder="0.00"
                value={formData.purchasePrice}
                onChange={handleChange}
              />
              {errors.purchasePrice && <p className="form-error">{errors.purchasePrice}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Selling Price ($) <span className="required">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="sellingPrice"
                className={`form-input ${errors.sellingPrice ? 'error' : ''}`}
                placeholder="0.00"
                value={formData.sellingPrice}
                onChange={handleChange}
              />
              {errors.sellingPrice && <p className="form-error">{errors.sellingPrice}</p>}
            </div>
          </div>

          {/* Row 4: Quantity & Unit */}
          <div className="two-col-grid">
            <div className="form-group">
              <label className="form-label">Initial Quantity</label>
              <input
                type="number"
                min="0"
                name="quantity"
                className="form-input"
                placeholder="0"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Unit of Measure</label>
              <input
                name="unit"
                className="form-input"
                placeholder="e.g. pcs, kg, boxes"
                value={formData.unit}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Image Upload Box */}
          <div className="form-group">
            <label className="form-label">Product Image</label>
            <label className="img-upload-box flex flex-col items-center justify-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              {imagePreview ? (
                <div style={{ textAlign: 'center' }}>
                  <img src={imagePreview} alt="Preview" className="img-preview" />
                  <p className="text-accent text-xs mt-2">Click to change image</p>
                </div>
              ) : (
                <>
                  <FiUploadCloud size={32} className="text-accent mb-2" />
                  <p className="font-semibold text-sm">Click to upload product image</p>
                  <p className="text-muted text-xs">Supports JPG, PNG, WebP up to 5MB</p>
                </>
              )}
            </label>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-textarea"
              placeholder="Product specs, features, or notes..."
              rows={3}
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/products')}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              <FiCheck /> Save Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
