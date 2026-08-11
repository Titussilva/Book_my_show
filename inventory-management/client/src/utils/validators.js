export const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email) ? null : 'Invalid email address';
};

export const validatePassword = (password) => {
  return password.length >= 6 ? null : 'Password must be at least 6 characters';
};

export const validateRequired = (value, fieldName = 'Field') => {
  return value && String(value).trim() !== '' ? null : `${fieldName} is required`;
};

export const validateSKU = (sku) => {
  return sku.length >= 3 ? null : 'SKU must be at least 3 characters';
};

export const validatePrice = (price) => {
  return !isNaN(price) && Number(price) >= 0 ? null : 'Price must be a positive number';
};

export const validateQuantity = (qty) => {
  return !isNaN(qty) && Number(qty) >= 0 && Number.isInteger(Number(qty)) 
    ? null : 'Quantity must be a positive integer';
};
