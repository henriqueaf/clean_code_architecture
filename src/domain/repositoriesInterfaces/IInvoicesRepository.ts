import Invoice from '../entities/Invoice';
import IRepository from './IRepository';

export interface IInvoicesRepository extends IRepository<Invoice> {
  saveAll(invoices: Invoice[]): void;
  first(): Invoice | undefined;
  last(): Invoice | undefined;
}
