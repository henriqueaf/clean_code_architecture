import Student from '../entities/Student';

export interface IStudentsRepository {
  findByCpf(cpf: string): Student | undefined;
  allByClassCode(classCode: string): Student[];
  save(student: Student): boolean;
  count(): number;
}
