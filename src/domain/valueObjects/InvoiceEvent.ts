export default class InvoiceEvent {
  type: InvoiceEventType;
  amount: number;

  constructor (type: InvoiceEventType, amount: number) {
    this.type = type;
    this.amount = amount;
  }
}

export enum InvoiceEventType {
  Payment,
  Penalty,
  Interest
}
