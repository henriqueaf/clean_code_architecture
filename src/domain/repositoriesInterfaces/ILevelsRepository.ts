import Level from '../entities/Level';
import Repository from './Repository';

export interface ILevelsRepository extends Repository<Level> {
  findByCode(code: string): Level | undefined;
}
