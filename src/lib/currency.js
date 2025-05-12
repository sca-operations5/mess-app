
export function formatCurrency(amount) {
  if (typeof amount !== 'number') {
    return '₹ --';
  }
  return amount.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
  