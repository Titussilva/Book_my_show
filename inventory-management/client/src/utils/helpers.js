import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const getStockStatus = (qty) => {
  if (qty <= 0) return { label: 'Out of Stock', color: 'danger' };
  if (qty < 10) return { label: 'Low Stock', color: 'warning' };
  return { label: 'In Stock', color: 'success' };
};

export const truncateText = (text, length = 30) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

export const exportToPDF = (columns, data, title = 'Export') => {
  const doc = new jsPDF();
  doc.text(title, 14, 15);
  doc.autoTable({
    head: [columns.map(c => c.header)],
    body: data.map(row => columns.map(c => row[c.key])),
    startY: 20,
  });
  doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
};

export const exportToExcel = (data, filename = 'export') => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, `${filename}.xlsx`);
};
