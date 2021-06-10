import Invoice from '@app/domain/entities/Invoice';
import { IInvoicesRepository } from '@app/domain/repositoriesInterfaces/IInvoicesRepository';
import InMemoryRepository from './InMemoryRepository';

export class InvoicesRepository extends InMemoryRepository<Invoice> implements IInvoicesRepository {
  protected data: Invoice[] = [];

  saveAll(invoices: Invoice[]): void {
    for(const invoice of invoices) {
      this.data.push(invoice);
    }
  }

  first(): Invoice | undefined {
    return this.data[0];
  }

  last(): Invoice | undefined {
    return this.data[this.data.length - 1];
  }
}
