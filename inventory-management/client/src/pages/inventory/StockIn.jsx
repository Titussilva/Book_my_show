import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiPlusCircle, FiCheckCircle } from 'react-icons/fi';
import { stockIn } from '../../services/inventoryService';
import { getProducts } from '../../services/productService';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

/**
 * Record Stock In page
 * Adds incoming quantity to product inventory & records transaction
 */
const StockIn = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    product: '',
    quantity: '',
    remarks: '',
  });

  const [selectedProductDetails, setSelectedProductDetails] = useState(null);

  useEffect(() => {
    const fetchProductsList = async () => {
      try {
        const res = await getProducts({ limit: 100 });
        setProducts(res.data.data.products || []);
      } catch {
        toast.error('Failed to load products list');
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProductsList();
  }, []);

  const handleProductChange = (e) => {
    const productId = e.target.value;
    setFormData((prev) => ({ ...prev, product: productId }));
    const found = products.find((p) => p._id === productId);
    setSelectedProductDetails(found || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.product) {
      toast.error('Please select a product');
      return;
    }
    if (!formData.quantity || Number(formData.quantity) <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }

    setSubmitting(true);
    try {
      await stockIn({
        product: formData.product,
        quantity: Number(formData.quantity),
        remarks: formData.remarks,
      });
      toast.success('Stock In recorded successfully!');
      navigate('/inventory/transactions');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record stock in');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProducts) return <Spinner message="Loading products list..." />;

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <FiPlusCircle className="text-success" /> Record Stock In
          </h1>
          <p className="page-subtitle">Increase product stock count for incoming inventory</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Select Product */}
          <div className="form-group">
            <label className="form-label">
              Select Product <span className="required">*</span>
            </label>
            <select
              className="form-select"
              value={formData.product}
              onChange={handleProductChange}
              required
            >
              <option value="">-- Choose a product --</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.productName} (SKU: {p.SKU}) — Current Stock: {p.quantity} {p.unit || ''}
                </option>
              ))}
            </select>
          </div>

          {/* Current Stock Preview Card */}
          {selectedProductDetails && (
            <div
              className="alert alert-info"
              style={{ marginBottom: '1.25rem' }}
            >
              <div>
                <p style={{ fontWeight: 600 }}>Selected: {selectedProductDetails.productName}</p>
                <p className="text-xs" style={{ marginTop: '0.2rem' }}>
                  Current Stock: <strong>{selectedProductDetails.quantity} {selectedProductDetails.unit || 'units'}</strong>
                  {formData.quantity > 0 && (
                    <span className="text-success" style={{ marginLeft: '0.5rem', fontWeight: 600 }}>
                      → New Stock: {selectedProductDetails.quantity + Number(formData.quantity)} {selectedProductDetails.unit || 'units'}
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="form-group">
            <label className="form-label">
              Quantity to Add <span className="required">*</span>
            </label>
            <input
              type="number"
              min="1"
              step="1"
              className="form-input"
              placeholder="e.g. 50"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
          </div>

          {/* Remarks */}
          <div className="form-group">
            <label className="form-label">Remarks / Note</label>
            <textarea
              className="form-textarea"
              placeholder="e.g. Supplier PO #1042 delivery, rested in Warehouse A"
              rows={3}
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/products')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="success"
              loading={submitting}
            >
              <FiCheckCircle /> Save Stock In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockIn;
