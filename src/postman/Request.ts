import { Item } from 'postman-collection';
import { Collection } from './Collection';
import { Folder } from './Folder';

export class Request {
  public id: string;
  public name: string;
  public description: string;
  public method: string;

  constructor(
    public parent: Collection | Folder,
    public item: Item
  ) {
    this.id = item.id;
    this.name = item.name;
    this.description = item.description?.toString() ?? '';
    this.method = item.request.method;
  }

  public static isRequest(obj: any): obj is Request {
    const item = obj.item;

    return item !== undefined && Item.isItem(item);
  }
}
