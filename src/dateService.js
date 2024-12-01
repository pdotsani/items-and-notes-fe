
export const getDate = (date) => {
  if (!date) return "";
  
  const dateObj = new Date(date);

  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'  
  });

  return formatter.format(dateObj);
}