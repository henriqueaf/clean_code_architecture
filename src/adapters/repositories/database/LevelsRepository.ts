import Level from '@app/domain/entities/Level';
import { ILevelsRepository } from '@app/domain/repositories/ILevelsRepository';
import ConnectionPool from '@app/infra/database/ConnectionPool';

export class LevelsRepository implements ILevelsRepository {
  async save({code, description}: {code: string, description: string}): Promise<void> {
    await ConnectionPool.save('INSERT INTO system.level(code, description) VALUES($1, $2)', [code, description]) as {code: string, description: string};
  }

  async findByCode(code: string): Promise<Level> {
    const levelData = await ConnectionPool.one('select * from system.level where code = $1', [code]) as {code: string, description: string};

    return new Level(
      levelData.code,
      levelData.description
    );
  }
}
