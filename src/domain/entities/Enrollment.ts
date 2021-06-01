import Student from './Student';

const SEQUENCE_MAX_DIGITS = 4;

export default class Enrollment {
  student: Student;
  level: string;
  module: string;
  classCode: string;

  constructor(student: Student, level: string, module: string, classCode: string){
    this.student = student;
    this.level = level;
    this.module = module;
    this.classCode = classCode;
  }

  public generateEnrollmentCode(studentsCount: number): string {
    const currentYear = new Date().getFullYear();
    const sequence = studentsCount.toString().padStart(SEQUENCE_MAX_DIGITS, '0');

    return `${currentYear}${this.level}${this.module}${this.classCode}${sequence}`;
  }
}
