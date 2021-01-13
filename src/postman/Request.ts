import { Item, ItemDefinition } from 'postman-collection';
import { isItem } from '../utils';
import { Collection } from './Collection';
import { Folder } from './Folder';

export class Request {
  public rootItem: Item;
  public id: string;
  public name: string;
  public description: string;
  public method: string;

  constructor(
    public parent: Collection | Folder,
    item: Item | ItemDefinition
  ) {
    this.rootItem = isItem(item) ? item : new Item(item);

    this.id = this.rootItem.id;
    this.name = this.rootItem.name;
    this.description = this.rootItem.description?.toString() ?? '';
    this.method = this.rootItem.request.method;
  }

  public static isRequest(obj: any): obj is Request {
    const item = obj.rootItem;

    return item !== undefined && Item.isItem(item);
  }
}
