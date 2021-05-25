import EnrollStudent from '../EnrollStudent';
import { ValidationError } from '../Errors';
import { StudentsRepository } from '../../../../infrastructure/repositories/inMemory/StudentsRepository';
import Student from '../../../../domain/entities/Student';

describe('EnrollStudent', () => {
  const factoryStudent = (name = 'Ana Silva', cpf = '01234567890'): Student => {
    return new Student(name, cpf);
  };

  const factoryEnrollStudent = (studentsRepository = new StudentsRepository()): EnrollStudent => {
    return new EnrollStudent(studentsRepository);
  };

  test('Should not enroll without valid student name', () => {
    const enrollmentRequest = {
      student: {
        name: 'Ana',
        cpf: ''
      }
    };

    expect(() => {
      factoryEnrollStudent().execute(enrollmentRequest);
    }).toThrow(new ValidationError('Invalid student name'));
  });

  test('Should not enroll without valid student cpf', () => {
    const enrollmentRequest = {
      student: {
        name: 'Ana Silva',
        cpf: '123.456.789-99'
      }
    };

    expect(() => {
      factoryEnrollStudent().execute(enrollmentRequest);
    }).toThrow(new ValidationError('Invalid cpf'));
  });

  test('Should not enroll duplicated student', () => {
    const student = factoryStudent();
    const studentsRepository = new StudentsRepository();
    studentsRepository.save(student);

    const enrollmentRequest = {
      student: {
        name: student.name,
        cpf: student.cpf.value
      }
    };

    expect(() => {
      factoryEnrollStudent(studentsRepository).execute(enrollmentRequest);
    }).toThrow(new ValidationError('Enrollment with duplicated student is not allowed'));
  });
});
