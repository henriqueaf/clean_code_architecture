import Enrollment from '@app/domain/entities/Enrollment';
import { IEnrollmentsRepository } from '@app/domain/repositoriesInterfaces/IEnrollmentsRepository';
import InMemoryRepository from './InMemoryRepository';

export class EnrollmentsRepository extends InMemoryRepository<Enrollment> implements IEnrollmentsRepository {
  protected data: Enrollment[] = [];

  allByLevelModuleClass(level: string, module: string, classCode: string): Enrollment[] {
    return this.data.filter(enrollment => {
      return level === enrollment.level.code && module === enrollment.module.code && classCode === enrollment.klass.code;
    });
  }

  findByCpf(cpf: string): Enrollment | undefined {
    const nonDigitsRegex = /\D/g;

    return this.data.find(enrollment => {
      return cpf.replace(nonDigitsRegex, '') === enrollment.student.cpf.value.replace(nonDigitsRegex, '');
    });
  }
}
