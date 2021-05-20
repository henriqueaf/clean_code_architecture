import { ValidationError } from './Errors';
import { IEnrollmentRequest } from './Interfaces';
import isCpfValid from '../../utils/IsCpfValid';
import Repository from '../../repositories/Repository';
import Student from '../../entities/IStudent';

export default class EnrollStudent {
  constructor(private studentRepository: Repository<Student>) {}

  execute(enrollmentRequest: IEnrollmentRequest): void {
    const { student } = enrollmentRequest;

    this.validateName(student.name);
    this.validateCpf(student.cpf);
    this.validateExistingStudent(student);
  }

  private validateName(name: string) {
    const validNameRegex = /^([A-Za-z]+ )+([A-Za-z])+$/;

    if (!validNameRegex.test(name)) {
      throw new ValidationError('Invalid student name');
    }
  }

  private validateCpf(cpf: string) {
    if(!isCpfValid(cpf)) {
      throw new ValidationError('Invalid student cpf');
    }
  }

  private validateExistingStudent(student: Student) {
    if(this.studentRepository.find(student)) {
      throw new ValidationError('Enrollment with duplicated student is not allowed');
    }
  }
}
