import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../services/categoryService';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';

/**
 * Categories management page — Admin only
 * Full CRUD via modals
 */
const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({ categoryName: '', description: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setCategories(res.data.data || []);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAddModal = () => {
    setEditItem(null);
    setFormData({ categoryName: '', description: '' });
    setErrors({});
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditItem(cat);
    setFormData({ categoryName: cat.categoryName, description: cat.description || '' });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!formData.categoryName.trim()) errs.categoryName = 'Category name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setFormLoading(true);
    try {
      if (editItem) {
        await updateCategory(editItem._id, formData);
        toast.success('Category updated successfully');
      } else {
        await createCategory(formData);
        toast.success('Category created successfully');
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCategory(deleteId);
      toast.success('Category deleted');
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const columns = [
    { key: 'categoryName', label: 'Category Name', render: (row) => (
      <span style={{ fontWeight: 600 }}>{row.categoryName}</span>
    )},
    { key: 'description', label: 'Description', render: (row) => (
      <span className="text-muted">{row.description || '—'}</span>
    )},
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
          <h1 className="page-title">Categories</h1>
          <p className="page-subtitle">{categories.length} categories</p>
        </div>
        <Button variant="primary" onClick={openAddModal}>
          <FiPlus /> Add Category
        </Button>
      </div>

      <div className="card">
        <Table
          columns={columns}
          data={categories}
          loading={loading}
          emptyMessage="No categories found. Create one to get started."
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? 'Edit Category' : 'Add Category'}
        size="sm"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Category Name <span className="required">*</span>
            </label>
            <input
              className={`form-input ${errors.categoryName ? 'error' : ''}`}
              placeholder="e.g. Electronics"
              value={formData.categoryName}
              onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
            />
            {errors.categoryName && <p className="form-error">{errors.categoryName}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              placeholder="Optional description..."
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="modal-footer" style={{ padding: 0, borderTop: 'none', marginTop: '0.5rem' }}>
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={formLoading}>
              {editItem ? 'Update' : 'Create'} Category
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? Products linked to it will lose their category assignment."
        confirmText="Delete Category"
      />
    </div>
  );
};

export default Categories;
