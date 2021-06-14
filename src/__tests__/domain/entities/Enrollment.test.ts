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
      startDate: oneYearAgo.toISOString().slice(0,10),
      endDate: onYearAgoPlusTenDays.toISOString().slice(0,10)
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
});
