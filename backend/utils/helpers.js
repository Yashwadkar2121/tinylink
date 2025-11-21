export const formatDate = (dateString) => {
  if (!dateString) return "Never";
  return new Date(dateString).toLocaleString();
};
