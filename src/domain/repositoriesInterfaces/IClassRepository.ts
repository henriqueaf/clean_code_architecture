import Class from '../entities/Class';

export interface IClassRepository {
  findByCode(code: string): Class | undefined;
  save(klass: Class): boolean;
  count(): number;
}
