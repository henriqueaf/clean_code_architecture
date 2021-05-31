import Student from '../entities/Student';
import IRepository from './IRepository';

export interface IStudentsRepository extends IRepository<Student> {
  findByCpf(cpf: string): Student | undefined;
  allByClassCode(classCode: string): Student[];
}
