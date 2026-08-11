import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import Modal from './Modal';
import Button from './Button';

/**
 * Confirm dialog before destructive actions
 * @param {boolean} isOpen
 * @param {function} onClose
 * @param {function} onConfirm
 * @param {string} title
 * @param {string} message
 * @param {string} confirmText
 * @param {string} confirmVariant
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Delete',
  confirmVariant = 'danger',
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '50%',
          backgroundColor: 'var(--danger-light)', color: 'var(--danger)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, fontSize: '1.25rem'
        }}>
          <FiAlertTriangle />
        </div>
        <p className="text-muted text-sm" style={{ paddingTop: '0.625rem', lineHeight: '1.6' }}>
          {message}
        </p>
      </div>
      <div className="modal-footer" style={{ padding: 0, borderTop: 'none' }}>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant={confirmVariant} onClick={handleConfirm}>{confirmText}</Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
