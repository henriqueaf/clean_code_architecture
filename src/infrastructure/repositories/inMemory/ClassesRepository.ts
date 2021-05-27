import Class from '@app/domain/entities/Class';
import { IClassesRepository } from '@app/domain/repositoriesInterfaces';
import InMemoryRepository from './InMemoryRepository';

export class ClassesRepository extends InMemoryRepository<Class> implements IClassesRepository {
  protected data: Class[] = [];

  findByCode(code: string): Class | undefined {
    return this.data.find(klass => {
      return code === klass.code;
    });
  }

  findByLevelModuleCode(level: string, module: string, code: string): Class | undefined {
    return this.data.find(klass => {
      return level === klass.level && module === klass.module && code === klass.code;
    });
  }
}
