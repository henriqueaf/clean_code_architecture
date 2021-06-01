export class InvalidStudentBirthdate extends Error {
  constructor() {
    super('Invalid student birthdate');
    this.name = 'InvalidStudentBirthdate';
  }
}
