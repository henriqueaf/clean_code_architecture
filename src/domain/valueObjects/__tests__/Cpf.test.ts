import Cpf, { InvalidCpfError } from '../Cpf';

describe('Cpf', () => {
  test('Should throw an error with an invalid Cpf', () => {
    const invalidCpf = '000.000.000-00';

    expect(() => new Cpf(invalidCpf)).toThrow(new InvalidCpfError());
  });

  test('Should assign value if a valid Cpf is provided', () => {
    const validCpf = '01234567890';
    const cpf = new Cpf(validCpf);

    expect(cpf.value).toEqual('01234567890');
  });

  test('Should assign value without non digits characters', () => {
    const validCpf = '012.345.678-90';
    const cpf = new Cpf(validCpf);

    expect(cpf.value).toEqual('01234567890');
  });
});
