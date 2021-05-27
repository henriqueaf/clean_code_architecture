export class InvalidStudentBirthdate extends Error {
  constructor() {
    super('Invalid student birthdate');
    this.name = 'InvalidStudentBirthdate';
  }
}

export class InvalidStudentClassCode extends Error {
  constructor() {
    super('Student Class code must be present');
    this.name = 'InvalidStudentClassCode';
  }
}
