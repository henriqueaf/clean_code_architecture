import InvoiceEvent, { InvoiceEventType } from '../valueObjects/InvoiceEvent';
import InvoiceStatus from '../valueObjects/InvoiceStatus';
import Cloneable from './interfaces/Cloneable';

export default class Invoice implements Cloneable {
  enrollment: string;
  month: number;
  year: number;
  amount: number;
  dueDate: Date;
  events: InvoiceEvent[];

  constructor({enrollment, month, year, amount}: {enrollment: string, month: number, year: number, amount: number}){
    this.enrollment = enrollment;
    this.month = month;
    this.year = year;
    this.amount = amount;
    this.dueDate = new Date(year, month - 1, 5);
    this.events = [];
  }

  public clone(): JSON {
    return JSON.parse(JSON.stringify(this)) as JSON;
  }

  public getBalance(): number {
    const balance = this.events.reduce((total, event) => {
      if (event.type === InvoiceEventType.Payment) total -= event.amount;
      if (event.type === InvoiceEventType.Penalty) total += event.amount;
      if (event.type === InvoiceEventType.Interest) total += event.amount;
      return total;
    }, this.amount);

    return Math.abs(Math.round(balance*100)/100);
  }

  public addEvent(invoiceEvent: InvoiceEvent): void {
    this.events.push(invoiceEvent);
  }

  public getStatus(currentDate: Date): InvoiceStatus {
    if (this.getBalance() === 0) return InvoiceStatus.Paid;
    if (currentDate.getTime() > this.dueDate.getTime()) return InvoiceStatus.Overdue;
    return InvoiceStatus.Open;
  }

  public getPenalty(currentDate: Date): number {
    if (this.getStatus(currentDate) !== InvoiceStatus.Overdue) return 0;
    const balance = this.getBalance();
    return Math.round((balance * 0.1)*100)/100;
  }

  public getInterets(currentDate: Date): number {
    if (this.getStatus(currentDate) !== InvoiceStatus.Overdue) return 0;
    const balance = this.getBalance();
    const dueDays = Math.floor((currentDate.getTime() - this.dueDate.getTime())/(1000*60*60*24));
    return Math.round((balance * 0.01 * dueDays)*100)/100;
  }
}
