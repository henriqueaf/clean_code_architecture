import IStudent from '../entities/IStudent';
import Repository from './Repository';

export class StudentsRepository extends Repository<IStudent> {
  protected data: IStudent[] = [];

  find(student: IStudent): IStudent | undefined {
    const nonDigitsRegex = /\D/g;

    return this.data.find(studentOnDatabase => {
      return student.cpf.replace(nonDigitsRegex, '') === studentOnDatabase.cpf.replace(nonDigitsRegex, '');
    });
  }

  save(student: IStudent): void {
    this.data.push(student);
  }
}
