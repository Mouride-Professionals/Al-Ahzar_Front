export function formatMoney(amount, options = {}) {
  return amount.toLocaleString('fr-FR', options);
}

export function formatPhoneNumber(phone) {
  
  switch (phone?.length) {
    case 9:
      return phone.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
    case 6:
      return phone.replace(/(\d{3})(\d{3})/, '$1 $2');
    default:
      return phone || 'N/A';
  }
}

export const messageFormatter = (message, args) => {
  args.map((arg) => {
    message = message.replace(arg.key, arg.value);
  });
  return message;
};

export const formatDate = (dateObj) => {
  var day = dateObj.date.padStart(2, '0');
  var month = dateObj.month.padStart(2, '0');
  var year = dateObj.year;

  return `${year}-${month}-${day}`;
};
