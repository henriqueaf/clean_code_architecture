const SEQUENCE_MAX_DIGITS = 4;

export default class EnrollmentCode {
  public value = '';

  constructor(level: string, module: string, classCode: string, issueDate: Date, sequence: number){
    this.value = this.generateEnrollmentCode(level, module, classCode, issueDate, sequence);
  }

  private generateEnrollmentCode(level: string, module: string, classCode: string, issueDate: Date, sequence: number): string {
    const year = issueDate.getFullYear();
    const sequenceString = sequence.toString().padStart(SEQUENCE_MAX_DIGITS, '0');

    return `${year}${level}${module}${classCode}${sequenceString}`;
  }
}
