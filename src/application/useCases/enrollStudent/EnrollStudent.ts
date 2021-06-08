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

    this.validateExistingStudent(student);
    this.validateStudentMinimumAge(student, module.code);
    this.validateClassMaximumCapacity(klass, studentsEnrolledInClass);
    this.validateClassFinish(klass);
    this.validateClassStart(klass);

    const sequence = studentsEnrolledInClass + 1;
    const enrollment = new Enrollment(student, level, module, klass, new Date(), sequence, enrollmentRequest.installments);

    this.studentsRepository.save(student);
    this.enrollmentsRepository.save(enrollment);
    this.generateInstallments(enrollment, module);

    return enrollment.code.value;
  }

  private validateExistingStudent(student: Student): void {
    if(this.enrollmentsRepository.findByCpf(student.cpf.value)) {
      throw new ValidationError('Enrollment with duplicated student is not allowed');
    }
  }

  private validateStudentMinimumAge(student: Student, moduleCode: string): void {
    const module = this.modulesRepository.findByCode(moduleCode);

    if(student.age() < module.minimumAge) {
      throw new ValidationError('Student below minimum age');
    }
  }

  private validateClassMaximumCapacity(klass: Class, studentsEnrolledInClass: number): void {
    if(studentsEnrolledInClass >= klass.capacity) {
      throw new ValidationError('Class is over capacity');
    }
  }

  private validateClassFinish(klass: Class): void {
    if(new Date() > klass.endDate) {
      throw new ValidationError('Class is already finished');
    }
  }

  private validateClassStart(klass: Class): void {
    const currentDatePeriod = new Date().getTime() - klass.startDate.getTime();
    const klassTotalPeriod = klass.endDate.getTime() - klass.startDate.getTime();

    const percentage = (currentDatePeriod / klassTotalPeriod) * 100;

    if (percentage > 25) {
      throw new ValidationError('Class is already started');
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
