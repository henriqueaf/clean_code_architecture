import IStudent from '../../../domain/entities/IStudent';
import { IStudentsRepository } from '../../../domain/repositoriesInterfaces/IStudentsRepository';
import InMemoryRepository from './InMemoryRepository';

export class StudentsRepository extends InMemoryRepository<IStudent> implements IStudentsRepository {
  protected data: IStudent[] = [];

  findByCpf(cpf: string): IStudent | undefined {
    const nonDigitsRegex = /\D/g;

    return this.data.find(student => {
      return cpf.replace(nonDigitsRegex, '') === student.cpf.replace(nonDigitsRegex, '');
    });
  }

  save(student: IStudent): void {
    this.data.push(student);
  }
}
