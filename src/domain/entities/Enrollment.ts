import EnrollmentCode from '../valueObjects/EnrollmentCode';
import EnrollmentStatus from '../valueObjects/EnrollmentStatus';
import InvoiceEvent, { InvoiceEventType } from '../valueObjects/InvoiceEvent';
import InvoiceStatus from '../valueObjects/InvoiceStatus';
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
  status: EnrollmentStatus;

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
    this.status = new EnrollmentStatus('active');
    this.generateInvoices();
  }

  private generateInvoices(): void {
    const installmentAmount = Math.trunc((this.module.price / this.installments) * 100) / 100;
    const amountMinusLastInvoice = this.module.price - (installmentAmount * (this.installments - 1));
    const installmentsRestAmount = Math.trunc((Math.round(amountMinusLastInvoice * 100)/100) * 100) / 100;

    for(let i = 1; i < this.installments; i ++) {
      this.invoices.push(new Invoice({
        enrollment: this.code.value,
        month: i,
        year: this.issueDate.getFullYear(),
        amount: installmentAmount
      }));
    }

    this.invoices.push(new Invoice({
      enrollment: this.code.value,
      month: this.installments,
      year: this.issueDate.getFullYear(),
      amount: installmentsRestAmount
    }));
  }

  public invoicesBalance(): number {
    const balance = this.invoices.reduce((total, invoice) => {
      total += invoice.getBalance();
      return total;
    }, 0);

    return Math.abs(Math.round(balance*100)/100);
  }

  public getInvoice(month: number, year: number): Invoice {
    const invoice =  this.invoices.find(invoice => invoice.month === month && invoice.year === year);

    if (!invoice) throw new Error('Invoice not found.');
    return invoice;
  }

  public payInvoice(month: number, year:number, amount: number, paymentDate: Date): void {
    const invoice = this.getInvoice(month, year);

    if(invoice.getStatus(paymentDate) == InvoiceStatus.Overdue){
      invoice.addEvent(new InvoiceEvent(InvoiceEventType.Penalty, invoice.getPenalty(paymentDate)));
      invoice.addEvent(new InvoiceEvent(InvoiceEventType.Interest, invoice.getInterets(paymentDate)));
    }
    invoice.addEvent(new InvoiceEvent(InvoiceEventType.Payment, amount));
  }

  public cancel(): void {
    this.status = new EnrollmentStatus('cancelled');
  }
}
