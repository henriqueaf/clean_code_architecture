import { ValidationError } from './Errors';
import { IEnrollmentRequest } from './Interfaces';
import {
  IStudentsRepository,
  IModulesRepository,
  IClassesRepository,
  IEnrollmentsRepository,
  ILevelsRepository
} from '@app/domain/repositoriesInterfaces';
import Student from '@app/domain/entities/Student';
import Enrollment from '@app/domain/entities/Enrollment';
import Class from '@app/domain/entities/Class';

export default class EnrollStudent {
  constructor(
    private studentsRepository: IStudentsRepository,
    private levelsRepository: ILevelsRepository,
    private modulesRepository: IModulesRepository,
    private classesRepository: IClassesRepository,
    private enrollmentsRepository: IEnrollmentsRepository
  ) {}

  execute(enrollmentRequest: IEnrollmentRequest): string {
    const studentParams = enrollmentRequest.student;
    const student = new Student(studentParams.name, studentParams.cpf, studentParams.birthDate);
    const level = this.levelsRepository.findByCode(enrollmentRequest.level);
    const module = this.modulesRepository.findByCode(enrollmentRequest.module);
    const klass = this.classesRepository.findByLevelModuleCode(level.code, module.code, enrollmentRequest.class);
    const studentsEnrolledInClass = this.enrollmentsRepository.allByLevelModuleClass(klass.level, klass.module, klass.code).length;

    this.validateExistingEnrollment(student);
    this.validateClassMaximumCapacity(klass, studentsEnrolledInClass);

    const sequence = studentsEnrolledInClass + 1;
    const enrollment = new Enrollment({
      student,
      level,
      module,
      klass,
      issueDate: new Date(),
      sequence,
      installments: enrollmentRequest.installments
    });

    this.studentsRepository.save(student);
    this.enrollmentsRepository.save(enrollment);

    return enrollment.code.value;
  }

  private validateExistingEnrollment(student: Student): void {
    if(this.enrollmentsRepository.findByCpf(student.cpf.value)) {
      throw new ValidationError('Enrollment with duplicated student is not allowed');
    }
  }

  private validateClassMaximumCapacity(klass: Class, studentsEnrolledInClass: number): void {
    if(studentsEnrolledInClass >= klass.capacity) {
      throw new ValidationError('Class is over capacity');
    }
  }
}
