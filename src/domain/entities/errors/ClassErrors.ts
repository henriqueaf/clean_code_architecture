export class InvalidClassStartdate extends Error {
  constructor() {
    super('Invalid Class startDate');
    this.name = 'InvalidClassStartdate';
  }
}

export class InvalidClassEndDate extends Error {
  constructor() {
    super('Invalid Class endDate');
    this.name = 'InvalidClassEndDate';
  }
}

