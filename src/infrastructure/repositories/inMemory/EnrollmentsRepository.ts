import Enrollment from '@app/domain/entities/Enrollment';
import { IEnrollmentsRepository } from '@app/domain/repositoriesInterfaces/IEnrollmentsRepository';
import InMemoryRepository from './InMemoryRepository';

export class EnrollmentsRepository extends InMemoryRepository<Enrollment> implements IEnrollmentsRepository {
  protected data: Enrollment[] = [];

  allByLevelModuleClass(level: string, module: string, classCode: string): Enrollment[] {
    return this.data.filter(enrollment => {
      return level === enrollment.level && module === enrollment.module && classCode === enrollment.classCode;
    });
  }
}
