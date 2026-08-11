import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiUploadCloud, FiCheck } from 'react-icons/fi';
import { getProductById, updateProduct } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import { getSuppliers } from '../../services/supplierService';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

/**
 * Edit Product page — Admin only
 * Pre-fills product details and handles image replacement
 */
const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
  const [existingImage, setExistingImage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [prodRes, catRes, supRes] = await Promise.all([
          getProductById(id),
          getCategories(),
          getSuppliers(),
        ]);

        const prod = prodRes.data.data;
        setFormData({
          productName: prod.productName || '',
          SKU: prod.SKU || '',
          category: prod.category?._id || prod.category || '',
          supplier: prod.supplier?._id || prod.supplier || '',
          purchasePrice: prod.purchasePrice || '',
          sellingPrice: prod.sellingPrice || '',
          quantity: prod.quantity || '0',
          unit: prod.unit || 'pcs',
          description: prod.description || '',
        });
        if (prod.image) {
          setExistingImage(prod.image);
        }

        setCategories(catRes.data.data || []);
        setSuppliers(supRes.data.data || []);
      } catch (err) {
        toast.error('Failed to load product details');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
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

    setSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== undefined && formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });
      if (imageFile) {
        data.append('image', imageFile);
      }

      await updateProduct(id, data);
      toast.success('Product updated successfully!');
      navigate('/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner message="Loading product data..." />;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/products')}>
            <FiArrowLeft /> Back
          </Button>

          <div>
            <h1 className="page-title">Edit Product</h1>
            <p className="page-subtitle">Update product information and pricing</p>
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
                value={formData.sellingPrice}
                onChange={handleChange}
              />
              {errors.sellingPrice && <p className="form-error">{errors.sellingPrice}</p>}
            </div>
          </div>

          {/* Row 4: Quantity & Unit */}
          <div className="two-col-grid">
            <div className="form-group">
              <label className="form-label">Quantity in Stock</label>
              <input
                type="number"
                min="0"
                name="quantity"
                className="form-input"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Unit of Measure</label>
              <input
                name="unit"
                className="form-input"
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
              {imagePreview || existingImage ? (
                <div style={{ textAlign: 'center' }}>
                  <img
                    src={imagePreview || existingImage}
                    alt="Preview"
                    className="img-preview"
                  />
                  <p className="text-accent text-xs mt-2">Click to replace image</p>
                </div>
              ) : (
                <>
                  <FiUploadCloud size={32} className="text-accent mb-2" />
                  <p className="font-semibold text-sm">Click to upload product image</p>
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
              rows={3}
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/products')}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              <FiCheck /> Update Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
