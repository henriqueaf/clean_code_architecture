import Class from '../Class';
import { InvalidClassStartdate, InvalidClassEndDate } from '../errors/ClassErrors';

describe('Class', () => {
  const validClassAttributes = {
    level: 'EM',
    module: '3',
    code: 'A',
    capacity: 10,
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString()
  };

  const factoryClass = ({level, module, code, capacity, startDate, endDate} = validClassAttributes): Class => {
    return new Class(level, module, code, capacity, startDate, endDate);
  };

  test('Should throw InvalidClassStartdate when an invalid startDate is provided', () => {
    const invalidAttributes = {
      ...validClassAttributes,
      startDate: 'invalid'
    };

    expect(() => factoryClass(invalidAttributes)).toThrow(InvalidClassStartdate);
  });

  test('Should throw InvalidClassEndDate when an invalid endDate is provided', () => {
    const invalidAttributes = {
      ...validClassAttributes,
      endDate: 'invalid'
    };

    expect(() => factoryClass(invalidAttributes)).toThrow(InvalidClassEndDate);
  });
});
