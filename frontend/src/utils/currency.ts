export const formatCurrency = (valueInCents: number, locale = 'en-LK', currency = 'LKR') =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format((valueInCents ?? 0) / 100);

