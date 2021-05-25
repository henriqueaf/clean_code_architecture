import Cpf from '../valueObjects/Cpf';

export default class Student {
  name: string;
  cpf: Cpf;

  constructor(name: string, cpf: string){
    this.name = name;
    this.cpf = new Cpf(cpf);
  }
}
