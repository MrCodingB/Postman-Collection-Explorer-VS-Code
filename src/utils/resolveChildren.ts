import { Collection as PmCollection, Item, ItemGroup } from 'postman-collection';
import { Collection } from '../postman/collection';
import { Folder } from '../postman/folder';
import { Request } from '../postman/request';
import { isItemGroup } from './typeChecks';

export function resolveChildren(itemGroup: ItemGroup<Item> | PmCollection, parent: Collection | Folder): (Folder | Request)[] {
  return itemGroup.items
    .all()
    .map<Folder | Request>((i) => isItemGroup(i) ? new Folder(parent, i) : new Request(parent, i))
    .sort((a, b) => Request.isRequest(a) && Folder.isFolder(b) ? 1 : Folder.isFolder(a) && Request.isRequest(b) ? -1 : 0);
}
