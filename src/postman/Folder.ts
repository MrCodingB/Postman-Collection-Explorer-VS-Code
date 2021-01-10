import { Item, ItemGroup } from 'postman-collection';
import { Collection } from './Collection';
import { Request } from './Request';
import { resolveChildren } from './resolveChildren';

export class Folder {
  public id: string;
  public children: (Folder | Request)[];
  public name: string;
  public description: string;

  constructor(
    public parent: Collection | Folder,
    public itemGroup: ItemGroup<Item>
  ) {
    this.id = itemGroup.id;
    this.name = itemGroup.name;
    this.description = itemGroup.description?.toString() ?? '';
    this.children = resolveChildren(itemGroup, this);
  }

  public static isFolder(obj: any): obj is Folder {
    const itemGroup = obj.itemGroup;

    return itemGroup !== undefined && ItemGroup.isItemGroup(itemGroup);
  }
}
