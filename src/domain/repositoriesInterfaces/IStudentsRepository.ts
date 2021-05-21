import IStudent from '../entities/IStudent';

export interface IStudentsRepository {
  findByCpf(cpf: string): IStudent | undefined;
  save(student: IStudent): void;
}
