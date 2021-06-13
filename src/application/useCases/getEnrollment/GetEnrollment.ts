import { IEnrollmentsRepository } from '@app/domain/repositoriesInterfaces';
import { IGetEnrollmentRequest, IGetEnrollmentResponse } from './Interfaces';

export default class GetEnrollment {
  private enrollmentsRepository: IEnrollmentsRepository;

  constructor({ enrollmentsRepository }: { enrollmentsRepository: IEnrollmentsRepository }) {
    this.enrollmentsRepository = enrollmentsRepository;
  }

  execute(enrollmentRequest: IGetEnrollmentRequest): IGetEnrollmentResponse {
    const enrollment = this.enrollmentsRepository.findByCode(enrollmentRequest.code);
    const invoicesBalance = enrollment.invoicesBalance();

    return {
      code: enrollment.code.value,
      invoicesBalance: invoicesBalance
    };
  }
}
