import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMinusCircle, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { stockOut } from '../../services/inventoryService';
import { getProducts } from '../../services/productService';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

/**
 * Record Stock Out page
 * Deducts outgoing quantity from product inventory & prevents negative stock
 */
const StockOut = () => {
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

  const qtyNumber = Number(formData.quantity) || 0;
  const isInsufficient = selectedProductDetails && qtyNumber > selectedProductDetails.quantity;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.product) {
      toast.error('Please select a product');
      return;
    }
    if (qtyNumber <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }
    if (isInsufficient) {
      toast.error(`Cannot remove ${qtyNumber} units. Only ${selectedProductDetails.quantity} units in stock!`);
      return;
    }

    setSubmitting(true);
    try {
      await stockOut({
        product: formData.product,
        quantity: qtyNumber,
        remarks: formData.remarks,
      });
      toast.success('Stock Out recorded successfully!');
      navigate('/inventory/transactions');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record stock out');
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
            <FiMinusCircle className="text-danger" /> Record Stock Out
          </h1>
          <p className="page-subtitle">Deduct quantity for sales, dispatches, or damage</p>
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
              className={`alert ${isInsufficient ? 'alert-danger' : 'alert-info'}`}
              style={{ marginBottom: '1.25rem' }}
            >
              <div>
                <p style={{ fontWeight: 600 }}>
                  Selected: {selectedProductDetails.productName}
                </p>
                <p className="text-xs" style={{ marginTop: '0.2rem' }}>
                  Available Stock: <strong>{selectedProductDetails.quantity} {selectedProductDetails.unit || 'units'}</strong>
                  {!isInsufficient && qtyNumber > 0 && (
                    <span className="text-danger" style={{ marginLeft: '0.5rem', fontWeight: 600 }}>
                      → Remaining: {selectedProductDetails.quantity - qtyNumber} {selectedProductDetails.unit || 'units'}
                    </span>
                  )}
                </p>
                {isInsufficient && (
                  <p className="form-error" style={{ marginTop: '0.25rem' }}>
                    <FiAlertTriangle /> Exceeds available inventory! Negative stock is prohibited.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="form-group">
            <label className="form-label">
              Quantity to Deduct <span className="required">*</span>
            </label>
            <input
              type="number"
              min="1"
              max={selectedProductDetails ? selectedProductDetails.quantity : undefined}
              step="1"
              className={`form-input ${isInsufficient ? 'error' : ''}`}
              placeholder="e.g. 5"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
          </div>

          {/* Remarks */}
          <div className="form-group">
            <label className="form-label">Remarks / Reason</label>
            <textarea
              className="form-textarea"
              placeholder="e.g. Order #8821 dispatched to customer, or Damaged during transit"
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
              variant="danger"
              loading={submitting}
              disabled={isInsufficient}
            >
              <FiCheckCircle /> Confirm Stock Out
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockOut;
