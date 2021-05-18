export default abstract class Repository {
  abstract data: any[];

  abstract find(element: Object): Object | undefined;
  abstract push(element: any): void;
}
