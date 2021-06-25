import { CancelEnrollmentInputData } from '@app/domain/useCases/cancelEnrollment/DTOs';
import { EnrollmentsRepository } from '@app/adapters/repositories/memory';
import { factoryEnrollStudent, factoryCancelEnrollment, validEnrollmentRequest, factoryGetEnrollment } from '../Factories';

describe('CancelEnrollment', () => {
  test('Should cancel enrollment', async () => {
    const enrollmentsRepository = new EnrollmentsRepository();
    const enrollStudent = await factoryEnrollStudent({ enrollmentsRepository });
    const enrollmentCode = await enrollStudent.execute(validEnrollmentRequest);

    factoryCancelEnrollment({ enrollmentsRepository }).execute({
      code: enrollmentCode
    } as CancelEnrollmentInputData);

    const getEnrollmentOutputDate = factoryGetEnrollment({ enrollmentsRepository }).execute({code: enrollmentCode, currentDate: new Date()});
    expect(getEnrollmentOutputDate.status).toEqual('cancelled');
  });
});
