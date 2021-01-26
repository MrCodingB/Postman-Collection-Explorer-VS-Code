import { PostmanNativeElement } from '../utils';

export abstract class PostmanItem<T extends PostmanNativeElement = PostmanNativeElement> {
  private _id: string;
  private _name: string;
  private _description: string;

  get id(): string { return this._id; }
  set id(value: string) {
    this._id = value;
    this.rootItem.id = value;
  }

  get name(): string { return this._name; }
  set name(value: string) {
    this._name = value;
    this.rootItem.name = value;
  }

  get description(): string { return this._description; }
  set description(value: string) {
    this._description = value;
    this.rootItem.description = value;
  }

  constructor(public rootItem: T) {
    this._id = rootItem.id;
    this._name = rootItem.name;
    this._description = rootItem.description?.toString() ?? '';
  }
}
