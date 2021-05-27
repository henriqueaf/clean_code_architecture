import EnrollStudent from '../EnrollStudent';
import { StudentsRepository } from '../../../../infrastructure/repositories/inMemory/StudentsRepository';
import { ModulesRepository } from '../../../../infrastructure/repositories/inMemory/ModulesRepository';
import { ClassesRepository } from '../../../../infrastructure/repositories/inMemory/ClassesRepository';
import { InvalidNameError } from '../../../../domain/valueObjects/Name';
import { InvalidCpfError } from '../../../../domain/valueObjects/Cpf';
import { ValidationError } from '../Errors';
import { yearsAgo } from '../../../../utils/DateUtils';

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
    classesRepository
  }: {
    studentsRepository?: StudentsRepository,
    modulesRepository?: ModulesRepository,
    classesRepository?: ClassesRepository
  } = {}): EnrollStudent => {
    studentsRepository = studentsRepository || new StudentsRepository();
    modulesRepository = modulesRepository || new ModulesRepository();
    classesRepository = classesRepository || new ClassesRepository();

    classesRepository.save({
      level: 'EM',
      module: '3',
      code: validEnrollmentRequest.class,
      capacity: 1
    });

    return new EnrollStudent(studentsRepository, modulesRepository, classesRepository);
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

    let enrollmentRequest = Object.assign({}, validEnrollmentRequest, {
      student: {
        ...validEnrollmentRequest.student,
        class: classCode
      }
    });

    enrollStudent.execute(enrollmentRequest);

    enrollmentRequest = Object.assign({}, enrollmentRequest, {
      student: {
        ...validEnrollmentRequest.student,
        cpf: '01234567890',
        class: classCode
      }
    });

    expect(() => {
      enrollStudent.execute(enrollmentRequest);
    }).toThrowError(new ValidationError('Class is over capacity'));
  });
});
