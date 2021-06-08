import Level from '@app/domain/entities/Level';
import { ILevelsRepository } from '@app/domain/repositoriesInterfaces/ILevelsRepository';
import InMemoryRepository from './InMemoryRepository';

export class LevelsRepository extends InMemoryRepository<Level> implements ILevelsRepository {
  protected data: Level[] = [];

  findByCode(code: string): Level {
    const level = this.data.find(level => {
      return code === level.code;
    });

    if(!level) throw new Error('Level not found!');
    return level;
  }
}
