import React, { useState, useEffect, useCallback } from 'react';
import { FiDownload, FiPlusCircle, FiMinusCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getTransactions } from '../../services/inventoryService';
import { formatDate, exportToPDF, exportToExcel } from '../../utils/helpers';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';

/**
 * Inventory Transaction History page
 * Filter by Stock In/Stock Out, search product, PDF & Excel exports
 */
const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTransactions({
        type: typeFilter,
        search,
        page,
        limit: 10,
      });
      setTransactions(res.data.data.transactions || []);
      setTotalPages(res.data.data.pages || 1);
      setTotal(res.data.data.total || 0);
    } catch {
      toast.error('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  }, [typeFilter, search, page]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    setPage(1);
  }, [typeFilter, search]);

  const handleExportPDF = () => {
    const cols = [
      { header: 'Date', dataKey: 'createdAt' },
      { header: 'Product', dataKey: 'productName' },
      { header: 'Type', dataKey: 'type' },
      { header: 'Quantity', dataKey: 'quantity' },
      { header: 'User', dataKey: 'userName' },
      { header: 'Remarks', dataKey: 'remarks' },
    ];
    const data = transactions.map((t) => ({
      createdAt: formatDate(t.createdAt),
      productName: t.product?.productName || 'N/A',
      type: t.type,
      quantity: t.quantity,
      userName: t.user?.name || 'N/A',
      remarks: t.remarks || '—',
    }));
    exportToPDF(cols, data, 'Inventory Transactions History');
  };

  const handleExportExcel = () => {
    const data = transactions.map((t) => ({
      Date: formatDate(t.createdAt),
      Product: t.product?.productName || 'N/A',
      SKU: t.product?.SKU || 'N/A',
      Type: t.type,
      Quantity: t.quantity,
      User: t.user?.name || 'N/A',
      Remarks: t.remarks || '—',
    }));
    exportToExcel(data, 'Inventory_Transactions');
  };

  const columns = [
    {
      key: 'createdAt',
      label: 'Date & Time',
      render: (row) => (
        <span className="text-muted text-sm">{formatDate(row.createdAt)}</span>
      ),
    },
    {
      key: 'product',
      label: 'Product',
      render: (row) => (
        <div>
          <p style={{ fontWeight: 600 }}>{row.product?.productName || 'Deleted Product'}</p>
          <p className="text-muted text-xs">SKU: {row.product?.SKU || '—'}</p>
        </div>
      ),
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
        <span
          style={{
            fontWeight: 700,
            color: row.type === 'Stock In' ? 'var(--success)' : 'var(--danger)',
          }}
        >
          {row.type === 'Stock In' ? `+${row.quantity}` : `-${row.quantity}`}
        </span>
      ),
    },
    {
      key: 'user',
      label: 'User',
      render: (row) => row.user?.name || '—',
    },
    {
      key: 'remarks',
      label: 'Remarks',
      render: (row) => <span className="text-muted text-sm">{row.remarks || '—'}</span>,
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Transaction History</h1>
          <p className="page-subtitle">{total} inventory transactions logged</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <FiDownload /> PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel}>
            <FiDownload /> Excel
          </Button>
        </div>
      </div>

      <div className="card">
        {/* Toolbar */}
        <div className="toolbar">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by product name..."
          />
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '150px' }}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Stock In">Stock In (+)</option>
            <option value="Stock Out">Stock Out (-)</option>
          </select>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          data={transactions}
          loading={loading}
          emptyMessage="No transaction history found."
        />

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default Transactions;
