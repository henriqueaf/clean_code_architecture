import { IEnrollmentsRepository } from '@app/domain/repositoriesInterfaces';
import { PayInvoiceInputData } from './DTOs';

export default class PayInvoice {
  private enrollmentsRepository: IEnrollmentsRepository;

  constructor({ enrollmentsRepository }: { enrollmentsRepository: IEnrollmentsRepository }) {
    this.enrollmentsRepository = enrollmentsRepository;
  }

  execute({code, year, month, amount, paymentDate}: PayInvoiceInputData): void {
    const enrollment = this.enrollmentsRepository.findByCode(code);
    enrollment.payInvoice(month, year, amount, paymentDate);
  }
}
