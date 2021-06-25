import Class from '../entities/Class';
import IRepository from './IRepository';

export interface IClassesRepository extends IRepository<Class> {
  findByCode(code: string): Class;
  findByLevelModuleCode(level: string, module: string, code: string): Class;
}
