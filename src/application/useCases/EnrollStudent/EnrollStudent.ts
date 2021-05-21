import { ValidationError } from './Errors';
import { IEnrollmentRequest } from './Interfaces';
import isCpfValid from '../../../utils/IsCpfValid';
import { IStudentsRepository } from '../../../domain/repositoriesInterfaces/IStudentsRepository';

export default class EnrollStudent {
  constructor(private studentRepository: IStudentsRepository) {}

  execute(enrollmentRequest: IEnrollmentRequest): void {
    const { student } = enrollmentRequest;

    this.validateName(student.name);
    this.validateCpf(student.cpf);
    this.validateExistingStudent(student.cpf);
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

  private validateExistingStudent(cpf: string) {
    if(this.studentRepository.findByCpf(cpf)) {
      throw new ValidationError('Enrollment with duplicated student is not allowed');
    }
  }
}
