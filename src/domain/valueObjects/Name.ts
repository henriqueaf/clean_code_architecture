export default class Name {
  public value = '';

  constructor(value: string){
    if(!isNameValid(value)){
      throw new InvalidNameError();
    }

    this.value = value;
  }
}

export class InvalidNameError extends Error {
  constructor() {
    super('Invalid name');
    this.name = 'InvalidNameError';
  }
}

function isNameValid(name: string): boolean {
  const validNameRegex = /^([A-Za-z]+ )+([A-Za-z])+$/;
  return validNameRegex.test(name);
}
