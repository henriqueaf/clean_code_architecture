export default class Invoice {
  enrollment: string;
  // month: number;
  // year: number;
  amount: number;

  constructor({enrollment, amount}: {enrollment: string, amount: number}){
    this.enrollment = enrollment;
    this.amount = amount;
  }
}
