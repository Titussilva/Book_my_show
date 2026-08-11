import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiEdit2, FiPlusCircle, FiMinusCircle, FiClock } from 'react-icons/fi';
import { getProductById } from '../../services/productService';
import { getTransactions } from '../../services/inventoryService';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency, getStockStatus, formatDate } from '../../utils/helpers';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import Table from '../../components/common/Table';

/**
 * Product Detail page
 * Shows product specs, images, stock status, pricing, and specific transaction history
 */
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [prodRes, txRes] = await Promise.all([
          getProductById(id),
          getTransactions({ product: id, limit: 10 }),
        ]);
        setProduct(prodRes.data.data);
        setTransactions(txRes.data.data.transactions || []);
      } catch (err) {
        toast.error('Failed to load product details');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, navigate]);

  if (loading) return <Spinner message="Loading product details..." />;
  if (!product) return null;

  const stockStatus = getStockStatus(product.quantity);

  const txColumns = [
    {
      key: 'createdAt',
      label: 'Date',
      render: (row) => <span className="text-muted text-sm">{formatDate(row.createdAt)}</span>,
    },
    {
      key: 'type',
      label: 'Type',
      render: (row) => (
        <Badge variant={row.type === 'Stock In' ? 'success' : 'danger'}>
          {row.type === 'Stock In' ? <FiPlusCircle /> : <FiMinusCircle />} {row.type}
        </Badge>
      ),
    },
    {
      key: 'quantity',
      label: 'Quantity',
      render: (row) => (
        <span style={{ fontWeight: 700, color: row.type === 'Stock In' ? 'var(--success)' : 'var(--danger)' }}>
          {row.type === 'Stock In' ? `+${row.quantity}` : `-${row.quantity}`}
        </span>
      ),
    },
    {
      key: 'user',
      label: 'Recorded By',
      render: (row) => row.user?.name || '—',
    },
    {
      key: 'remarks',
      label: 'Remarks',
      render: (row) => <span className="text-muted text-sm">{row.remarks || '—'}</span>,
    },
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/products')}>
            <FiArrowLeft /> Back
          </Button>
          <div>
            <h1 className="page-title">{product.productName}</h1>
            <p className="page-subtitle">SKU: {product.SKU}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link to="/inventory/stock-in">
            <Button variant="success" size="sm">
              <FiPlusCircle /> Stock In
            </Button>
          </Link>
          <Link to="/inventory/stock-out">
            <Button variant="danger" size="sm">
              <FiMinusCircle /> Stock Out
            </Button>
          </Link>
          {user?.role === 'admin' && (
            <Link to={`/products/edit/${product._id}`}>
              <Button variant="primary" size="sm">
                <FiEdit2 /> Edit Product
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Main product specs grid */}
      <div className="two-col-grid" style={{ marginBottom: '1.5rem' }}>
        {/* Left: Image Card */}
        <div className="card flex items-center justify-center" style={{ minHeight: '280px' }}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.productName}
              style={{
                maxHeight: '260px',
                borderRadius: 'var(--radius)',
                objectFit: 'contain',
              }}
            />
          ) : (
            <div className="text-center text-muted" style={{ padding: '3rem' }}>
              <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '0.5rem' }}>📦</span>
              <p>No image available</p>
            </div>
          )}
        </div>

        {/* Right: Info Card */}
        <div className="card flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
              <Badge variant={stockStatus.color}>
                {product.quantity} {product.unit || 'pcs'} — {stockStatus.label}
              </Badge>
              <span className="text-muted text-xs">
                Created: {formatDate(product.createdAt)}
              </span>
            </div>

            <div className="divider" style={{ margin: '0.75rem 0' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1rem 0' }}>
              <div>
                <p className="stat-label">Category</p>
                <p style={{ fontWeight: 600 }}>{product.category?.categoryName || 'Uncategorized'}</p>
              </div>

              <div>
                <p className="stat-label">Supplier</p>
                <p style={{ fontWeight: 600 }}>{product.supplier?.supplierName || 'Not specified'}</p>
              </div>

              <div>
                <p className="stat-label">Purchase Price</p>
                <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {formatCurrency(product.purchasePrice)}
                </p>
              </div>

              <div>
                <p className="stat-label">Selling Price</p>
                <p style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--accent-primary)' }}>
                  {formatCurrency(product.sellingPrice)}
                </p>
              </div>
            </div>

            <div className="divider" style={{ margin: '0.75rem 0' }} />

            <div>
              <p className="stat-label">Description</p>
              <p className="text-sm text-muted" style={{ marginTop: '0.25rem' }}>
                {product.description || 'No description provided.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History for this Product */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title flex items-center gap-2">
            <FiClock /> Recent Transactions
          </h3>
        </div>

        <Table
          columns={txColumns}
          data={transactions}
          emptyMessage="No stock transactions recorded for this product yet."
        />
      </div>
    </div>
  );
};

export default ProductDetail;
