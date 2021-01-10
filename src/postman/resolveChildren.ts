import { Collection as PmCollection, Item, ItemGroup } from 'postman-collection';
import { Collection } from './Collection';
import { Folder } from './Folder';
import { Request } from './Request';
import { isItemGroup } from './typeChecks';

export function resolveChildren(itemGroup: ItemGroup<Item> | PmCollection, parent: Collection | Folder): (Folder | Request)[] {
  return itemGroup.items
    .all()
    .map<Folder | Request>((i) => isItemGroup(i) ? new Folder(parent, i) : new Request(parent, i));
}
