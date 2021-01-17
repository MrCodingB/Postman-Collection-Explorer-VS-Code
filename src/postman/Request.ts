import { Item, ItemDefinition } from 'postman-collection';
import { isItem } from '../utils';
import { Collection } from './Collection';
import { Folder } from './Folder';
import { PostmanItem } from './PostmanItem';

export class Request extends PostmanItem<Item> {
  public method: string;

  constructor(
    public parent: Collection | Folder,
    item: Item | ItemDefinition
  ) {
    super(isItem(item) ? item : new Item(item));

    this.method = this.rootItem.request.method;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  public static isRequest(obj: any): obj is Request {
    const item = obj.rootItem;

    return item !== undefined && Item.isItem(item);
  }
}
