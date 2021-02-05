import { HeaderList, Item, ItemDefinition, RequestBody, Url } from 'postman-collection';
import { isItem } from '../utils';
import { Collection } from './Collection';
import { Folder } from './Folder';
import { RequestMethod } from './methods';
import { PostmanItem } from './PostmanItem';
import { RequestSettings } from './PostmanSettings';

export class Request extends PostmanItem<Item> {
  private _method: RequestMethod;
  private _body?: string;
  private _settings?: RequestSettings;
  private _url: Url;
  private _headers: HeaderList;

  get method(): RequestMethod { return this._method; }
  set method(value: RequestMethod) {
    this._method = value;
    this.rootItem.request.method = value;
  }

  get body(): string | undefined { return this._body; }
  set body(value: string | undefined) {
    this._body = value;
    let body = this.rootItem.request.body;
    if (body === undefined) {
      body = new RequestBody({ raw: value, mode: 'raw' });
    } else {
      body.update({ raw: value, mode: 'raw' });
    }
  }

  get url(): Url { return this._url; }
  set url(value: Url) {
    this._url = value;
    this.rootItem.request.url = value;
  }

  get settings(): RequestSettings | undefined { return this._settings; }
  set settings(value: RequestSettings | undefined) {
    this._settings = value;
    (this.rootItem as Item & { protocolProfileBehavior?: RequestSettings }).protocolProfileBehavior = value;
  }

  get headers(): HeaderList { return this._headers; }
  set headers(value: HeaderList) {
    this._headers = value;
    this.rootItem.request.headers = value;
  }

  constructor(
    public parent: Collection | Folder,
    item: Item | ItemDefinition
  ) {
    super(isItem(item) ? item : new Item(item));

    this._method = this.rootItem.request.method as RequestMethod;
    this._body = this.rootItem.request.body?.raw;
    this._settings = (this.rootItem as Item & { protocolProfileBehavior?: RequestSettings }).protocolProfileBehavior;
    this._url = this.rootItem.request.url;
    this._headers = this.rootItem.request.headers;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  public static isRequest(obj: any): obj is Request {
    const item = obj.rootItem;

    return item !== undefined && Item.isItem(item);
  }
}
