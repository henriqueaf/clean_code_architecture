export default abstract class Repository {
  abstract data: Object[];

  abstract find(element: Object): Object | undefined;
  abstract push(element: any): void;
}
