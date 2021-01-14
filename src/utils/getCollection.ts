import { Collection } from '../postman/Collection';
import { Folder } from '../postman/Folder';
import { Request } from '../postman/Request';

export function getCollection(item: Folder | Request | Collection): Collection {
  if (Collection.isCollection(item)) {
    return item;
  }

  let parent: any = item.parent;

  while (parent.parent !== undefined) {
    parent = parent.parent;
  }

  return parent;
}
