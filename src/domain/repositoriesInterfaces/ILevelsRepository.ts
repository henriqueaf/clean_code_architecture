import Level from '../entities/Level';

export interface ILevelsRepository {
  findByCode(code: string): Level | undefined;
  save(level: Level): boolean;
  count(): number;
}
