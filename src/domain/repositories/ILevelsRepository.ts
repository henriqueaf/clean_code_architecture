import Level from '../entities/Level';

export interface ILevelsRepository {//extends IRepository<Level> {
  save({code, description}: {code: string, description: string}): Promise<void>;
  // count(): Promise<number>;
  findByCode(code: string): Promise<Level>;
}
