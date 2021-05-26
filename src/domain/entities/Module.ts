export default class Module {
  level: string;
  code: string;
  description: string;
  minimumAge: number;
  price: number;

  constructor(level: string, code: string, description: string, minimumAge: number, price: number){
    this.level = level;
    this.code = code;
    this.description = description;
    this.minimumAge = minimumAge;
    this.price = price;
  }
}
