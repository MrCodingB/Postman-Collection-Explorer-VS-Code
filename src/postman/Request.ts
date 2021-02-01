import { Item, ItemDefinition, RequestBody } from 'postman-collection';
import { isItem } from '../utils';
import { Collection } from './Collection';
import { Folder } from './Folder';
import { PostmanItem } from './PostmanItem';

export class Request extends PostmanItem<Item> {
  private _method: string;
  private _body?: string;

  get method(): string { return this._method; }
  set method(value: string) {
    this._method = value;
    this.rootItem.request.method = value;
  }

  get body(): string | undefined { return this._body; }
  set body(value: string | undefined) {
    console.log('Value: ', value);
    this._body = value;
    let body = this.rootItem.request.body;
    if (body === undefined) {
      body = new RequestBody({ raw: value, mode: 'raw' });
    } else {
      body.update({ raw: value, mode: 'raw' });
    }

    console.log('New body: ', this.rootItem.request.body);
  }

  constructor(
    public parent: Collection | Folder,
    item: Item | ItemDefinition
  ) {
    super(isItem(item) ? item : new Item(item));

    this._method = this.rootItem.request.method;
    this._body = this.rootItem.request.body?.raw;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  public static isRequest(obj: any): obj is Request {
    const item = obj.rootItem;

    return item !== undefined && Item.isItem(item);
  }
}
