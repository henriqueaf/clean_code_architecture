import { IEnrollmentsRepository } from '@app/domain/repositoriesInterfaces';
import { GetEnrollmentInputData, GetEnrollmentOutputData } from './DTOs';

export default class GetEnrollment {
  private enrollmentsRepository: IEnrollmentsRepository;

  constructor({ enrollmentsRepository }: { enrollmentsRepository: IEnrollmentsRepository }) {
    this.enrollmentsRepository = enrollmentsRepository;
  }

  execute(getEnrollmentInputData: GetEnrollmentInputData): GetEnrollmentOutputData {
    const enrollment = this.enrollmentsRepository.findByCode(getEnrollmentInputData.code);
    const invoicesBalance = enrollment.invoicesBalance();
    const outputData: GetEnrollmentOutputData = {
      code: enrollment.code.value,
      invoicesBalance: invoicesBalance,
      status: enrollment.status.value,
      invoices: []
    };
    for(const invoice of enrollment.invoices) {
      outputData.invoices.push({
        amount: invoice.amount,
        status: invoice.getStatus(getEnrollmentInputData.currentDate),
        dueDate: invoice.dueDate,
        penalty: invoice.getPenalty(getEnrollmentInputData.currentDate),
        interest: invoice.getInterets(getEnrollmentInputData.currentDate),
        balance: invoice.getBalance()
      });
    }

    return outputData;
  }
}
