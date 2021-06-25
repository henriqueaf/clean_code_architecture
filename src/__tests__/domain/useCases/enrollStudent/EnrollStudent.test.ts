import {
  ClassesRepository,
  EnrollmentsRepository,
  ModulesRepository,
  StudentsRepository
} from '@app/infrastructure/repositories/inMemory';
import { InvalidNameError } from '@app/domain/valueObjects/Name';
import { InvalidCpfError } from '@app/domain/valueObjects/Cpf';
import { ValidationError } from '@app/domain/useCases/enrollStudent/Errors';
import { addDays, subDays, yearsAgo } from '@app/utils/DateUtils';
import Class from '@app/domain/entities/Class';
import { factoryEnrollStudent, validEnrollmentRequest } from '@app/__tests__/domain/useCases/Factories';

describe('EnrollStudent', () => {
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

    classesRepository.save(new Class({
      level: 'EM',
      module: '3',
      code: classCode,
      capacity: 1,
      startDate: new Date().toISOString(),
      endDate: addDays(new Date(), 10).toISOString()
    }));

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

    classesRepository.save(new Class({
      level: enrollmentRequest.level,
      module: enrollmentRequest.module,
      code: enrollmentRequest.class,
      capacity: 10,
      startDate: oneYearAgo.toISOString(),
      endDate: onYearAgoPlusTenDays.toISOString()
    }));

    expect(() => {
      factoryEnrollStudent({ classesRepository }).execute(enrollmentRequest);
    }).toThrowError(new Error('Class is already finished'));
  });

  test('Should not enroll after 25% of the start of the class', () => {
    const classesRepository = new ClassesRepository();
    const currentDate = new Date();
    const thirtyDaysAgo = subDays(currentDate, 26);
    const hundredDaysAfter = addDays(thirtyDaysAgo, 100);

    const enrollmentRequest = validEnrollmentRequest;

    classesRepository.save(new Class({
      level: enrollmentRequest.level,
      module: enrollmentRequest.module,
      code: enrollmentRequest.class,
      capacity: 10,
      startDate: thirtyDaysAgo.toISOString(),
      endDate: hundredDaysAfter.toISOString()
    }));

    expect(() => {
      factoryEnrollStudent({ classesRepository }).execute(enrollmentRequest);
    }).toThrowError(new Error('Class is already started'));
  });

  test('Should generate the invoices based on the number of installments, rounding each amount and applying the rest in the last invoice', () => {
    const modulesRepository = new ModulesRepository();
    const enrollmentsRepository = new EnrollmentsRepository();
    const price = 1503.67;
    const installmentsNumber = 13;

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

    const enrollmentCode = factoryEnrollStudent({ modulesRepository, enrollmentsRepository }).execute(enrollmentRequest);
    const { invoices } = enrollmentsRepository.findByCode(enrollmentCode);

    const expectedInvoicesAmount = 115.66;
    const expectedLastInvoiceAmount = 115.75;

    expect(invoices.length).toBe(installmentsNumber);
    expect(invoices[0].amount).toEqual(expectedInvoicesAmount);
    expect(invoices[invoices.length - 1].amount).toEqual(expectedLastInvoiceAmount);
    expect(price.toFixed(2)).toEqual(
      invoices.reduce(
        (total, invoice) => {
          total += invoice.amount;
          return total;
        },
        0
      ).toFixed(2)
    );
  });
});
