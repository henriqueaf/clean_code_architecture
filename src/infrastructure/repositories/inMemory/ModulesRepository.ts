import Module from '@app/domain/entities/Module';
import { IModulesRepository } from '@app/domain/repositoriesInterfaces';
import InMemoryRepository from './InMemoryRepository';

export class ModulesRepository extends InMemoryRepository<Module> implements IModulesRepository {
  protected data: Module[] = [];

  findByCode(code: string): Module {
    const module = this.data.find(module => {
      return code === module.code;
    });
    if(!module) throw new Error('Module not found!');
    return module;
  }
}
