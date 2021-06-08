import Level from '../entities/Level';
import IRepository from './IRepository';

export interface ILevelsRepository extends IRepository<Level> {
  findByCode(code: string): Level;
}
