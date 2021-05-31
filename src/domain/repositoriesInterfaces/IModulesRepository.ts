import Module from '../entities/Module';
import IRepository from './IRepository';

export interface IModulesRepository extends IRepository<Module> {
  findByCode(code: string): Module | undefined;
}
