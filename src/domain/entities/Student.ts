import { dateDiffInYears } from '../../utils/DateUtils';
import Cpf from '../valueObjects/Cpf';
import Name from '../valueObjects/Name';

export default class Student {
  name: Name;
  cpf: Cpf;
  birthDate: Date;

  constructor(name: string, cpf: string, birthDate: string){
    this.name = new Name(name);
    this.cpf = new Cpf(cpf);
    this.birthDate = new Date(birthDate);
  }

  public age(): number {
    const currentDate = new Date();

    return dateDiffInYears(currentDate, this.birthDate);
  }
}
