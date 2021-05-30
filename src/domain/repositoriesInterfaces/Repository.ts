export default interface Repository<T> {
  save(object: T): boolean;
  count(): number;
}
