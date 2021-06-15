import { GetEnrollmentOutputData } from '@app/application/useCases/getEnrollment/DTOs';
import { EnrollmentsRepository } from '@app/infrastructure/repositories/inMemory';
import { factoryEnrollStudent, validEnrollmentRequest, factoryGetEnrollment } from '@app/__tests__/application/useCases/Factories';

describe('GetEnrollment', () => {
  test('Should get enrollment by code with invoice balance', () => {
    const enrollmentsRepository = new EnrollmentsRepository();
    const enrollStudent = factoryEnrollStudent({ enrollmentsRepository });
    const enrollmentCode = enrollStudent.execute(validEnrollmentRequest);
    const enrollment = enrollmentsRepository.findByCode(enrollmentCode);

    const getEnrollmentResponse = factoryGetEnrollment({ enrollmentsRepository }).execute({ code: enrollmentCode });
    const invoicesBalance = enrollment.invoicesBalance();

    expect(getEnrollmentResponse).toEqual({
      code: enrollment.code.value,
      invoicesBalance: invoicesBalance
    } as GetEnrollmentOutputData);
  });
});
