import IRepository from '@app/domain/repositoriesInterfaces/IRepository';

export default abstract class InMemoryRepository<T> implements IRepository<T> {
  protected abstract data: T[];

  public save(object: T): boolean {
    const previousCount = this.count();

    return this.data.push(object) > previousCount;
  }

  public count(): number {
    return this.data.length;
  }
}
