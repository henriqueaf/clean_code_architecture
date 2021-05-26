import Class from '../../../domain/entities/Class';
import { IClassesRepository } from '../../../domain/repositoriesInterfaces';
import InMemoryRepository from './InMemoryRepository';

export class ClassesRepository extends InMemoryRepository<Class> implements IClassesRepository {
  protected data: Class[] = [];

  findByCode(code: string): Class | undefined {
    return this.data.find(klass => {
      return code === klass.code;
    });
  }
}
