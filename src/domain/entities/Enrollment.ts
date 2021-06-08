import EnrollmentCode from '../valueObjects/EnrollmentCode';
import Class from './Class';
import Level from './Level';
import Module from './Module';
import Student from './Student';

export default class Enrollment {
  student: Student;
  level: Level;
  module: Module;
  klass: Class;
  code: EnrollmentCode;
  installments: number;

  constructor(student: Student, level: Level, module: Module, klass: Class, issueDate: Date, sequence: number, installlments: number){
    if(student.age() < module.minimumAge) throw new Error('Student below minimum age');

    this.student = student;
    this.level = level;
    this.module = module;
    this.klass = klass;
    this.code = new EnrollmentCode(this.level.code, this.module.code, this.klass.code, issueDate, sequence);
    this.installments = installlments;
  }
}
