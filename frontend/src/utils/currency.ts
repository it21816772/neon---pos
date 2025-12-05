export const formatCurrency = (valueInCents: number, locale = 'en-US', currency = 'USD') =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format((valueInCents ?? 0) / 100);

