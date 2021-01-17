import { Item, ItemGroup, ItemGroupDefinition } from 'postman-collection';
import { Collection } from './Collection';
import { isItemGroup, resolveChildren } from '../utils';
import { Container } from './container';

export class Folder extends Container {
  public rootItem: ItemGroup<Item>;
  public id: string;
  public name: string;
  public description: string;

  constructor(
    public parent: Collection | Folder,
    itemGroup: ItemGroup<Item> | ItemGroupDefinition
  ) {
    super();

    this.rootItem = isItemGroup(itemGroup) ? itemGroup : new ItemGroup<Item>(itemGroup);

    this.id = this.rootItem.id;
    this.name = this.rootItem.name;
    this.description = this.rootItem.description?.toString() ?? '';
    this.children = resolveChildren(this.rootItem, this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  public static isFolder(obj: any): obj is Folder {
    const itemGroup = obj.rootItem;

    return itemGroup !== undefined && ItemGroup.isItemGroup(itemGroup);
  }
}
