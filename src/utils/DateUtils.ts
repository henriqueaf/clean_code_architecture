export const dateDiffInYears = (biggerDate: Date, smallDate: Date): number => {
  const ageDifMs = biggerDate.getTime() - smallDate.getTime();
  const ageDate = new Date(ageDifMs);

  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export const yearsAgo = (value: number): Date => {
  const currentDate = new Date();

  return new Date(currentDate.getFullYear() - value, currentDate.getMonth(), currentDate.getDay());
};
