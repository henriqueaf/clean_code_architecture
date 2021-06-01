import { ValidationError } from './Errors';
import { IEnrollmentRequest } from './Interfaces';
import {
  IStudentsRepository,
  IModulesRepository,
  IClassesRepository,
  IEnrollmentsRepository
} from '@app/domain/repositoriesInterfaces';
import Student from '@app/domain/entities/Student';
import Enrollment from '@app/domain/entities/Enrollment';

export default class EnrollStudent {
  constructor(
    private studentsRepository: IStudentsRepository,
    private modulesRepository: IModulesRepository,
    private classesRepository: IClassesRepository,
    private enrollmentsRepository: IEnrollmentsRepository
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
      class: classCode
    } = enrollmentRequest;

    const student = new Student(name, cpf, birthDate);
    this.validateExistingStudent(student);
    this.validateStudentMinimumAge(student, module);
    this.validateClassMaximumCapacity(level, module, classCode);
    this.studentsRepository.save(student);

    const enrollment = new Enrollment(student, level, module, classCode);
    this.enrollmentsRepository.save(enrollment);

    const classStudentsCount = this.enrollmentsRepository.allByLevelModuleClass(level, module, classCode).length;
    return enrollment.generateEnrollmentCode(classStudentsCount);
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

  private validateClassMaximumCapacity(level: string, module: string, classCode: string) {
    const klass = this.classesRepository.findByLevelModuleCode(level, module, classCode);
    const classStudentsCount = this.enrollmentsRepository.allByLevelModuleClass(level, module, classCode).length;

    if(klass && classStudentsCount >= klass.capacity) {
      throw new ValidationError('Class is over capacity');
    }
  }
}
