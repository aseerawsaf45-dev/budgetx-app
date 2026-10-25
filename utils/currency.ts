export const CURRENCY_CODE = 'BDT';
export const CURRENCY_SYMBOL = '৳';
export const CURRENCY_NAME = 'Bangladeshi Taka (BDT)';

export const formatCurrency = (amount: number, showCode: boolean = false): string => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return showCode ? '৳0 BDT' : '৳0';
  }
  let result = '';
  try {
    result = new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('BDT', '৳').trim();
  } catch (e) {
    result = `৳${Math.round(amount).toLocaleString('en-BD')}`;
  }
  return showCode ? `${result} BDT` : result;
};
