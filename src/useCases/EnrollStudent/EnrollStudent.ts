import { ValidationError } from './Errors';
import { EnrollmentRequest } from './Interfaces';
import isCpfValid from '../../utils/IsCpfValid';
import Repository from '../../repositories/Repository';
import Student from '../../entities/Student';

export default class EnrollStudent {
  constructor(private studentRepository: Repository) {}

  execute(enrollmentRequest: EnrollmentRequest) {
    const {student: { name, cpf }} = enrollmentRequest;
    const student = { name, cpf }

    this.validateName(name);
    this.validateCpf(cpf);

    this.validateExistingStudent(student);
  }

  private validateName(name: string) {
    const regex = /^([A-Za-z]+ )+([A-Za-z])+$/;

    if (!regex.test(name)) {
      throw new ValidationError("Invalid student name");
    }
  }

  private validateCpf(cpf: string) {
    if(!isCpfValid(cpf)) {
      throw new ValidationError("Invalid student cpf");
    }
  }

  private validateExistingStudent(student: Student) {
    if(this.studentRepository.find(student)) {
      throw new ValidationError("Enrollment with duplicated student is not allowed");
    }
  }
}
