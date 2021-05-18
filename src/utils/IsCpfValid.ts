const FACTOR_DIGIT_1 = 10;
const FACTOR_DIGIT_2 = 11;
const MAX_DIGITS_1 = 9;
const MAX_DIGITS_2 = 10;

export default (cpf: string = ''): boolean => {
  cpf = extractDigits(cpf);
  if (isInvalidLength(cpf)) return false;
  if (isBlocked(cpf)) return false;
  const digit1 = calculateDigit(cpf, FACTOR_DIGIT_1, MAX_DIGITS_1);
  const digit2 = calculateDigit(cpf, FACTOR_DIGIT_2, MAX_DIGITS_2);
  let calculatedCheckDigit = `${digit1}${digit2}`;
  return getCheckDigit(cpf) == calculatedCheckDigit;
}

const extractDigits = (cpf: string) => {
  return cpf.replace(/\D/g, "");
}

const isInvalidLength = (cpf: string) => {
  return cpf.length !== 11;
}

const isBlocked = (cpf: string) => {
  const [digit1] = cpf;
  return cpf.split("").every(digit => digit === digit1);
}

const calculateDigit = (cpf: string, factor: number, max: number) => {
  let total = 0;
  for (const digit of toDigitArray(cpf).slice(0, max)) {
    total += digit * factor--;
  }
  return (total%11 < 2) ? 0 : (11 - total%11);
}

const toDigitArray = (cpf: string) => {
  return [...cpf].map(digit => parseInt(digit));
}

const getCheckDigit = (cpf: string) => {
  return cpf.slice(9);
}
