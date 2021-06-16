import InvoiceEvent from '../valueObjects/InvoiceEvent';
import Cloneable from './interfaces/Cloneable';

export default class Invoice implements Cloneable {
  enrollment: string;
  month: number;
  year: number;
  amount: number;
  events: InvoiceEvent[];

  constructor({enrollment, month, year, amount}: {enrollment: string, month: number, year: number, amount: number}){
    this.enrollment = enrollment;
    this.month = month;
    this.year = year;
    this.amount = amount;
    this.events = [];
  }

  public clone(): JSON {
    return JSON.parse(JSON.stringify(this)) as JSON;
  }

  public getBalance(): number {
    const balance = this.events.reduce((total, event) => {
      total -= event.amount;
      return total;
    }, this.amount).toFixed(2);

    return Number.parseFloat(balance);
  }

  public addEvent(invoiceEvent: InvoiceEvent): void {
    this.events.push(invoiceEvent);
  }
}
