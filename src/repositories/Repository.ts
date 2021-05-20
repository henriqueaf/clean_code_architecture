export default abstract class Repository<T> {
  abstract data: T[];

  abstract find(element: T): T | undefined;
  abstract push(element: T): void;
}
