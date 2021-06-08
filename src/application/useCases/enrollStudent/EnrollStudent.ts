import { ValidationError } from './Errors';
import { IEnrollmentRequest } from './Interfaces';
import {
  IStudentsRepository,
  IModulesRepository,
  IClassesRepository,
  IEnrollmentsRepository,
  IInstallmentsRepository
} from '@app/domain/repositoriesInterfaces';
import Student from '@app/domain/entities/Student';
import Enrollment from '@app/domain/entities/Enrollment';
import Installment from '@app/domain/entities/Installment';

export default class EnrollStudent {
  constructor(
    private studentsRepository: IStudentsRepository,
    private modulesRepository: IModulesRepository,
    private classesRepository: IClassesRepository,
    private enrollmentsRepository: IEnrollmentsRepository,
    private installmentsRepository: IInstallmentsRepository
  ) {}

  execute(enrollmentRequest: IEnrollmentRequest): string {
    const {
      student: {
        name,
        cpf,
        birthDate
      },
      level,
      module,
      class: classCode,
      installments
    } = enrollmentRequest;

    const student = new Student(name, cpf, birthDate);
    this.validateExistingStudent(student);
    this.validateStudentMinimumAge(student, module);
    this.validateClassMaximumCapacity(level, module, classCode);
    this.validateClassFinish(level, module, classCode);
    this.validateClassStart(level, module, classCode);

    const sequence = this.enrollmentsRepository.allByLevelModuleClass(level, module, classCode).length + 1;
    const enrollment = new Enrollment(student, level, module, classCode, new Date(), sequence, installments);

    this.studentsRepository.save(student);
    this.enrollmentsRepository.save(enrollment);
    this.generateInstallments(enrollment);

    return enrollment.code.value;
  }

  private validateExistingStudent(student: Student): void {
    if(this.studentsRepository.findByCpf(student.cpf.value)) {
      throw new ValidationError('Enrollment with duplicated student is not allowed');
    }
  }

  private validateStudentMinimumAge(student: Student, moduleCode: string): void {
    const module = this.modulesRepository.findByCode(moduleCode);

    if(student.age() < module.minimumAge) {
      throw new ValidationError('Student below minimum age');
    }
  }

  private validateClassMaximumCapacity(level: string, module: string, classCode: string): void {
    const klass = this.classesRepository.findByLevelModuleCode(level, module, classCode);
    const classStudentsCount = this.enrollmentsRepository.allByLevelModuleClass(level, module, classCode).length;

    if(classStudentsCount >= klass.capacity) {
      throw new ValidationError('Class is over capacity');
    }
  }

  private validateClassFinish(level: string, module: string, classCode: string): void {
    const klass = this.classesRepository.findByLevelModuleCode(level, module, classCode);

    if(new Date() > klass.endDate) {
      throw new ValidationError('Class is already finished');
    }
  }

  private validateClassStart(level: string, module: string, classCode: string): void {
    const klass = this.classesRepository.findByLevelModuleCode(level, module, classCode);

    const currentDatePeriod = new Date().getTime() - klass.startDate.getTime();
    const klassTotalPeriod = klass.endDate.getTime() - klass.startDate.getTime();

    const percentage = (currentDatePeriod / klassTotalPeriod) * 100;

    if (percentage > 25) {
      throw new ValidationError('Class is already started');
    }
  }

  private generateInstallments(enrollment: Enrollment): void {
    const module = this.modulesRepository.findByCode(enrollment.module);

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
