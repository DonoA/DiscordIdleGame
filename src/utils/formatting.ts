export const formatNumber = (num: number): string => {
  num = Math.floor(num);
  if (num < 1000) return num.toFixed(0);
  const suffixes = ["", "k", "M", "B", "T"];
  const i = Math.floor(Math.log10(num) / 3);
  const shortValue = (num / Math.pow(1000, i)).toFixed(1);
  return shortValue + suffixes[i];
};