export default abstract class Repository {
  abstract data: unknown[];

  abstract find(element: unknown): unknown | undefined;
  abstract push(element: unknown): void;
}
