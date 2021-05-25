import Student from '../entities/Student';

export interface IStudentsRepository {
  findByCpf(cpf: string): Student | undefined;
  save(student: Student): void;
}
