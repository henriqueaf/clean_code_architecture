import Installment from '@app/domain/entities/Installment';
import { IInstallmentsRepository } from '@app/domain/repositoriesInterfaces/IInstallmentsRepository';
import InMemoryRepository from './InMemoryRepository';

export class InstallmentsRepository extends InMemoryRepository<Installment> implements IInstallmentsRepository {
  protected data: Installment[] = [];

  saveAll(installments: Installment[]): void {
    for(const installment of installments) {
      this.data.push(installment);
    }
  }

  first(): Installment | undefined {
    return this.data[0];
  }

  last(): Installment | undefined {
    return this.data[this.data.length - 1];
  }
}
