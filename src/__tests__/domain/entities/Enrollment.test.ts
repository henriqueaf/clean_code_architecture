import Invoice from '@app/domain/entities/Invoice';
import { addDays, yearsAgo } from '@app/utils/DateUtils';
import { factoryClass, factoryEnrollment, factoryModule, factoryStudent, validClassAttributes, validEnrollmentAttributes, validModuleAttributes, validStudentAttributes } from '@app/__tests__/application/useCases/Factories';

describe('Enrollment', () => {
  test('Should throw Error when student is below minimum age', () => {
    const nineYearsAgoDate = yearsAgo(9);

    const moduleAttributes = Object.assign({}, validModuleAttributes, {
      minimumAge: 10
    });

    const module = factoryModule(moduleAttributes);

    const studentAttributes = Object.assign({}, validStudentAttributes, {
      birthDate: nineYearsAgoDate
    });
    const student = factoryStudent(studentAttributes);

    const enrollmentAttributes = Object.assign({}, validEnrollmentAttributes, {
      student,
      module
    });

    expect(() => {
      factoryEnrollment(enrollmentAttributes);
    }).toThrowError(new Error('Student below minimum age'));
  });

  test('Should throw Error when Class is already finished', () => {
    const oneYearAgo = yearsAgo(1);
    const onYearAgoPlusTenDays = addDays(oneYearAgo, 10);

    const classAttributes = Object.assign({}, validClassAttributes, {
      startDate: oneYearAgo.toISOString(),
      endDate: onYearAgoPlusTenDays.toISOString()
    });

    const klass = factoryClass(classAttributes);

    const enrollmentAttributes = Object.assign({}, validEnrollmentAttributes, {
      klass,
      issueDate: new Date()
    });

    expect(() => {
      factoryEnrollment(enrollmentAttributes);
    }).toThrowError(new Error('Class is already finished'));
  });

  test('Should generate invoices when attributes are valid', () => {
    const totalAmount = 1500;
    const installments = 2;
    const currentDate = new Date();

    const moduleAttributes = Object.assign({}, validModuleAttributes, {
      price: totalAmount
    });

    const module = factoryModule(moduleAttributes);

    const enrollmentAttributes = Object.assign({}, validEnrollmentAttributes, {
      module,
      installments,
      issueDate: currentDate
    });

    const enrollment = factoryEnrollment(enrollmentAttributes);

    expect(enrollment.invoices.length).toBe(installments);
    expect(enrollment.invoices).toEqual([
      new Invoice({
        enrollment: enrollment.code.value,
        month: 1,
        year: currentDate.getFullYear(),
        amount: 750
      }),
      new Invoice({
        enrollment: enrollment.code.value,
        month: 2,
        year: currentDate.getFullYear(),
        amount: 750
      })
    ]);
  });

  describe('invoicesBalance' , () => {
    test('Should return the sum of invoices', () => {
      const totalAmount = 1500;

      const moduleAttributes = Object.assign({}, validModuleAttributes, {
        price: totalAmount
      });

      const module = factoryModule(moduleAttributes);

      const enrollmentAttributes = Object.assign({}, validEnrollmentAttributes, {
        module
      });

      expect(factoryEnrollment(enrollmentAttributes).invoicesBalance()).toEqual(totalAmount);
    });
  });
});
