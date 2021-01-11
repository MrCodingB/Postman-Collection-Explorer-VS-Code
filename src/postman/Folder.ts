import { Item, ItemGroup, ItemGroupDefinition } from 'postman-collection';
import { Collection } from './Collection';
import { Request } from './Request';
import { isItemGroup, resolveChildren } from '../utils';

export class Folder {
  public rootItem: ItemGroup<Item>;
  public id: string;
  public children: (Folder | Request)[];
  public name: string;
  public description: string;

  constructor(
    public parent: Collection | Folder,
    itemGroup: ItemGroup<Item> | ItemGroupDefinition
  ) {
    this.rootItem = isItemGroup(itemGroup) ? itemGroup : new ItemGroup<Item>(itemGroup);

    this.id = this.rootItem.id;
    this.name = this.rootItem.name;
    this.description = this.rootItem.description?.toString() ?? '';
    this.children = resolveChildren(this.rootItem, this);
  }

  public static isFolder(obj: any): obj is Folder {
    const itemGroup = obj.itemGroup;

    return itemGroup !== undefined && ItemGroup.isItemGroup(itemGroup);
  }
}
