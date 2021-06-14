import EnrollmentCode from '../valueObjects/EnrollmentCode';
import Class from './Class';
import Invoice from './Invoice';
import Level from './Level';
import Module from './Module';
import Student from './Student';

export default class Enrollment {
  student: Student;
  level: Level;
  module: Module;
  klass: Class;
  issueDate: Date;
  code: EnrollmentCode;
  installments: number;
  invoices: Invoice[];

  constructor({
    student,
    level,
    module,
    klass,
    issueDate,
    sequence,
    installments
  }: {
    student: Student,
    level: Level,
    module: Module,
    klass: Class,
    issueDate: Date,
    sequence: number,
    installments: number
  }){
    if(student.age() < module.minimumAge) throw new Error('Student below minimum age');
    if(klass.isFinished(issueDate)) throw new Error('Class is already finished');
    if(klass.getProgress(issueDate) > 25) throw new Error('Class is already started');

    this.student = student;
    this.level = level;
    this.module = module;
    this.klass = klass;
    this.issueDate = issueDate;
    this.code = new EnrollmentCode(level.code, module.code, klass.code, issueDate, sequence);
    this.installments = installments;
    this.invoices = [];
    this.generateInvoices();
  }

  private generateInvoices(): void {
    const installmentAmount = Math.trunc((this.module.price / this.installments) * 100) / 100;
    const amountMinusLastInvoice = this.module.price - (installmentAmount * (this.installments - 1));
    const installmentsRestAmount = Math.trunc(amountMinusLastInvoice * 100) / 100;

    for(let i = 1; i < this.installments; i ++) {
      this.invoices.push(new Invoice({
        enrollment: this.code.value,
        month: this.issueDate.getMonth(),
        year: this.issueDate.getFullYear(),
        amount: installmentAmount
      }));
    }

    this.invoices.push(new Invoice({
      enrollment: this.code.value,
      month: this.issueDate.getMonth(),
        year: this.issueDate.getFullYear(),
      amount: installmentsRestAmount
    }));
  }

  public invoicesBalance(): number {
    const balance = this.invoices.reduce(
      (total, invoice) => {
        total += invoice.amount;
        return total;
      },
      0
    ).toFixed(2);

    return Number.parseFloat(balance);
  }
}
