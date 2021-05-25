import { yearsAgo } from '../../../utils/DateUtils';
import Student from '../Student';

describe('Student', () => {
  const validStudentAttributes = {
    name: 'Ana Maria',
    cpf: '755.525.774-26',
    birthDate: '2002-03-12'
  };

  const factoryStudent = (params = validStudentAttributes): Student => {
    return new Student(params.name, params.cpf, params.birthDate);
  };

  describe('age()', () => {
    test('Should return Student age based on birthDate attribute', () => {
      const sevenYearsAgoDate = yearsAgo(7);
      const student = factoryStudent({
        ...validStudentAttributes,
        birthDate: sevenYearsAgoDate.toISOString()
      });

      expect(student.age()).toBe(7);
    });
  });
});
