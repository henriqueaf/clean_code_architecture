export default abstract class Repository<T> {
  protected abstract data: T[];

  abstract find(element: T): T | undefined;
  abstract save(element: T): void;
}
