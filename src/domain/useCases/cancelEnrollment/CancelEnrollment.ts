import { IEnrollmentsRepository } from '@app/domain/repositories';
import { CancelEnrollmentInputData } from './DTOs';

export default class CancelEnrollment {
  private enrollmentsRepository: IEnrollmentsRepository;

  constructor({ enrollmentsRepository }: { enrollmentsRepository: IEnrollmentsRepository }) {
    this.enrollmentsRepository = enrollmentsRepository;
  }

  execute(cancelEnrollmentInputData: CancelEnrollmentInputData): void {
    const enrollment = this.enrollmentsRepository.findByCode(cancelEnrollmentInputData.code);
    enrollment.cancel();
    this.enrollmentsRepository.update(enrollment);
  }
}
