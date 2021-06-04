import Student from './Student';

export default class Enrollment {
  student: Student;
  level: string;
  module: string;
  classCode: string;
  code: string;
  installments: number;

  constructor(student: Student, level: string, module: string, classCode: string, code: string, installlments: number){
    this.student = student;
    this.level = level;
    this.module = module;
    this.classCode = classCode;
    this.code = code;
    this.installments = installlments;
  }
}
