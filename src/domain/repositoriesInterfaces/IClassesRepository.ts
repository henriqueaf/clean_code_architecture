import Class from '../entities/Class';

export interface IClassesRepository {
  findByCode(code: string): Class | undefined;
  findByLevelModuleCode(level: string, module: string, code: string): Class | undefined;
  save(klass: Class): boolean;
  count(): number;
}
