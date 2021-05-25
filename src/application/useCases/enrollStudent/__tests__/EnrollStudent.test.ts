import EnrollStudent from '../EnrollStudent';
import { StudentsRepository } from '../../../../infrastructure/repositories/inMemory/StudentsRepository';
import Student from '../../../../domain/entities/Student';
import { InvalidNameError } from '../../../../domain/valueObjects/Name';
import { InvalidCpfError } from '../../../../domain/valueObjects/Cpf';
import { ValidationError } from '../Errors';

describe('EnrollStudent', () => {
  const validEnrollmentRequest = {
    student: {
      name: 'Ana Maria',
      cpf: '755.525.774-26',
      birthDate: '2002-03-12'
    },
    level: 'EM',
    module: '1',
    class: 'A'
  };

  const factoryStudent = (
    name = validEnrollmentRequest.student.name,
    cpf = validEnrollmentRequest.student.cpf,
    birthDate = validEnrollmentRequest.student.birthDate
  ): Student => {
    return new Student(name, cpf, birthDate);
  };

  const factoryEnrollStudent = (studentsRepository = new StudentsRepository()): EnrollStudent => {
    return new EnrollStudent(studentsRepository);
  };

  test('Should not enroll without valid student name', () => {
    const enrollmentRequest = Object.assign({}, validEnrollmentRequest, {
      student: {
        ...validEnrollmentRequest.student,
        name: 'Ana'
      }
    });

    expect(() => {
      factoryEnrollStudent().execute(enrollmentRequest);
    }).toThrowError(InvalidNameError);
  });

  test('Should not enroll without valid student cpf', () => {
    const enrollmentRequest = Object.assign({}, validEnrollmentRequest, {
      student: {
        ...validEnrollmentRequest.student,
        cpf: '123.456.789-99'
      }
    });

    expect(() => {
      factoryEnrollStudent().execute(enrollmentRequest);
    }).toThrowError(InvalidCpfError);
  });

  test('Should not enroll duplicated student', () => {
    const student = factoryStudent();
    const studentsRepository = new StudentsRepository();
    studentsRepository.save(student);

    const enrollmentRequest = Object.assign({}, validEnrollmentRequest, {
      student: {
        ...validEnrollmentRequest.student,
        name: student.name.value,
        cpf: student.cpf.value
      }
    });

    expect(() => {
      factoryEnrollStudent(studentsRepository).execute(enrollmentRequest);
    }).toThrowError(new ValidationError('Enrollment with duplicated student is not allowed'));
  });

  test('Should save student on repository', () => {
    const enrollmentRequest = validEnrollmentRequest;
    const studentsRepository = new StudentsRepository();

    expect(studentsRepository.count()).toBe(0);

    factoryEnrollStudent(studentsRepository).execute(enrollmentRequest);

    expect(studentsRepository.count()).toBe(1);
  });

  test('Should generate enrollment code', () => {
    const enrollmentRequest = {
      student: {
        name: 'Maria Carolina Fonseca',
        cpf: '755.525.774-26',
        birthDate: '2002-03-12'
      },
      level: 'EM',
      module: '1',
      class: 'A'
    };

    expect(factoryEnrollStudent().execute(enrollmentRequest)).toEqual('2021EM1A0001');
  });

  test('Should not enroll student below minimum age', () => {
    const studentsRepository = new StudentsRepository();
    const currentDateString = new Date().toISOString().slice(0,10);

    const enrollmentRequest = Object.assign({}, validEnrollmentRequest, {
      student: {
        ...validEnrollmentRequest.student,
        birthDate: currentDateString
      }
    });

    expect(() => {
      factoryEnrollStudent(studentsRepository).execute(enrollmentRequest);
    }).toThrowError(new ValidationError('Student below minimum age'));
    expect(studentsRepository.count()).toBe(0);
  });
});
