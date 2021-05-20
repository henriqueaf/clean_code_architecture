import Student from '../entities/Student';
import Repository from './Repository';

export class StudentsRepository extends Repository<Student> {
  data: Student[] = [];

  find(student: Student): Student | undefined {
    const nonDigitsRegex = /\D/g;

    return this.data.find(studentOnDatabase => {
      return student.cpf.replace(nonDigitsRegex, '') === studentOnDatabase.cpf.replace(nonDigitsRegex, '');
    });
  }

  push(student: Student): void {
    this.data.push(student);
  }
}
