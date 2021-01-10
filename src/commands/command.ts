export interface Command {
  name: string;
  callback(...args: any[]): any;
  thisArg?: any;
}
