import { CancelEnrollmentInputData } from '@app/application/useCases/cancelEnrollment/DTOs';
import { EnrollmentsRepository } from '@app/infrastructure/repositories/inMemory';
import { factoryEnrollStudent, factoryCancelEnrollment, validEnrollmentRequest, factoryGetEnrollment } from '../Factories';

describe('CancelEnrollment', () => {
  test('Should pay enrollment invoice', () => {
    const enrollmentsRepository = new EnrollmentsRepository();
    const enrollmentCode = factoryEnrollStudent({ enrollmentsRepository }).execute(validEnrollmentRequest);

    factoryCancelEnrollment({ enrollmentsRepository }).execute({
      code: enrollmentCode
    } as CancelEnrollmentInputData);

    const getEnrollmentOutputDate = factoryGetEnrollment({ enrollmentsRepository }).execute({code: enrollmentCode, currentDate: new Date()});
    expect(getEnrollmentOutputDate.status).toEqual('cancelled');
  });
});
