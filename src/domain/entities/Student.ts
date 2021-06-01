import { dateDiffInYears } from '@app/utils/DateUtils';
import Cpf from '../valueObjects/Cpf';
import Name from '../valueObjects/Name';
import { InvalidStudentBirthdate } from './errors/StudentErrors';

export default class Student {
  name: Name;
  cpf: Cpf;
  birthDate: Date;

  constructor(name: string, cpf: string, birthDate: string){
    this.name = new Name(name);
    this.cpf = new Cpf(cpf);
    this.birthDate = new Date(birthDate);

    if(isNaN(this.birthDate.getTime())) {
      throw new InvalidStudentBirthdate();
    }
  }

  public age(): number {
    return dateDiffInYears(new Date(), this.birthDate);
  }
}
