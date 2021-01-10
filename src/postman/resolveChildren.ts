import { Collection as PmCollection, Item, ItemGroup } from 'postman-collection';
import { Collection } from './Collection';
import { Folder } from './Folder';
import { Request } from './Request';
import { isItem, isItemGroup } from './typeChecks';

export function resolveChildren(itemGroup: ItemGroup<Item> | PmCollection, parent: Collection | Folder): (Folder | Request)[] {
  const children: (Folder | Request)[] = [];

  const deepDescendants: (Folder | Request)[] = [];

  const itemGroups = itemGroup.items.all().filter((ig) => isItemGroup(ig)) as ItemGroup<Item>[];
  for (const ig of itemGroups) {
    const folder = new Folder(parent, ig);
    if (deepFind(deepDescendants, (i) => i.id === ig.id) !== undefined) {
      continue;
    }

    children.push(folder);
    deepDescendants.push(...flatten(folder.children));
  }

  const items = itemGroup.items.all().filter((i) => isItem(i)) as Item[];
  for (const i of items) {
    const request = new Request(parent, i);
    if (deepFind(deepDescendants, (i) => i.id === i.id) !== undefined) {
      continue;
    }

    children.push(request);
  }

  return children;
}

export function deepFind(items: (Folder | Request)[], predicate: (item: Folder | Request) => boolean): Folder | Request | undefined {
  let result: Folder | Request | undefined;

  for (const i of items) {
    if (result !== undefined) {
      return result;
    }

    if (Folder.isFolder(i)) {
      result = deepFind(i.children, predicate);
    } else if (predicate(i)) {
      result = i;
    }
  }

  return result;
}

export function flatten<T>(items: (T | T[])[]): T[] {
  var result: T[] = [];

  items.forEach((i) => {
    if (Array.isArray(i)) {
      result.push(...flatten<T>(i));
    } else {
      result.push(i);
    }
  });

  return result;
}
