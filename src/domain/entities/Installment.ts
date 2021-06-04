export default class Installment {
  enrollment: string;
  value: number;

  constructor(enrollment: string, value: number){
    this.enrollment = enrollment;
    this.value = value;
  }
}
