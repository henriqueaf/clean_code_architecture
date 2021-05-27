import { dateDiffInYears } from '@app/utils/DateUtils';
import Cpf from '../valueObjects/Cpf';
import Name from '../valueObjects/Name';
import { InvalidStudentBirthdate, InvalidStudentClassCode } from './errors/StudentErrors';

export default class Student {
  name: Name;
  cpf: Cpf;
  birthDate: Date;
  classCode: string;

  constructor(name: string, cpf: string, birthDate: string, classCode: string){
    this.name = new Name(name);
    this.cpf = new Cpf(cpf);
    this.birthDate = new Date(birthDate);
    this.classCode = classCode;

    if(isNaN(this.birthDate.getTime())) {
      throw new InvalidStudentBirthdate();
    }

    if(!this.classCode || this.classCode.length === 0) {
      throw new InvalidStudentClassCode();
    }
  }

  public age(): number {
    return dateDiffInYears(new Date(), this.birthDate);
  }
}
