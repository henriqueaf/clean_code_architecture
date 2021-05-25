import { ValidationError } from './Errors';
import { IEnrollmentRequest } from './Interfaces';
import { IStudentsRepository } from '../../../domain/repositoriesInterfaces/IStudentsRepository';
import Student from '../../../domain/entities/Student';

export default class EnrollStudent {
  constructor(private studentRepository: IStudentsRepository) {}

  execute(enrollmentRequest: IEnrollmentRequest): void {
    const {
      student: {
        name, cpf
      }
    } = enrollmentRequest;

    const student = new Student(name, cpf);
    this.validateExistingStudent(student);
  }

  private validateExistingStudent(student: Student) {
    if(this.studentRepository.findByCpf(student.cpf.value)) {
      throw new ValidationError('Enrollment with duplicated student is not allowed');
    }
  }
}
