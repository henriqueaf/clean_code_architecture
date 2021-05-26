export default class Class {
  level: string;
  module: string;
  code: string;
  capacity: number;

  constructor(level: string, module: string, code: string, capacity: number){
    this.level = level;
    this.code = code;
    this.module = module;
    this.capacity = capacity;
  }
}
