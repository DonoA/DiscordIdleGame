export const getUniqueName = (baseName: string, existingNames: string[]): string => {
  if (!existingNames.includes(baseName)) {
    return baseName;
  }
  let i = 2;
  while (existingNames.includes(`${baseName}-${i}`)) {
    i++;
  }
  return `${baseName}-${i}`;
};