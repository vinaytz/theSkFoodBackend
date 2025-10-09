export const formatPrice = (price: number): string => {
  return `₹${price}`;
};

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTime = (date: string | Date): string => {
  return `${formatDate(date)} at ${formatTime(date)}`;
};

export const formatOrderStatus = (status: string): string => {
  switch (status) {
    case 'Confirmed':
      return 'Order Confirmed';
    case 'on-the-way':
      return 'On the Way';
    case 'delivered':
      return 'Delivered';
    default:
      return status;
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};