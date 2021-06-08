import EnrollmentCode from '../valueObjects/EnrollmentCode';
import Student from './Student';

export default class Enrollment {
  student: Student;
  level: string;
  module: string;
  classCode: string;
  code: EnrollmentCode;
  installments: number;

  constructor(student: Student, level: string, module: string, classCode: string, issueDate: Date, sequence: number, installlments: number){
    this.student = student;
    this.level = level;
    this.module = module;
    this.classCode = classCode;
    this.code = new EnrollmentCode(this.level, this.module, this.classCode, issueDate, sequence);
    this.installments = installlments;
  }
}
