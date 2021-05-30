import Student from '../entities/Student';
import Repository from './Repository';

export interface IStudentsRepository extends Repository<Student> {
  findByCpf(cpf: string): Student | undefined;
  allByClassCode(classCode: string): Student[];
}
