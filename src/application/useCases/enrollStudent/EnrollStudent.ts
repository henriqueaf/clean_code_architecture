import { ValidationError } from './Errors';
import { IEnrollmentRequest } from './Interfaces';
import { IStudentsRepository, IModuleRepository } from '../../../domain/repositoriesInterfaces';
import Student from '../../../domain/entities/Student';

export const SEQUENCE_MAX_DIGITS = 4;

export default class EnrollStudent {
  constructor(private studentRepository: IStudentsRepository) {}

  execute(enrollmentRequest: IEnrollmentRequest): string {
    const {
      student: {
        name, cpf, birthDate
      }
    } = enrollmentRequest;

    const student = new Student(name, cpf, birthDate);
    this.validateExistingStudent(student);
    this.validateStudentMinimumAge(student);

    this.studentRepository.save(student);
    return this.generateEnrollmentCode(enrollmentRequest);
  }

  private validateExistingStudent(student: Student) {
    if(this.studentRepository.findByCpf(student.cpf.value)) {
      throw new ValidationError('Enrollment with duplicated student is not allowed');
    }
  }

  private validateStudentMinimumAge(student: Student) {
    if(student.age() < 18) {
      throw new ValidationError('Student below minimum age');
    }
  }

  private generateEnrollmentCode(enrollmentRequest: IEnrollmentRequest): string {
    const currentYear = new Date().getFullYear();
    const sequence = this.studentRepository.count().toString().padStart(SEQUENCE_MAX_DIGITS, '0');

    return `${currentYear}${enrollmentRequest.level}${enrollmentRequest.module}${enrollmentRequest.class}${sequence}`;
  }
}
