import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiDownload, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getProducts, deleteProduct } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency, getStockStatus, exportToPDF, exportToExcel } from '../../utils/helpers';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import SearchBar from '../../components/common/SearchBar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';

/**
 * Products list page with search, filter, sort, pagination, export
 */
const Products = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProducts({
        search,
        category: categoryFilter,
        status: statusFilter,
        sort,
        page,
        limit: 10,
      });
      setProducts(res.data.data.products || []);
      setTotalPages(res.data.data.pages || 1);
      setTotal(res.data.data.total || 0);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, statusFilter, sort, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data.data || []))
      .catch(() => {});
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, statusFilter, sort]);

  const handleDelete = async () => {
    try {
      await deleteProduct(deleteId);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleExportPDF = () => {
    const cols = [
      { header: 'Product Name', dataKey: 'productName' },
      { header: 'SKU', dataKey: 'SKU' },
      { header: 'Category', dataKey: 'categoryName' },
      { header: 'Stock', dataKey: 'quantity' },
      { header: 'Price', dataKey: 'sellingPrice' },
    ];
    const data = products.map((p) => ({
      productName: p.productName,
      SKU: p.SKU,
      categoryName: p.category?.categoryName || 'N/A',
      quantity: p.quantity,
      sellingPrice: formatCurrency(p.sellingPrice),
    }));
    exportToPDF(cols, data, 'Products List');
  };

  const handleExportExcel = () => {
    const data = products.map((p) => ({
      'Product Name': p.productName,
      SKU: p.SKU,
      Category: p.category?.categoryName || 'N/A',
      Supplier: p.supplier?.supplierName || 'N/A',
      'Purchase Price': p.purchasePrice,
      'Selling Price': p.sellingPrice,
      Stock: p.quantity,
      Unit: p.unit,
    }));
    exportToExcel(data, 'Products_List');
  };

  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (row) =>
        row.image ? (
          <img src={row.image} alt={row.productName} className="table-img" />
        ) : (
          <div className="table-img-placeholder">📦</div>
        ),
    },
    {
      key: 'productName',
      label: 'Product Name',
      render: (row) => (
        <div>
          <p style={{ fontWeight: 600 }}>{row.productName}</p>
          <p className="text-muted text-xs">{row.SKU}</p>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (row) => row.category?.categoryName || '—',
    },
    {
      key: 'quantity',
      label: 'Stock',
      render: (row) => {
        const status = getStockStatus(row.quantity);
        return (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Badge variant={status.color}>{row.quantity} {row.unit || ''}</Badge>
          </span>
        );
      },
    },
    {
      key: 'sellingPrice',
      label: 'Selling Price',
      render: (row) => <span style={{ fontWeight: 600 }}>{formatCurrency(row.sellingPrice)}</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="table-actions">
          <Link to={`/products/${row._id}`}>
            <button className="btn-icon view" title="View details"><FiEye /></button>
          </Link>
          {user?.role === 'admin' && (
            <>
              <Link to={`/products/edit/${row._id}`}>
                <button className="btn-icon edit" title="Edit product"><FiEdit2 /></button>
              </Link>
              <button
                className="btn-icon delete"
                onClick={() => setDeleteId(row._id)}
                title="Delete product"
              >
                <FiTrash2 />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">{total} products found</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <FiDownload /> PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel}>
            <FiDownload /> Excel
          </Button>
          {user?.role === 'admin' && (
            <Link to="/products/add">
              <Button variant="primary" size="sm">
                <FiPlus /> Add Product
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Card with filters + table */}
      <div className="card">
        {/* Toolbar */}
        <div className="toolbar">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name, SKU..."
          />
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '140px' }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
            ))}
          </select>
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '130px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="in">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '130px' }}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price_desc">Price High→Low</option>
            <option value="price_asc">Price Low→High</option>
            <option value="stock_desc">Stock High→Low</option>
            <option value="stock_asc">Stock Low→High</option>
          </select>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          data={products}
          loading={loading}
          emptyMessage="No products found. Try adjusting your filters."
        />

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? All related inventory transactions will remain but the product will be removed."
        confirmText="Delete Product"
      />
    </div>
  );
};

export default Products;
