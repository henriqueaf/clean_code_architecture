import Level from '../entities/Level';

export interface ILevelRepository {
  findByCode(code: string): Level | undefined;
  save(level: Level): boolean;
  count(): number;
}
