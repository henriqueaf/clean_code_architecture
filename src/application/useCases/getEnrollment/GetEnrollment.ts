import { IEnrollmentsRepository } from '@app/domain/repositoriesInterfaces';
import { GetEnrollmentInputData, GetEnrollmentOutputData } from './DTOs';

export default class GetEnrollment {
  private enrollmentsRepository: IEnrollmentsRepository;

  constructor({ enrollmentsRepository }: { enrollmentsRepository: IEnrollmentsRepository }) {
    this.enrollmentsRepository = enrollmentsRepository;
  }

  execute(enrollmentRequest: GetEnrollmentInputData): GetEnrollmentOutputData {
    const enrollment = this.enrollmentsRepository.findByCode(enrollmentRequest.code);
    const invoicesBalance = enrollment.invoicesBalance();

    return {
      code: enrollment.code.value,
      invoicesBalance: invoicesBalance
    };
  }
}
