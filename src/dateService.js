
export const getDate = (date) => {
  const dateObj = new Date(date);

  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'  
  });

  return formatter.format(dateObj);
}