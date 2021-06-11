export default class Invoice {
  enrollment: string;
  month: number;
  year: number;
  amount: number;

  constructor({enrollment, month, year, amount}: {enrollment: string, month: number, year: number, amount: number}){
    this.enrollment = enrollment;
    this.month = month;
    this.year = year;
    this.amount = amount;
  }
}
