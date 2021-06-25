import { GetEnrollmentOutputData } from '@app/domain/useCases/getEnrollment/DTOs';
import InvoiceStatus from '@app/domain/valueObjects/InvoiceStatus';
import { EnrollmentsRepository } from '@app/adapters/repositories/memory';
import { factoryEnrollStudent, validEnrollmentRequest, factoryGetEnrollment } from '@app/__tests__/domain/useCases/Factories';

describe('GetEnrollment', () => {
  test('Should get enrollment by code with invoice balance', () => {
    const enrollmentsRepository = new EnrollmentsRepository();
    const enrollStudent = factoryEnrollStudent({ enrollmentsRepository });
    const enrollmentCode = enrollStudent.execute(validEnrollmentRequest);
    const enrollment = enrollmentsRepository.findByCode(enrollmentCode);
    const currentDate = new Date();

    const getEnrollmentResponse = factoryGetEnrollment({ enrollmentsRepository }).execute({ code: enrollmentCode, currentDate: currentDate });
    const invoicesBalance = enrollment.invoicesBalance();

    expect(getEnrollmentResponse).toEqual({
      code: enrollment.code.value,
      invoicesBalance: invoicesBalance,
      status: enrollment.status.value,
      invoices: enrollment.invoices.map((invoice) => {
        return {
          amount: invoice.amount,
          status: invoice.getStatus(currentDate),
          dueDate: invoice.dueDate,
          interest: invoice.getInterets(currentDate),
          penalty: invoice.getPenalty(currentDate),
          balance: invoice.getBalance()
        };
      })
    } as GetEnrollmentOutputData);
  });

  test('Should calculate due date and return status open or overdue for each invoice', () => {
    const enrollmentsRepository = new EnrollmentsRepository();
    const enrollStudent = factoryEnrollStudent({ enrollmentsRepository });
    const enrollmentCode = enrollStudent.execute(validEnrollmentRequest);
    const getEnrollmentOutputDate = factoryGetEnrollment({ enrollmentsRepository }).execute({code: enrollmentCode, currentDate: new Date('2021-06-20')});

    expect(getEnrollmentOutputDate.invoices[0]?.dueDate.toISOString()).toEqual('2021-01-05T03:00:00.000Z');
    expect(getEnrollmentOutputDate.invoices[0]?.status).toBe(InvoiceStatus.Overdue);
    expect(getEnrollmentOutputDate.invoices[11]?.dueDate.toISOString()).toEqual('2021-12-05T03:00:00.000Z');
    expect(getEnrollmentOutputDate.invoices[11]?.status).toBe(InvoiceStatus.Open);
  });

  test('Should calculate penalty and interests', () => {
    const enrollmentsRepository = new EnrollmentsRepository();
    const enrollStudent = factoryEnrollStudent({ enrollmentsRepository });
    const enrollmentCode = enrollStudent.execute(validEnrollmentRequest);
    const getEnrollmentOutputDate = factoryGetEnrollment({ enrollmentsRepository }).execute({code: enrollmentCode, currentDate: new Date('2021-06-20')});

    expect(getEnrollmentOutputDate.invoices[0]?.penalty).toBe(141.67);
    expect(getEnrollmentOutputDate.invoices[0]?.interest).toBe(2337.49);
    expect(getEnrollmentOutputDate.invoices[11]?.penalty).toBe(0);
    expect(getEnrollmentOutputDate.invoices[11]?.interest).toBe(0);
  });
});
