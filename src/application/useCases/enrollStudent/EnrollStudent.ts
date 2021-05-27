import { ValidationError } from './Errors';
import { IEnrollmentRequest } from './Interfaces';
import { IStudentsRepository, IModulesRepository, IClassesRepository } from '../../../domain/repositoriesInterfaces';
import Student from '../../../domain/entities/Student';

export const SEQUENCE_MAX_DIGITS = 4;

export default class EnrollStudent {
  constructor(
    private studentsRepository: IStudentsRepository,
    private modulesRepository: IModulesRepository,
    private classesRepository: IClassesRepository
  ) {}

  execute(enrollmentRequest: IEnrollmentRequest): string {
    const {
      student: {
        name,
        cpf,
        birthDate
      },
      module,
      class: classCode
    } = enrollmentRequest;

    const student = new Student(name, cpf, birthDate, classCode);
    this.validateExistingStudent(student);
    this.validateStudentMinimumAge(student, module);
    this.validateClassExist(classCode);
    this.validateClassMaximumCapacity(classCode);
    this.studentsRepository.save(student);

    return this.generateEnrollmentCode(enrollmentRequest);
  }

  private validateExistingStudent(student: Student) {
    if(this.studentsRepository.findByCpf(student.cpf.value)) {
      throw new ValidationError('Enrollment with duplicated student is not allowed');
    }
  }

  private validateStudentMinimumAge(student: Student, moduleCode: string) {
    const module = this.modulesRepository.findByCode(moduleCode);

    if(module && student.age() < module.minimumAge) {
      throw new ValidationError('Student below minimum age');
    }
  }

  private validateClassExist(classCode: string) {
    const klass = this.classesRepository.findByCode(classCode);

    if(!klass) {
      throw new ValidationError('Invalid Class code');
    }
  }

  private validateClassMaximumCapacity(classCode: string) {
    const klass = this.classesRepository.findByCode(classCode);
    const classStudentsCount = this.studentsRepository.allByClassCode(classCode).length;

    if(klass && classStudentsCount >= klass.capacity) {
      throw new ValidationError('Class is over capacity');
    }
  }

  private generateEnrollmentCode(enrollmentRequest: IEnrollmentRequest): string {
    const currentYear = new Date().getFullYear();
    const sequence = this.studentsRepository.count().toString().padStart(SEQUENCE_MAX_DIGITS, '0');

    return `${currentYear}${enrollmentRequest.level}${enrollmentRequest.module}${enrollmentRequest.class}${sequence}`;
  }
}
