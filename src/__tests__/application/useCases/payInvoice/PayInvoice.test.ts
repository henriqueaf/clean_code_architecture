import { PayInvoiceInputData } from '@app/application/useCases/payInvoice/DTOs';
import { EnrollmentsRepository } from '@app/infrastructure/repositories/inMemory';
import { factoryEnrollStudent, factoryPayInvoice, validEnrollmentRequest } from '../Factories';

describe('PayInvoice', () => {
  test('Should pay enrollment invoice', () => {
    const enrollmentsRepository = new EnrollmentsRepository();
    const enrollmentRequest = Object.assign({}, validEnrollmentRequest, {
      installments: 2
    });
    const enrollmentCode = factoryEnrollStudent({ enrollmentsRepository }).execute(enrollmentRequest);
    const enrollment = enrollmentsRepository.findByCode(enrollmentCode);
    const firstInvoice = enrollment.invoices[0];

    expect(enrollment.invoicesBalance()).not.toEqual(0);

    factoryPayInvoice({ enrollmentsRepository }).execute({
      code: firstInvoice.enrollment,
      month: firstInvoice.month,
      year: firstInvoice.year,
      amount: firstInvoice.amount
    } as PayInvoiceInputData);

    expect(enrollment.invoicesBalance()).toEqual(enrollment.module.price - firstInvoice.amount);
  });
});
