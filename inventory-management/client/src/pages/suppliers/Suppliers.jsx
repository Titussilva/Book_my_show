import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { toast } from 'react-toastify';
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from '../../services/supplierService';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';

/**
 * Suppliers management page — Admin only
 * Full CRUD operations with modal form
 */
const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    supplierName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await getSuppliers();
      setSuppliers(res.data.data || []);
    } catch {
      toast.error('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const openAddModal = () => {
    setEditItem(null);
    setFormData({ supplierName: '', email: '', phone: '', address: '' });
    setErrors({});
    setModalOpen(true);
  };

  const openEditModal = (sup) => {
    setEditItem(sup);
    setFormData({
      supplierName: sup.supplierName || '',
      email: sup.email || '',
      phone: sup.phone || '',
      address: sup.address || '',
    });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!formData.supplierName.trim()) errs.supplierName = 'Supplier name is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email address';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setFormLoading(true);
    try {
      if (editItem) {
        await updateSupplier(editItem._id, formData);
        toast.success('Supplier updated successfully');
      } else {
        await createSupplier(formData);
        toast.success('Supplier added successfully');
      }
      setModalOpen(false);
      fetchSuppliers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSupplier(deleteId);
      toast.success('Supplier deleted');
      fetchSuppliers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete supplier');
    }
  };

  const columns = [
    {
      key: 'supplierName',
      label: 'Supplier Name',
      render: (row) => <span style={{ fontWeight: 600 }}>{row.supplierName}</span>,
    },
    {
      key: 'email',
      label: 'Email',
      render: (row) =>
        row.email ? (
          <span className="flex items-center gap-1 text-sm">
            <FiMail className="text-muted" /> {row.email}
          </span>
        ) : (
          '—'
        ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (row) =>
        row.phone ? (
          <span className="flex items-center gap-1 text-sm">
            <FiPhone className="text-muted" /> {row.phone}
          </span>
        ) : (
          '—'
        ),
    },
    {
      key: 'address',
      label: 'Address',
      render: (row) =>
        row.address ? (
          <span className="flex items-center gap-1 text-sm text-muted">
            <FiMapPin /> {row.address}
          </span>
        ) : (
          '—'
        ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="table-actions">
          <button className="btn-icon edit" onClick={() => openEditModal(row)} title="Edit">
            <FiEdit2 />
          </button>
          <button className="btn-icon delete" onClick={() => setDeleteId(row._id)} title="Delete">
            <FiTrash2 />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Suppliers</h1>
          <p className="page-subtitle">{suppliers.length} active suppliers</p>
        </div>
        <Button variant="primary" onClick={openAddModal}>
          <FiPlus /> Add Supplier
        </Button>
      </div>

      <div className="card">
        <Table
          columns={columns}
          data={suppliers}
          loading={loading}
          emptyMessage="No suppliers found. Click Add Supplier to create one."
        />
      </div>

      {/* Add / Edit Supplier Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? 'Edit Supplier' : 'Add Supplier'}
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Supplier Name <span className="required">*</span>
            </label>
            <input
              className={`form-input ${errors.supplierName ? 'error' : ''}`}
              placeholder="e.g. Global Tech Distributors"
              value={formData.supplierName}
              onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
            />
            {errors.supplierName && <p className="form-error">{errors.supplierName}</p>}
          </div>

          <div className="two-col-grid" style={{ marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="supplier@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Phone Number</label>
              <input
                className="form-input"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea
              className="form-textarea"
              placeholder="Street address, city, state, postal code..."
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="modal-footer" style={{ padding: 0, borderTop: 'none', marginTop: '0.5rem' }}>
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={formLoading}>
              {editItem ? 'Update' : 'Save'} Supplier
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Supplier"
        message="Are you sure you want to delete this supplier? Products associated with this supplier will remain intact."
        confirmText="Delete Supplier"
      />
    </div>
  );
};

export default Suppliers;
