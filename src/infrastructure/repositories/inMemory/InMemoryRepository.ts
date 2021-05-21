export default abstract class InMemoryRepository<T> {
  protected abstract data: T[];
}
