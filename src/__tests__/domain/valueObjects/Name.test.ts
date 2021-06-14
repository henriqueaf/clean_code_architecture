import Name, { InvalidNameError } from '@app/domain/valueObjects/Name';

describe('Name', () => {
  test('Should throw an error with an invalid Name', () => {
    const invalidname = 'Ana';

    expect(() => new Name(invalidname)).toThrowError(InvalidNameError);
  });

  test('Should assign value if a valid Name is provided', () => {
    const validName = 'Ana Silva';
    const cpf = new Name(validName);

    expect(cpf.value).toEqual(validName);
  });
});
