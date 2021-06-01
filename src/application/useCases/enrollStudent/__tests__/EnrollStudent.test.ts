import EnrollStudent from '../EnrollStudent';
import { StudentsRepository } from '@app/infrastructure/repositories/inMemory/StudentsRepository';
import { ModulesRepository } from '@app/infrastructure/repositories/inMemory/ModulesRepository';
import { ClassesRepository } from '@app/infrastructure/repositories/inMemory/ClassesRepository';
import { InvalidNameError } from '@app/domain/valueObjects/Name';
import { InvalidCpfError } from '@app/domain/valueObjects/Cpf';
import { ValidationError } from '../Errors';
import { yearsAgo } from '@app/utils/DateUtils';
import { EnrollmentsRepository } from '@app/infrastructure/repositories/inMemory/EnrollmentsRepository';

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

  const factoryEnrollStudent = ({
    studentsRepository,
    modulesRepository,
    classesRepository,
    enrollmentsRepository
  }: {
    studentsRepository?: StudentsRepository,
    modulesRepository?: ModulesRepository,
    classesRepository?: ClassesRepository,
    enrollmentsRepository?: EnrollmentsRepository
  } = {}): EnrollStudent => {
    studentsRepository = studentsRepository || new StudentsRepository();
    modulesRepository = modulesRepository || new ModulesRepository();
    classesRepository = classesRepository || new ClassesRepository();
    enrollmentsRepository = enrollmentsRepository || new EnrollmentsRepository();

    classesRepository.save({
      level: validEnrollmentRequest.level,
      module: validEnrollmentRequest.module,
      code: validEnrollmentRequest.class,
      capacity: 1
    });

    return new EnrollStudent(studentsRepository, modulesRepository, classesRepository, enrollmentsRepository);
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
    const enrollStudent = factoryEnrollStudent();
    enrollStudent.execute(validEnrollmentRequest);

    expect(() => {
      enrollStudent.execute(validEnrollmentRequest);
    }).toThrowError(new ValidationError('Enrollment with duplicated student is not allowed'));
  });

  test('Should save student on repository', () => {
    const enrollmentRequest = validEnrollmentRequest;
    const studentsRepository = new StudentsRepository();

    expect(studentsRepository.count()).toBe(0);

    factoryEnrollStudent({ studentsRepository }).execute(enrollmentRequest);

    expect(studentsRepository.count()).toBe(1);
  });

  test('Should generate enrollment code', () => {
    const currentYear = new Date().getFullYear();
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

    expect(factoryEnrollStudent().execute(enrollmentRequest)).toEqual(`${currentYear}EM1A0001`);
  });

  test('Should not enroll student below minimum age', () => {
    const modulesRepository = new ModulesRepository();
    const moduleCode = '1';
    const nineYearsAgoDate = yearsAgo(9);

    const enrollmentRequest = Object.assign({}, validEnrollmentRequest, {
      student: {
        ...validEnrollmentRequest.student,
        birthDate: nineYearsAgoDate
      },
      module: moduleCode
    });

    modulesRepository.save({
      level: 'EF1',
      code: moduleCode,
      description: '1o Ano',
      minimumAge: 15,
      price: 1500
    });

    expect(() => {
      factoryEnrollStudent({ modulesRepository }).execute(enrollmentRequest);
    }).toThrowError(new ValidationError('Student below minimum age'));
  });

  test('Should not enroll student over class capacity', () => {
    const classesRepository = new ClassesRepository();
    const classCode = 'A';
    const enrollStudent = factoryEnrollStudent({ classesRepository });

    classesRepository.save({
      level: 'EM',
      module: '3',
      code: classCode,
      capacity: 1
    });

    const enrollmentRequestFirstStudent = Object.assign({}, validEnrollmentRequest, {
      student: {
        ...validEnrollmentRequest.student,
        class: classCode
      }
    });

    enrollStudent.execute(enrollmentRequestFirstStudent);

    const enrollmentRequestSecondStudent = Object.assign({}, enrollmentRequestFirstStudent, {
      student: {
        ...validEnrollmentRequest.student,
        cpf: '01234567890',
        class: classCode
      }
    });

    expect(() => {
      enrollStudent.execute(enrollmentRequestSecondStudent);
    }).toThrowError(new ValidationError('Class is over capacity'));
  });
});
