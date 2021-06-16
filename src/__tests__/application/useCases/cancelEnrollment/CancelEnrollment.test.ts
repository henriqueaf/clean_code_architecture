import { CancelEnrollmentInputData } from '@app/application/useCases/cancelEnrollment/DTOs';
import { EnrollmentsRepository } from '@app/infrastructure/repositories/inMemory';
import { factoryEnrollStudent, factoryCancelEnrollment, validEnrollmentRequest } from '../Factories';

describe('CancelEnrollment', () => {
  test('Should pay enrollment invoice', () => {
    const enrollmentsRepository = new EnrollmentsRepository();
    const enrollmentCode = factoryEnrollStudent({ enrollmentsRepository }).execute(validEnrollmentRequest);
    const enrollment = enrollmentsRepository.findByCode(enrollmentCode);

    factoryCancelEnrollment({ enrollmentsRepository }).execute({
      code: enrollmentCode
    } as CancelEnrollmentInputData);

    expect(enrollment.status.value).toEqual('cancelled');
  });
});
