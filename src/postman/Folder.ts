import { Item, ItemGroup, ItemGroupDefinition } from 'postman-collection';
import { Collection } from './Collection';
import { isItemGroup, resolveChildren } from '../utils';
import { Container } from './container';

export class Folder extends Container<ItemGroup<Item>> {
  constructor(
    public parent: Collection | Folder,
    itemGroup: ItemGroup<Item> | ItemGroupDefinition
  ) {
    super(isItemGroup(itemGroup) ? itemGroup : new ItemGroup<Item>(itemGroup));

    this.children = resolveChildren(this.rootItem, this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  public static isFolder(obj: any): obj is Folder {
    const itemGroup = obj.rootItem;

    return itemGroup !== undefined && ItemGroup.isItemGroup(itemGroup);
  }
}
