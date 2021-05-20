import Student from '../entities/Student';
import Repository from './Repository';

export class StudentsRepository extends Repository<Student> {
  data: Student[] = [];

  find(student: Student): Student | undefined {
    return this.data.find(studentOnDatabase => JSON.stringify(student) === JSON.stringify(studentOnDatabase));
  }

  push(student: Student): void {
    this.data.push(student);
  }
}
