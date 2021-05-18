import Student from "../../../entities/Student";
import Repository from "../../../repositories/Repository";

export class StudentsRepositoryMock extends Repository {
  constructor(private data: Student[] = []) {
    super(data);
  }

  find(student: Student): Student | undefined {
    return this.data.find(studentOnDatabase => JSON.stringify(student) === JSON.stringify(studentOnDatabase));
  }

  push(student: Student): void {
    this.data.push(student);
  }
}
