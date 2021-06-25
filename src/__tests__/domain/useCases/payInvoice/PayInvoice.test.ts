import { EnrollmentsRepository } from '@app/adapters/repositories/memory';
import { factoryEnrollStudent, factoryGetEnrollment, factoryPayInvoice, validEnrollmentRequest } from '../Factories';

describe('PayInvoice', () => {
  test('Should pay enrollment invoice', () => {
    const enrollmentsRepository = new EnrollmentsRepository();
    const enrollmentRequest = Object.assign({}, validEnrollmentRequest, {
      installments: 12
    });
    const enrollmentCode = factoryEnrollStudent({ enrollmentsRepository }).execute(enrollmentRequest);
    let getEnrollmentOutputData = factoryGetEnrollment({ enrollmentsRepository }).execute({ code: enrollmentCode, currentDate: new Date('2021-06-20')});
    const firstInvoice = getEnrollmentOutputData.invoices[0];

    expect(getEnrollmentOutputData.invoicesBalance).toEqual(17000);

    factoryPayInvoice({ enrollmentsRepository }).execute({
      code: enrollmentCode,
      month: firstInvoice.dueDate.getMonth() + 1,
      year: firstInvoice.dueDate.getFullYear(),
      amount: 1416.66,
      paymentDate: new Date('2021-06-20')
    });

    getEnrollmentOutputData = factoryGetEnrollment({ enrollmentsRepository }).execute({ code: enrollmentCode, currentDate: new Date('2021-06-20')});
    expect(getEnrollmentOutputData.invoicesBalance).toEqual(18296.25);
  });

  test('Should pay overdue invoice', () => {
    const enrollmentsRepository = new EnrollmentsRepository();
    const enrollmentRequest = Object.assign({}, validEnrollmentRequest, {
      installments: 12
    });
    const enrollmentCode = factoryEnrollStudent({ enrollmentsRepository }).execute(enrollmentRequest);
    const getEnrollmentOutputDataBefore = factoryGetEnrollment({ enrollmentsRepository }).execute({ code: enrollmentCode, currentDate: new Date('2021-06-20')});
    const firstInvoice = getEnrollmentOutputDataBefore.invoices[0];

    expect(getEnrollmentOutputDataBefore.invoicesBalance).not.toEqual(0);

    factoryPayInvoice({ enrollmentsRepository }).execute({
      code: enrollmentCode,
      month: firstInvoice.dueDate.getMonth() + 1,
      year: firstInvoice.dueDate.getFullYear(),
      amount: 4129.57,
      paymentDate: new Date('2021-06-20')
    });

    const getEnrollmentOutputDataAfter = factoryGetEnrollment({ enrollmentsRepository }).execute({ code: enrollmentCode, currentDate: new Date('2021-06-20')});
    expect(getEnrollmentOutputDataAfter.invoices[0].balance).toEqual(0);
  });
});
