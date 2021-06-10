export default class Invoice {
  enrollment: string;
  value: number;

  constructor({enrollment, value}: {enrollment: string, value: number}){
    this.enrollment = enrollment;
    this.value = value;
  }
}
