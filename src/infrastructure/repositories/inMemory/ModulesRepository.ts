import Module from '../../../domain/entities/Module';
import { IModulesRepository } from '../../../domain/repositoriesInterfaces';
import InMemoryRepository from './InMemoryRepository';

export class ModulesRepository extends InMemoryRepository<Module> implements IModulesRepository {
  protected data: Module[] = [];

  findByCode(code: string): Module | undefined {
    return this.data.find(module => {
      return code === module.code;
    });
  }
}
