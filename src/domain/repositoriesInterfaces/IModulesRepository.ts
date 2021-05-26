import Module from '../entities/Module';

export interface IModulesRepository {
  findByCode(code: string): Module | undefined;
  save(module: Module): boolean;
  count(): number;
}
