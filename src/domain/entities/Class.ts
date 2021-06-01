import { InvalidClassStartdate, InvalidClassEndDate } from './errors/ClassErrors';

export default class Class {
  level: string;
  module: string;
  code: string;
  capacity: number;
  startDate: Date;
  endDate: Date;

  constructor(level: string, module: string, code: string, capacity: number, startDate: string, endDate: string){
    this.level = level;
    this.code = code;
    this.module = module;
    this.capacity = capacity;
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);

    if(isNaN(this.startDate.getTime())) {
      throw new InvalidClassStartdate();
    }

    if(isNaN(this.endDate.getTime())) {
      throw new InvalidClassEndDate();
    }
  }
}
