import Enrollment from '../entities/Enrollment';
import IRepository from './IRepository';

export interface IEnrollmentsRepository extends IRepository<Enrollment> {
  allByLevelModuleClass(level: string, module: string, classCode: string): Enrollment[];
}