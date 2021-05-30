import Class from '../entities/Class';
import Repository from './Repository';

export interface IClassesRepository extends Repository<Class> {
  findByCode(code: string): Class | undefined;
  findByLevelModuleCode(level: string, module: string, code: string): Class | undefined;
}
