export default abstract class Repository {
  constructor(data: Object[]) {}

  abstract find(element: Object): Object | undefined;
  abstract push(element: any): void;
}
