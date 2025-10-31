// Currency formatter function
export const formatCurrency = (value: number | string): string => {
  if (!value || value === 0) return "";

  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numValue)) return "";

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue);
};

// Parse currency string back to number
export const parseCurrency = (value: string): number => {
  if (!value) return 0;

  // Remove currency symbol, spaces, and dots, replace comma with dot
  const cleanValue = value
    .replace(/[^\d,]/g, "") // Keep only digits and commas
    .replace(/\./g, "") // Remove dots
    .replace(",", "."); // Replace comma with dot for decimal

  const numValue = parseFloat(cleanValue);
  return isNaN(numValue) ? 0 : numValue;
};

// Validate if a key code is allowed for currency input
export const isAllowedKeyCode = (keyCode: number, ctrlKey: boolean): boolean => {
  // Allow: backspace, delete, tab, escape, enter, comma, dot
  if ([8, 9, 27, 13, 46, 110, 190, 188].indexOf(keyCode) !== -1) {
    return true;
  }

  // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
  if (
    (keyCode === 65 && ctrlKey) || // Ctrl+A
    (keyCode === 67 && ctrlKey) || // Ctrl+C
    (keyCode === 86 && ctrlKey) || // Ctrl+V
    (keyCode === 88 && ctrlKey)    // Ctrl+X
  ) {
    return true;
  }

  // Allow numbers
  if (
    (keyCode >= 48 && keyCode <= 57) || // 0-9
    (keyCode >= 96 && keyCode <= 105)   // Numpad 0-9
  ) {
    return true;
  }

  return false;
}; 