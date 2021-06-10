import { ValidationError } from './Errors';
import { IEnrollmentRequest } from './Interfaces';
import {
  IStudentsRepository,
  IModulesRepository,
  IClassesRepository,
  IEnrollmentsRepository,
  IInstallmentsRepository,
  ILevelsRepository
} from '@app/domain/repositoriesInterfaces';
import Student from '@app/domain/entities/Student';
import Enrollment from '@app/domain/entities/Enrollment';
import Installment from '@app/domain/entities/Installment';
import Class from '@app/domain/entities/Class';
import Module from '@app/domain/entities/Module';

export default class EnrollStudent {
  constructor(
    private studentsRepository: IStudentsRepository,
    private levelsRepository: ILevelsRepository,
    private modulesRepository: IModulesRepository,
    private classesRepository: IClassesRepository,
    private enrollmentsRepository: IEnrollmentsRepository,
    private installmentsRepository: IInstallmentsRepository
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
    const enrollment = new Enrollment(student, level, module, klass, new Date(), sequence, enrollmentRequest.installments);

    this.studentsRepository.save(student);
    this.enrollmentsRepository.save(enrollment);
    this.generateInstallments(enrollment, module);

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

  private generateInstallments(enrollment: Enrollment, module: Module): void {
    const installmentValue = Math.trunc(module.price / enrollment.installments);
    const installmentsRestValue = module.price % enrollment.installments;

    const installments = [];

    for(let i = 1; i <= enrollment.installments; i ++) {
      if(i === enrollment.installments){
        installments.push(new Installment(enrollment.code.value, installmentValue + installmentsRestValue));
      } else {
        installments.push(new Installment(enrollment.code.value, installmentValue));
      }
    }

    this.installmentsRepository.saveAll(installments);
  }
}
