import Module from '../entities/Module';

export interface IModuleRepository {
  findByCode(code: string): Module | undefined;
  save(module: Module): boolean;
  count(): number;
}
