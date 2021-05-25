import Student from '../../../domain/entities/Student';
import { IStudentsRepository } from '../../../domain/repositoriesInterfaces/IStudentsRepository';
import InMemoryRepository from './InMemoryRepository';

export class StudentsRepository extends InMemoryRepository<Student> implements IStudentsRepository {
  protected data: Student[] = [];

  findByCpf(cpf: string): Student | undefined {
    const nonDigitsRegex = /\D/g;

    return this.data.find(student => {
      return cpf.replace(nonDigitsRegex, '') === student.cpf.value.replace(nonDigitsRegex, '');
    });
  }

  save(student: Student): void {
    this.data.push(student);
  }
}
