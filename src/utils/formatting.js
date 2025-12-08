export const formatNumber = (num) => {
  if (num < 1000) return num;
  const suffixes = ["", "k", "M", "B", "T"];
  const i = Math.floor(Math.log10(num) / 3);
  const shortValue = (num / Math.pow(1000, i)).toFixed(1);
  return shortValue + suffixes[i];
};