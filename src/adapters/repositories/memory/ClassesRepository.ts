import Class from '@app/domain/entities/Class';
import { IClassesRepository } from '@app/domain/repositories';
import InMemoryRepository from './InMemoryRepository';

export class ClassesRepository extends InMemoryRepository<Class> implements IClassesRepository {
  protected data: Class[] = [];

  findByCode(code: string): Class {
    const klass = this.data.find(klass => {
      return code === klass.code;
    });
    if(!klass) throw new Error('Class not found!');
    return klass;
  }

  findByLevelModuleCode(level: string, module: string, code: string): Class {
    const klass = this.data.find(klass => {
      return level === klass.level && module === klass.module && code === klass.code;
    });
    if(!klass) throw new Error('Class not found!');
    return klass;
  }
}
