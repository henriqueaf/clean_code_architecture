const DAY_IN_MILLISECONDS = 24*60*60*1000;

export const dateDiffInYears = (biggerDate: Date, smallDate: Date): number => {
  const ageDifMs = biggerDate.getTime() - smallDate.getTime();
  const ageDate = new Date(ageDifMs);

  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export const yearsAgo = (value: number): Date => {
  const currentDate = new Date();

  return new Date(currentDate.getFullYear() - value, currentDate.getMonth(), currentDate.getDay() - 1);
};

export const addDays = (date: Date, days: number): Date => {
  return new Date(date.getTime() + days * DAY_IN_MILLISECONDS);
};

export const subDays = (date: Date, days: number): Date => {
  return new Date(date.getTime() - days * DAY_IN_MILLISECONDS);
};
