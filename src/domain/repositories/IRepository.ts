export default interface IRepository<T> {
  save(object: T): boolean;
  count(): number;
}
