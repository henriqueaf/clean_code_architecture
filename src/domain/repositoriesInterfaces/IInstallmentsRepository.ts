import Installment from '../entities/Installment';
import IRepository from './IRepository';

export interface IInstallmentsRepository extends IRepository<Installment> {
  saveAll(installments: Installment[]): void;
  first(): Installment | undefined;
  last(): Installment | undefined;
}
