export type EnrollmentStatusType = 'active' | 'cancelled';

export default class EnrollmentStatus {
  public value: EnrollmentStatusType;

  constructor(value: EnrollmentStatusType){
    this.value = value;
  }
}
