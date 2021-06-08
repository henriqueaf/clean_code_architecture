import EnrollStudent from '../EnrollStudent';
import {
  ClassesRepository,
  EnrollmentsRepository,
  InstallmentsRepository,
  LevelsRepository,
  ModulesRepository,
  StudentsRepository
} from '@app/infrastructure/repositories/inMemory';
import { InvalidNameError } from '@app/domain/valueObjects/Name';
import { InvalidCpfError } from '@app/domain/valueObjects/Cpf';
import { ValidationError } from '../Errors';
import { addDays, subDays, yearsAgo } from '@app/utils/DateUtils';
import { ILevelsRepository } from '@app/domain/repositoriesInterfaces';

describe('EnrollStudent', () => {
  const validEnrollmentRequest = {
    student: {
      name: 'Ana Maria',
      cpf: '755.525.774-26',
      birthDate: '2002-03-12'
    },
    level: 'EM',
    module: '1',
    class: 'A',
    installments: 12
  };

  const factoryEnrollStudent = ({
    studentsRepository,
    levelsRepository,
    modulesRepository,
    classesRepository,
    enrollmentsRepository,
    installmentsRepository
  }: {
    studentsRepository?: StudentsRepository,
    levelsRepository?: ILevelsRepository,
    modulesRepository?: ModulesRepository,
    classesRepository?: ClassesRepository,
    enrollmentsRepository?: EnrollmentsRepository,
    installmentsRepository?: InstallmentsRepository
  } = {}): EnrollStudent => {
    studentsRepository = studentsRepository || new StudentsRepository();
    levelsRepository = levelsRepository || new LevelsRepository(),
    modulesRepository = modulesRepository || new ModulesRepository();
    classesRepository = classesRepository || new ClassesRepository();
    enrollmentsRepository = enrollmentsRepository || new EnrollmentsRepository();
    installmentsRepository = installmentsRepository || new InstallmentsRepository();

    levelsRepository.save({
      code: validEnrollmentRequest.level,
      description: 'Ensino Médio'
    });

    modulesRepository.save({
      level: validEnrollmentRequest.level,
      code: validEnrollmentRequest.module,
      description: '1º Ano',
      minimumAge: 15,
      price: 17000
    });

    classesRepository.save({
      level: validEnrollmentRequest.level,
      module: validEnrollmentRequest.module,
      code: validEnrollmentRequest.class,
      capacity: 1,
      startDate: new Date(),
      endDate: addDays(new Date(), 10)
    });

    return new EnrollStudent(
      studentsRepository,
      levelsRepository,
      modulesRepository,
      classesRepository,
      enrollmentsRepository,
      installmentsRepository
    );
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
    const enrollmentRequest = Object.assign({}, validEnrollmentRequest, {
      level: 'EM',
      module: '1',
      class: 'A'
    });

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
    }).toThrowError(new Error('Student below minimum age'));
  });

  test('Should not enroll student over class capacity', () => {
    const classesRepository = new ClassesRepository();
    const classCode = 'A';
    const enrollStudent = factoryEnrollStudent({ classesRepository });

    classesRepository.save({
      level: 'EM',
      module: '3',
      code: classCode,
      capacity: 1,
      startDate: new Date(),
      endDate: addDays(new Date(), 10)
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

  test('Should not enroll after end of the class', () => {
    const classesRepository = new ClassesRepository();
    const oneYearAgo = yearsAgo(1);
    const onYearAgoPlusTenDays = addDays(oneYearAgo, 10);

    const enrollmentRequest = validEnrollmentRequest;

    classesRepository.save({
      level: enrollmentRequest.level,
      module: enrollmentRequest.module,
      code: enrollmentRequest.class,
      capacity: 10,
      startDate: oneYearAgo,
      endDate: onYearAgoPlusTenDays
    });

    expect(() => {
      factoryEnrollStudent({ classesRepository }).execute(enrollmentRequest);
    }).toThrowError(new ValidationError('Class is already finished'));
  });

  test('Should not enroll after 25% of the start of the class', () => {
    const classesRepository = new ClassesRepository();
    const currentDate = new Date();
    const thirtyDaysAgo = subDays(currentDate, 26);
    const hundredDaysAfter = addDays(thirtyDaysAgo, 100);

    const enrollmentRequest = validEnrollmentRequest;

    classesRepository.save({
      level: enrollmentRequest.level,
      module: enrollmentRequest.module,
      code: enrollmentRequest.class,
      capacity: 10,
      startDate: thirtyDaysAgo,
      endDate: hundredDaysAfter
    });

    expect(() => {
      factoryEnrollStudent({ classesRepository }).execute(enrollmentRequest);
    }).toThrowError(new ValidationError('Class is already started'));
  });

  test('Should generate the invoices based on the number of installments, rounding each amount and applying the rest in the last invoice', () => {
    const modulesRepository = new ModulesRepository();
    const installmentsRepository = new InstallmentsRepository();
    const price = 1500;
    const installmentsNumber = 14;

    const enrollmentRequest = Object.assign({}, validEnrollmentRequest, {
      installments: installmentsNumber
    });

    modulesRepository.save({
      level: enrollmentRequest.level,
      minimumAge: 15,
      code: enrollmentRequest.module,
      description: '1º ano',
      price
    });

    factoryEnrollStudent({ modulesRepository, installmentsRepository }).execute(enrollmentRequest);

    const expectedInstallmentsValue = Math.trunc(price/installmentsNumber);
    const expectedLastInstallmentValue = expectedInstallmentsValue + price%installmentsNumber;

    expect(installmentsRepository.count()).toBe(installmentsNumber);
    expect(installmentsRepository.first()?.value).toEqual(expectedInstallmentsValue);
    expect(installmentsRepository.last()?.value).toEqual(expectedLastInstallmentValue);
  });
});
