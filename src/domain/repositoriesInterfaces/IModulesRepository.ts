import Module from '../entities/Module';
import Repository from './Repository';

export interface IModulesRepository extends Repository<Module> {
  findByCode(code: string): Module | undefined;
}
