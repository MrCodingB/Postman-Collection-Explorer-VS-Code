import { Collection as PmCollection, Item, ItemGroup } from 'postman-collection';
import { Folder } from './folder';
import { PostmanItem } from './postmanItem';
import { Request } from './request';

export abstract class Container<T extends ItemGroup<Item> | PmCollection = ItemGroup<Item> | PmCollection> extends PostmanItem<T> {
  public children: (Folder | Request)[] = [];

  public addChild(child: Folder | Request): void {
    this.rootItem.items.add(child.rootItem);

    this.children.push(child);
  }

  public removeChild(child: Folder | Request): void {
    this.rootItem.items.remove((c) => c.id === child.rootItem.id, {});

    this.children.splice(this.children.indexOf(child), 1);
  }
}
